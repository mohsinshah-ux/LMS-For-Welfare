import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  customerId!: string;

  @IsString()
  fullName!: string;

  @IsString()
  cnic!: string;

  @IsString()
  mobileNumber!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
