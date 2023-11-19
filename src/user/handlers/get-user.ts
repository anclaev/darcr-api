import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { UserRepository } from '../user.repository'
import { GetUserQuery } from '../queries/get-user'

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private repository: UserRepository) {}

  async execute({ dto }: GetUserQuery): Promise<User | null> {
    return await this.repository.findOne(dto.id!)
  }
}
