import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { CreateUserCommand } from '../commands/create-user'
import { UserRepository } from '../user.repository'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute({ dto }: CreateUserCommand): Promise<User> {
    return this.repository.create(dto)
  }
}
