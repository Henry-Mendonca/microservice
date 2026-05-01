import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  @EventPattern('register')
  handleRegister(@Payload() payload: any, @Ctx() ctx: RmqContext) {
    this.logger.log(`NOTIF: solicitação recebida -> ${JSON.stringify(payload)}`);
    const channel = ctx.getChannelRef();
    channel.ack(ctx.getMessage());
  }

  @EventPattern('confirmation')
  handleConfirmation(@Payload() payload: any, @Ctx() ctx: RmqContext) {
    this.logger.log(`NOTIF: pagamento confirmado -> ${JSON.stringify(payload)}`);
    const channel = ctx.getChannelRef();
    channel.ack(ctx.getMessage());
  }
}
