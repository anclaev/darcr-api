import { ConfigService as RootConfigService } from '@nestjs/config'
import { TelegrafModuleOptions } from 'nestjs-telegraf'
import { Injectable } from '@nestjs/common'

import { IConfig } from '@common/interfaces'
import { ENV } from '@common/types/env'

@Injectable()
export class ConfigService extends RootConfigService {
  constructor() {
    super()
  }

  val<T>(value: keyof IConfig): T {
    return this.get<T>(value) as T
  }

  port(): number {
    return Number(this.val(ENV.APP_PORT))
  }

  telegrafOptions(): TelegrafModuleOptions {
    const options: TelegrafModuleOptions = {
      token: this.val(ENV.TELEGRAM_TOKEN),
    }

    return options
  }
}
