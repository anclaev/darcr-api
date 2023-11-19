import { IsDate, IsString, IsNumber } from 'class-validator'
import { User } from '@prisma/client'

import { RestrictProperties } from 'src/common/dtos/common.dto'

export class UserEntity implements RestrictProperties<UserEntity, User> {
  @IsNumber()
  id: number

  @IsString()
  username: string

  @IsString()
  first_name: string | null

  @IsString()
  last_name: string | null

  @IsString()
  photo_url: string | null

  @IsNumber()
  telegramId: number

  @IsDate()
  auth_date: Date
}
