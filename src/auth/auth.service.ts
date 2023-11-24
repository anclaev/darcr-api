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
import { serializeBigInt } from '@common/utils/serialize'
import { ConfigService } from '@common/services'
import { ENV } from '@common/types/env'

import { CreateUserCommand } from 'src/user/commands/create-user'

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
    const isValidRequest = this.isProduction ? this.checkHash(dto) : true

    if (!isValidRequest) throw new UnauthorizedException('Invalid credentials')

    const user = await this.checkExistUser(dto.id)

    if (user) {
      const { telegramId, id } = user
      return {
        user,
        cookie: this.getCookieWithToken({
          id,
          telegramId: serializeBigInt(telegramId) as unknown as bigint,
        }),
      }
    }

    const newUser = (await this.commandBus.execute<CreateUserCommand>(
      new CreateUserCommand({
        telegramId: dto.id,
        auth_date: dto.auth_date ? `${dto.auth_date}` : undefined,
        first_name: dto.first_name ? dto.first_name : undefined,
        last_name: dto.last_name ? dto.last_name : undefined,
        photo_url: dto.photo_url ? dto.photo_url : undefined,
        username: dto.username ? dto.username : undefined,
      }),
    )) as User

    return {
      cookie: this.getCookieWithToken({
        id: newUser.id,
        telegramId: serializeBigInt(newUser.telegramId) as unknown as bigint,
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

  public getTelegramToken(origin: string): string {
    const allowedOrigins = this.config
      .val<string>(ENV.ALLOWED_ORIGINS)
      .split(',')

    if (allowedOrigins.indexOf(origin) === -1) throw new UnauthorizedException()

    return this.config.val<string>(ENV.TELEGRAM_TOKEN)
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
