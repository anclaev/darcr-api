import { Prisma } from '@prisma/client'

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly dto: Prisma.UserUpdateInput,
  ) {}
}
