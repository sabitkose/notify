import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CustomConfig } from './common/customConfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(CustomConfig.DB_URL),
    EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
