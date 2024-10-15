import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message || 'Internal Server Error!';
    const extResponse = exception.getResponse()

    response.status(status).json({
      statusCode: status,
      message: message,
      results: extResponse['results'],
      errors: extResponse['errors']
    });
  }
}
