import { Body, Controller, Get, Post } from '@nestjs/common';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { GenerateInstallmentsDto } from './dto/generate-installments.dto';
import { InstallmentsService } from './installments.service';

@Controller('installments')
export class InstallmentsController {
  constructor(private readonly service: InstallmentsService) {}

  @Get()
  @Permissions('financing_applications.view')
  list() {
    return this.service.list();
  }

  @Post('generate')
  @Permissions('financing_applications.status.update')
  generate(@Body() dto: GenerateInstallmentsDto) {
    return this.service.generate(dto);
  }
}
