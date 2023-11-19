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
