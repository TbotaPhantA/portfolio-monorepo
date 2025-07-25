import 'reflect-metadata';
import 'dotenv/config.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { otelSDK } from './infrastructure/otel/instrumentation';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  otelSDK.start();
  console.log('Started OTEL SDK');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  await app.register<FastifyCookieOptions>(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // optional, for signed cookies
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const documentFactory = () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().addBearerAuth().build(),
    );
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () =>
    console.log(`Swagger: http://localhost:${port}/api`),
  );
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
