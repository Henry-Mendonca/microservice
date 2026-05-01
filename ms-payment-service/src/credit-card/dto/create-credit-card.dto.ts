import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCreditCardDto {
  @IsString()
  idUser: string;

  @IsNumber()
  orderNumber: number;

  @IsNumber()
  orderValue: number;

  @IsOptional()
  @IsBoolean()
  paymentConfirmed?: boolean;
}
