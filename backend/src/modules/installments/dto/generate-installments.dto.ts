import { IsDateString, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class GenerateInstallmentsDto {
  @IsString()
  applicationId!: string;

  @IsInt()
  @Min(1)
  count!: number;

  @IsDateString()
  firstDueDate!: string;

  @IsNumber()
  @Min(0)
  principalPerInstallment!: number;

  @IsNumber()
  @Min(0)
  profitPerInstallment!: number;
}
