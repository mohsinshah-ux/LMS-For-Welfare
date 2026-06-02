import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomersService } from './customers.service';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Permissions('customers.view')
  list() {
    return this.customersService.list();
  }

  @Post()
  @Permissions('customers.create')
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }
}
