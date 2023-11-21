import { Injectable } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'
import { Prisma, User } from '@prisma/client'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByTelegramId(telegramId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        telegramId,
      },
    })
  }

  async find(params: {
    skip?: number
    take?: number
    cursor?: number
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
      cursor: cursor
        ? {
            id: Number(cursor),
          }
        : undefined,
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    })
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    })
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    })
  }
}
