import { Module } from '@nestjs/common'

import { UserService } from './user.service'
import { UserCommands } from './commands'
import { UserQueries } from './queries'
import { UserHandlers } from './handlers'
import { UserRepository } from './user.repository'
import { UserController } from './user.controller';

@Module({
  providers: [
    UserService,
    UserRepository,
    ...UserCommands,
    ...UserQueries,
    ...UserHandlers,
  ],
  controllers: [UserController],
})
export class UserModule {}
