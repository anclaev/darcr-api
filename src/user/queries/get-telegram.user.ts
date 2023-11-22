import { Prisma } from '@prisma/client'

export class GetTelegramUserQuery {
  constructor(public readonly dto: Prisma.UserWhereUniqueInput) {}
}
