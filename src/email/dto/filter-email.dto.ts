import { IsString, IsIn, Matches, IsOptional, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';

class DateRange {
  @ApiProperty({ description: 'Start date of the range', type: 'string', format: 'date-time' })
  start: Date;

  @ApiProperty({ description: 'End date of the range', type: 'string', format: 'date-time' })
  end: Date;
}


export class FilterEmailDto {

  @ApiProperty({
    description: 'Status of the message',
    enum: ['awaiting', 'sent'],
    required: false,
    default: undefined,
  })
  @IsIn(['awaiting', 'sent'], { message: 'Invalid status. Must be one of: awaiting, sent' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => (value && value.toLowerCase()))
  status?: 'awaiting' | 'sent';

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Language of the message', required: false, default: undefined })
  @Matches(/^[a-z]{2}-[A-Z]{2}$/, { message: 'Invalid language format' })
  language?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Unique key of the message', required: false, default: undefined })
  uniqueMessageKey?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Identity of the message', required: false, default: undefined })
  identity?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Contact email', required: false, default: undefined })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Invalid email format' })
  contact: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Subject of the message', required: false, default: undefined })
  subject: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Template of the message', required: false, default: undefined })
  template?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Date range for the request',
    required: false,
    default: undefined,
    type: DateRange,
  })
  requestDate?: DateRange;


}
