import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://secure-blog-platform-frontend.vercel.app',
    ],
    credentials: true,
  });
  // await app.listen(3000);
  const port: number = Number(process.env.PORT) || 3000;
  await app.listen(port);
}
bootstrap();
