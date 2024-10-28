import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configure } from './_grobal_config/config/app.config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  configure(app);

  const port = app.get(ConfigService).get('port');
  await app.listen(port);
  Logger.log(`Server running on ${port}`);
}
bootstrap();
