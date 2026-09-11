import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: AppModule.CONFIGURATION.TCP_SERV.TCP_PDF_GENERATOR_SERVICE.options.host,
      port: AppModule.CONFIGURATION.TCP_SERV.TCP_PDF_GENERATOR_SERVICE.options.port,
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.TCP_PDF_GENERATOR_SERVICE || 3005;

  await app.startAllMicroservices();
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
