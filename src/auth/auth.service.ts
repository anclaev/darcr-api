import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'

import * as crypto from 'crypto'

import { GetTelegramUserQuery } from 'src/user/queries/get-telegram.user'

import {
  Cookie,
  environment,
  SignInPayload,
  TokenPayload,
} from '@common/types/interfaces'

import { TelegramUserPayload } from '@common/types/dto'
import { ConfigService } from '@common/services'
import { ENV } from '@common/types/env'
import { CreateUserCommand } from 'src/user/commands/create-user'
import { serializeBigInt } from '@common/utils/serialize'

@Injectable()
export class AuthService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private isProduction =
    environment === 'production' || environment === 'staging'

  private tokenExpiration = 7200

  async signIn(dto: TelegramUserPayload): Promise<SignInPayload> {
    const isValidRequest = this.checkHash(dto)

    if (!isValidRequest) throw new UnauthorizedException('Invalid credentials')

    const user = await this.checkExistUser(dto.id)

    if (user) {
      const { telegramId, id, username } = user
      return {
        user,
        cookie: this.getCookieWithToken({
          id,
          telegramId: serializeBigInt(telegramId) as unknown as bigint,
          username,
        }),
      }
    }

    const newUser = (await this.commandBus.execute<CreateUserCommand>(
      new CreateUserCommand({
        ...dto,
        telegramId: dto.id,
        auth_date: `${dto.auth_date}`,
      }),
    )) as User

    const { id, telegramId, username } = newUser

    return {
      cookie: this.getCookieWithToken({
        id,
        telegramId: serializeBigInt(telegramId) as unknown as bigint,
        username,
      }),
      user: newUser,
    }
  }

  public getCookieWithToken(payload: TokenPayload): Cookie {
    const token = this.jwtService.sign(payload, {
      secret: this.config.val<string>(ENV.JWT_SECRET),
      expiresIn: `${this.tokenExpiration}s`,
    })

    return {
      key: 'Authentication',
      value: token,
      httpOnly: true,
      secure: this.isProduction,
      path: '/',
      maxAge: this.tokenExpiration,
    }
  }

  public getCookieForLogout() {
    return `Authentication=; HttpOnly; ${
      this.isProduction ? 'Secure; ' : ''
    }Path=/; Max-Age=0`
  }

  private async checkExistUser(id: number): Promise<User | null> {
    return await this.queryBus.execute<GetTelegramUserQuery>(
      new GetTelegramUserQuery({ telegramId: id }),
    )
  }

  private checkHash(data: TelegramUserPayload): Boolean {
    const hash = data.hash
    delete data.hash

    const dataCheckString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key as keyof TelegramUserPayload]}`)
      .join('\n')

    const secretKey = crypto
      .createHash('sha256')
      .update(process.env.TELEGRAM_TOKEN!)
      .digest()

    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    return hmac === hash
  }
}
