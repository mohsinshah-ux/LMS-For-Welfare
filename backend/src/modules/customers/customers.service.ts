import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  private readonly rows: Array<Record<string, unknown>> = [];

  list() {
    return this.rows;
  }

  create(dto: CreateCustomerDto) {
    const row = {
      id: crypto.randomUUID(),
      ...dto,
      createdAt: new Date().toISOString()
    };
    this.rows.push(row);
    return row;
  }
}
