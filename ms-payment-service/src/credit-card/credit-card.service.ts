
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreditCard, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CreditCardService {
  constructor(
    private prisma: PrismaService,
    @Inject('NOTIFICATION_SERVICE') private client: ClientProxy,
  ) {}

  async create(data: Prisma.CreditCardCreateInput): Promise<CreditCard> {
    // salva transação como pendente (paymentConfirmed=false)
    const creditCard = await this.prisma.creditCard.create({ data });

    // publica evento de solicitação recebida
    this.sendRegisterPaymentNotification(JSON.stringify(creditCard));

    // fluxo assíncrono
    this.processPayment(creditCard);

    return creditCard;
  }

  async processPayment(payment: CreditCard) {
    setTimeout(async () => {
      //confirma transação: atualiza status para sucesso
      const confirmed = await this.prisma.creditCard.update({
        where: { id: payment.id },
        data: { paymentConfirmed: true },
      });

      // publica evento de confirmação com dados atualizados
      this.sendConfirmationPaymentNotification(JSON.stringify(confirmed));
    }, 10000);
  }

  sendRegisterPaymentNotification(message: string) {
    this.client.emit('register', {
      id: randomUUID(),
      data: { notification: message },
    });
  }

  sendConfirmationPaymentNotification(message: string) {
    this.client.emit('confirmation', {
      id: randomUUID(),
      data: { notification: message },
    });
  }
}
