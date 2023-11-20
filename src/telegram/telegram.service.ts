import { Context, Telegraf } from 'telegraf'
import { Injectable } from '@nestjs/common'
import { InjectBot } from 'nestjs-telegraf'

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private bot: Telegraf<Context>) {}

  isRunning() {
    return this.bot.context.poll ? this.bot.context.poll.is_closed : false
  }

  close() {
    this.bot.stop()
  }
}
