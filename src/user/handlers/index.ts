import { CreateUserHandler } from './create-user'
import { UpdateUserHandler } from './update-user'
import { DeleteUserHandler } from './delete-user'
import { GetUserHandler } from './get-user'

export const UserHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  GetUserHandler,
]
