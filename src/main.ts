import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth_service',
        url: process.env.AUTH_SERVICE_URL,
        protoPath: join(__dirname, '../src/auth/auth.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
