import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { GetUserListQuery } from '../queries/get-user-list'
import { UserRepository } from '../user.repository'

@QueryHandler(GetUserListQuery)
export class GetUserListHandler implements IQueryHandler<GetUserListQuery> {
  constructor(private repository: UserRepository) {}

  async execute({ dto }: GetUserListQuery): Promise<User[]> {
    const { skip, take, cursor } = dto
    return await this.repository.find({
      skip,
      take,
      cursor,
      where: {
        username: dto.username ? { contains: dto.username } : undefined,
        first_name: dto.first_name ? { contains: dto.first_name } : undefined,
        last_name: dto.last_name ? { contains: dto.last_name } : undefined,
        telegramId: dto.telegramId,
      },
    })
  }
}
