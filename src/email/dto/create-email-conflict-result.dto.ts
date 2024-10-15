import { ApiProperty } from '@nestjs/swagger';
import { CreateEmailResultDto } from './create-email-result.dto';

export class CreateEmailConflictResultDto {
  @ApiProperty({
    description: 'Details of the newly created email message (if applicable)',
    type: CreateEmailResultDto,
  })
  created: CreateEmailResultDto[];

  @ApiProperty({
    description: 'Details of the existing email message that caused conflict (if applicable)',
    type: CreateEmailResultDto,
  })
  existing: CreateEmailResultDto[];
}
