import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'

import { User } from '@prisma/client'

import { UserService } from './user.service'

import { CreateUserDto, UpdateUserDto } from './dtos'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<User> {
    const user = await this.userService.getById(id)

    if (!user) throw new NotFoundException('User not found')

    return user
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.create(dto)
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, dto)
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<Boolean> {
    return !!(await this.userService.delete(id))
  }
}
