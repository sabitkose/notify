// src/common/filters/mongo-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // Handle specific MongoDB duplicate key error
    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate key error';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
