import { CreateUserHandler } from './create-user'
import { UpdateUserHandler } from './update-user'
import { DeleteUserHandler } from './delete-user'

import { GetUserListHandler } from './get-user-list'
import { GetUserHandler } from './get-user'

export const UserHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  GetUserHandler,
  GetUserListHandler,
]
