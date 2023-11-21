import { Prisma } from '@prisma/client'

export class CreateUserCommand {
  constructor(public readonly dto: Prisma.UserCreateInput) {}
}
