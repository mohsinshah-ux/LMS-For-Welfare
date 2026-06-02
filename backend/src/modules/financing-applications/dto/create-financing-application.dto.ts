import { IsNumber, IsString, Min } from 'class-validator';

export class CreateFinancingApplicationDto {
  @IsString()
  applicationNo!: string;

  @IsString()
  customerId!: string;

  @IsString()
  financingType!: string;

  @IsNumber()
  @Min(1)
  financingAmount!: number;
}
