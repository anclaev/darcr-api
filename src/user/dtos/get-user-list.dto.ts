import { PaginationInput } from '@common/types/dto'

import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class GetUserListDto extends PaginationInput {
  @IsString()
  @IsOptional()
  username?: string

  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsNumberString()
  @IsOptional()
  telegramId?: number
}
