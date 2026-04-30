import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { CreditCardController } from './credit-card.controller';
import { CreditCardService } from './credit-card.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CreditCardController],
  providers: [
    PrismaService,
    CreditCardService,
    {
      provide: 'NOTIFICATION_SERVICE',
      useFactory: () => {
        const user = process.env.RABBITMQ_USER || 'admin';
        const pass = process.env.RABBITMQ_PASS || '123456';
        const url =
          process.env.RABBITMQ_URL || `amqp://${user}:${pass}@localhost:5672`;

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [url],
            queue: 'notification',
            queueOptions: { durable: true },
          },
        });
      },
    },
  ],
})
export class CreditCardModule {}
