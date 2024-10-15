import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailResultDto {
    @ApiProperty({ description: 'ID of the record' })
    id: string;

    @ApiProperty({ description: 'Unique key for the message, representing the unique identifier of the operation to be processed by the client.' })
    uniqueMessageKey: string;

    @ApiProperty({ description: 'Status of the message', enum: ['awaiting', 'sent'] })
    status: 'awaiting' | 'sent';

    @ApiProperty({ description: 'Retry count for the message' })
    retryCount: number;

    @ApiProperty({ description: 'Template used for the message' })
    template: string;

    @ApiProperty({ description: 'Identity of the message, indicating the person to whom the client-sent request belongs.' })
    identity: string;

    @ApiProperty({ description: 'Contact information, typically an email address, associated with the message.' })
    contact: string;

    @ApiProperty({ description: 'Language of the message', required: false })
    language?: string;

    @ApiProperty({ description: 'Data associated with the message', required: false })
    data?: any;

    @ApiProperty({ description: 'Subject of the message' })
    subject: string;

    @ApiProperty({ description: 'HTML content of the message.' })
    content: string;

    @ApiProperty({ description: 'Date when the request was made' })
    requestDate: { type: Date, default: Date };

    @ApiProperty({
      description: 'Mail sent information',
      required: false,
      type: 'object',
      properties: {
        envelope: {
          type: 'object',
          properties: {
            from: { type: 'string' },
            to: { type: 'array', items: { type: 'string' } },
          },
        },
        messageId: { type: 'string' },
      },
    })
    mailSentInfo?: any;

    @ApiProperty({ description: 'Preview URL of the message' })
    previewURL: string;
}
