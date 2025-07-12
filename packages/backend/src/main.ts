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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.use(cookieParser());

  await app.register<FastifyCookieOptions>(fastifyCookie, {
    secret: process.env.COOKIE_SECRET, // optional, for signed cookies
  });

  const documentFactory = () =>
    SwaggerModule.createDocument(app, new DocumentBuilder().build());
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () =>
    process.env.NODE_ENV === 'dev' ? console.log(`Swagger: http://localhost:${port}/api`) : null,
  );
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
