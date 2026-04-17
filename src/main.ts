import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const dataDir = join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('Módulo de tarefas — desafio TreeUnfe')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'x-organization-id', in: 'header' },
      'organization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  const publicBase =
    process.env.PUBLIC_BASE_URL?.replace(/\/$/, '') ??
    `http://localhost:${port}`;

  logger.log(`Swagger UI: ${publicBase}/docs`);
  logger.log(`API: ${publicBase}/api/v1`);
}

void bootstrap();
