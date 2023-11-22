import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { GetTelegramUserQuery } from '../queries/get-telegram.user'

import { UserRepository } from '../user.repository'

@QueryHandler(GetTelegramUserQuery)
export class GetTelegramUserHandler
  implements IQueryHandler<GetTelegramUserQuery>
{
  constructor(private repository: UserRepository) {}

  async execute({ dto }: GetTelegramUserQuery): Promise<User | null> {
    return await this.repository.findByTelegramId(dto.telegramId!)
  }
}
