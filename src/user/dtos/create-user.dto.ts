import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsNumber()
  @IsNotEmpty()
  telegramId: number

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
