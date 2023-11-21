import { Prisma } from '@prisma/client'

export class GetUserQuery {
  constructor(public readonly dto: Prisma.UserWhereUniqueInput) {}
}
