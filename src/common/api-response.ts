import { Response, HttpStatus } from '@nestjs/common';

  export class ApiResponse {
    static success(data: any, statusCode: number = HttpStatus.OK, message: string = 'Success') {
      return {
        statusCode,
        message,
        results: data,
      };
    }
  
    static error(data: any, errors: any, statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR, message: string = 'Internal Server Error') {
      return {
        statusCode,
        message,
        errors,
        results: data
      };
    }
  }