import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const url = process.env.RABBITMQ_URL || 'amqp://admin:123456@localhost:5672';
  const queue = process.env.RABBITMQ_QUEUE || 'notification';

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      noAck: false,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}
bootstrap();
