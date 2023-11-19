import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'

import { CreateUserCommand } from './commands/create-user'
import { UpdateUserCommand } from './commands/update-user'
import { DeleteUserCommand } from './commands/delete-user'

import { GetUserQuery } from './queries/get-user'

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async create(dto: Prisma.UserCreateInput): Promise<User> {
    return await this.commandBus.execute(new CreateUserCommand(dto))
  }

  async getById(id: number): Promise<User | null> {
    return await this.queryBus.execute(new GetUserQuery({ id }))
  }

  async update(id: number, dto: Prisma.UserUpdateInput): Promise<User> {
    return await this.commandBus.execute(new UpdateUserCommand(id, dto))
  }

  async delete(id: number): Promise<User> {
    return await this.commandBus.execute(new DeleteUserCommand(id))
  }
}
