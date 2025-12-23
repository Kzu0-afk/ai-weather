import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.FRONTEND_ORIGIN?.split(',').map((origin) => origin.trim()) ??
      ['http://localhost:3000'],
    methods: ['GET'],
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
}
bootstrap();
