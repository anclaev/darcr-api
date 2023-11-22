import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import * as crypto from 'crypto'

import { GetTelegramUserQuery } from 'src/user/queries/get-telegram.user'

import { TelegramUserPayload } from '@common/types/dto'

@Injectable()
export class AuthService {
  constructor(private readonly queryBus: QueryBus) {}

  async signIn(dto: TelegramUserPayload) {
    // const existUser = await this.checkExistUser(dto.id)

    // if (existUser) return

    return this.checkHash(dto)
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
