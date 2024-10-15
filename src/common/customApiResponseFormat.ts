import { ApiProperty, ApiResponse, ApiOperation } from '@nestjs/swagger';

export class CustomApiResponseFormat {
  @ApiProperty({ description: 'Status code for the response' })
  statusCode: number;

  @ApiProperty({ description: 'Message for the response' })
  message: string;

  @ApiProperty({ description: 'Data for the response' })
  results: any;

  @ApiProperty({ description: 'Error information for the response' })
  error: any;

  constructor(options: { statusCode: number, message: string, results?: any, error?: any }) {
    this.statusCode = options.statusCode;
    this.message = options.message;
    this.results = options.results || null;
    this.error = options.error || null;
  }

  static success(data: any, statusCode: number = 200, message: string = 'Success') {
    return new CustomApiResponseFormat({ statusCode, message, results: data });
  }
}
