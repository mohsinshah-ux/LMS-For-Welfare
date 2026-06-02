import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  installmentId!: string;

  @IsString()
  paymentMethod!: 'cash' | 'bank_transfer' | 'mobile_wallet' | 'cheque';

  @IsNumber()
  @Min(0.01)
  amountPaid!: number;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
