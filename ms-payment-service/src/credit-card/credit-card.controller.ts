
import { Body, Controller, Post } from '@nestjs/common';
import { CreditCard } from '@prisma/client';
import { CreditCardService } from './credit-card.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';

@Controller('credit-cards')
export class CreditCardController {
  constructor(private readonly service: CreditCardService) {}

  @Post()
  async create(@Body() dto: CreateCreditCardDto): Promise<CreditCard> {
    return this.service.create({
      idUser: dto.idUser,
      orderNumber: dto.orderNumber,
      orderValue: dto.orderValue,
      paymentConfirmed: dto.paymentConfirmed ?? false,
    });
  }
}
