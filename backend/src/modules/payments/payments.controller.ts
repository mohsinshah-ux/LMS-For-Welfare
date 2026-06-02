import { Body, Controller, Get, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get()
  @Permissions('financing_applications.view')
  list() {
    return this.service.list();
  }

  @Post()
  @Permissions('financing_applications.status.update')
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto);
  }
}
