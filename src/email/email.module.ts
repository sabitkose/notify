// src/city/city.module.ts
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../message/message.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
