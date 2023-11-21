import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { UpdateUserCommand } from '../commands/update-user'
import { UserRepository } from '../user.repository'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<User> {
    return this.repository.update(id, dto)
  }
}
