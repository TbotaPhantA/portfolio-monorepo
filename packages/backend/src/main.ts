import 'dotenv/config.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    if (process.env.ENV === 'dev') {
      console.log(`Swagger: http://localhost:${port}/api`);
    }
  });
}
bootstrap();
