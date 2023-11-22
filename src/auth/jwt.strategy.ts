import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { User } from '@prisma/client'
import { Request } from 'express'

import { TokenPayload } from '@common/types/interfaces'
import { ConfigService } from '@common/services'
import { ENV } from '@common/types/env'

import { GetUserQuery } from 'src/user/queries/get-user'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: config.get<string>(ENV.JWT_SECRET),
    })
  }

  async validate(data: TokenPayload): Promise<User | boolean> {
    return await this.queryBus.execute<GetUserQuery>(
      new GetUserQuery({ id: data.id }),
    )
  }
}
