import { SceneContext } from 'telegraf/typings/scenes'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Middleware } from 'telegraf'

import { TelegramUser } from '@common/interfaces/telegram'
import { UserRepository } from 'src/user/user.repository'

const EMPTY_SESSION: SceneContext['session'] = { __scenes: {} }

@Injectable()
export class SessionService {
  constructor(private readonly repository: UserRepository) {}

  async getSession(telegramId: number): Promise<SceneContext['session']> {
    try {
      const user = await this.repository.findByTelegramId(telegramId)

      if (user) {
        return user.scenes as SceneContext['session']
      } else {
        return EMPTY_SESSION
      }
    } catch (e) {
      return EMPTY_SESSION
    }
  }

  async saveSession(
    session: SceneContext['session'],
    telegramUser: TelegramUser,
  ) {
    try {
      const user = await this.repository.findByTelegramId(telegramUser.userId)

      if (user) {
        await this.repository.update(user.id, {
          scenes: session as Prisma.InputJsonValue,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          auth_date: new Date(),
        })
      } else {
        await this.repository.create({
          telegramId: telegramUser.userId,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          scenes: session as Prisma.InputJsonValue,
        })
      }
    } catch (e) {
      console.log(e)
      return e
    }
  }

  createSession(): Middleware<SceneContext> {
    return async (ctx, next) => {
      const telegramId = ctx.chat!.id
      const userData = ctx.from

      let session: SceneContext['session'] = EMPTY_SESSION

      Object.defineProperty(ctx, 'session', {
        get: function () {
          return session
        },
        set: function (newValue) {
          session = Object.assign({}, newValue)
        },
      })

      session = (await this.getSession(telegramId)) || EMPTY_SESSION

      await next()

      await this.saveSession(session, {
        userId: telegramId,
        username: userData?.username!,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
      })
    }
  }
}
