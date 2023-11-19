import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { User } from '@prisma/client'

import { DeleteUserCommand } from '../commands/delete-user'
import { UserRepository } from '../user.repository'

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private repository: UserRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<User> {
    return await this.repository.remove(id)
  }
}
