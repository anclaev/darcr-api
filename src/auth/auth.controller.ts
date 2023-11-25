import { Body, Controller, Get, Headers, Post, Req, Res } from '@nestjs/common'
import { User } from '@prisma/client'
import { Response } from 'express'

import { RequestWithUser } from '@common/interfaces/request-with-user'
import { serializeBigInt } from '@common/utils/serialize'
import { TelegramUserPayload } from '@common/types/dto'
import { cookieToString } from '@common/utils/cookie'
import { Auth } from '@common/decorators'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  async getTelegamToken(@Headers() headers: Headers & { origin: string }) {
    return this.authService.getTelegramToken(headers.origin)
  }

  @Auth()
  @Get('me')
  async isAuthenticated(@Req() req: RequestWithUser): Promise<User> {
    return req.user
  }

  @Post('sign-in')
  async signIn(@Body() payload: TelegramUserPayload, @Res() res: Response) {
    const { user, cookie } = await this.authService.signIn({
      ...payload,
      id: serializeBigInt(payload.id),
    })

    res.setHeader('Set-Cookie', cookieToString(cookie))

    if (user.telegramId)
      user.telegramId = serializeBigInt(user.telegramId) as unknown as bigint

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
