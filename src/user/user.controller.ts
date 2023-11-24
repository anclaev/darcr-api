import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'

import { User } from '@prisma/client'

import { UserService } from './user.service'

import { CreateUserDto, UpdateUserDto, GetUserListDto } from './dtos'

import { Auth } from '@common/decorators'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @Auth()
  async getUser(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getById(id)

    if (!user) throw new NotFoundException('User not found')

    if (user.telegramId)
      user.telegramId = this.userService.serializeBigInt(
        user.telegramId,
      ) as unknown as bigint

    return user
  }

  @Get()
  @Auth()
  async getUserList(@Query() query: GetUserListDto): Promise<User[]> {
    const users = await this.userService.getList(query)

    return users.map((user) => {
      if (user.telegramId)
        user.telegramId = this.userService.serializeBigInt(
          user.telegramId,
        ) as unknown as bigint

      return user
    })
  }

  @Post()
  @Auth()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(dto)

    if (user.telegramId)
      user.telegramId = this.userService.serializeBigInt(
        user.telegramId,
      ) as unknown as bigint

    return user
  }

  @Put(':id')
  @Auth()
  async updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, dto)
  }

  @Delete(':id')
  @Auth()
  async deleteUser(@Param('id') id: number): Promise<Boolean> {
    return !!(await this.userService.delete(id))
  }
}
