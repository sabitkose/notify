import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { ValidationPipe } from './common/validationPipe';
import { CustomConfig } from './common/customConfig';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['*.*.com', 'localhost:'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle("Sabit's Notification Service")
    .setDescription(
      "Sabit's Notification Service provides APIs for sending notifications such as emails.",
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-documents', app, document);

  await app.listen(CustomConfig.APP_PORT);
}
bootstrap();
