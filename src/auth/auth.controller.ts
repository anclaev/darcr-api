import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { TelegramUserPayload } from '@common/types/dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() payload: TelegramUserPayload) {
    return await this.authService.signIn(payload)
  }
}
