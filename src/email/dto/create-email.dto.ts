import { IsString, IsIn, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  uniqueMessageKey: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  identity: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email format' })
  contact: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  @Matches(/^[a-z]{2}-[A-Z]{2}$/, { message: 'Invalid language format' })
  language?: string;

  @IsOptional()
  @ApiProperty()
  data?: any;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  subject: string;

}
