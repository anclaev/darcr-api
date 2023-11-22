import { Body, Controller, Post, Res } from '@nestjs/common'
import { Response } from 'express'

import { TelegramUserPayload } from '@common/types/dto'
import { cookieToString } from '@common/utils/cookie'

import { AuthService } from './auth.service'
import { Auth } from '@common/decorators'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() payload: TelegramUserPayload, @Res() res: Response) {
    const { user, cookie } = await this.authService.signIn(payload)

    res.setHeader('Set-Cookie', cookieToString(cookie))

    return res.send(user)
  }

  @Auth()
  @Post('sign-out')
  async logout(@Res() res: Response) {
    const cookie = this.authService.getCookieForLogout()

    res.setHeader('Set-Cookie', cookie)

    return res.sendStatus(200)
  }
}
