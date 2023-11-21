import { TelegrafModule } from 'nestjs-telegraf'
import { Module } from '@nestjs/common'

import { ConfigService, SessionService } from '@common/services'

import { TelegramService } from './telegram.service'
import { TelegramUpdate } from './telegram.update'
import { CHOOSE_SCENES } from './scenes'

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (config: ConfigService, session: SessionService) => ({
        ...config.telegrafOptions(),
        middlewares: [session.createSession()],
      }),
      inject: [ConfigService, SessionService],
    }),
  ],
  providers: [TelegramService, TelegramUpdate, ...CHOOSE_SCENES],
})
export class TelegramModule {}
