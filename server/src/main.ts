import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: env.CORS_ORIGIN },
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  
  await app.listen(env.PORT);
  console.log(`Nest server running on http://localhost:${env.PORT}`);
}

bootstrap();
