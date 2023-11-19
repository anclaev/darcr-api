import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string

  @IsNumber()
  @IsOptional()
  telegramId?: number

  @IsString()
  @IsOptional()
  first_name?: string | null

  @IsString()
  @IsOptional()
  last_name?: string | null

  @IsString()
  @IsOptional()
  photo_url?: string | null

  @IsDate()
  @IsOptional()
  auth_date?: Date
}
