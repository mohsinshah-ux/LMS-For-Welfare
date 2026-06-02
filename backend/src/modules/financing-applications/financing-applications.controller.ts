import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateFinancingApplicationDto } from './dto/create-financing-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { FinancingApplicationsService } from './financing-applications.service';

@ApiTags('financing-applications')
@Controller('financing-applications')
export class FinancingApplicationsController {
  constructor(private readonly service: FinancingApplicationsService) {}

  @Get()
  @Permissions('financing_applications.view')
  list() {
    return this.service.list();
  }

  @Post()
  @Permissions('financing_applications.create')
  create(@Body() dto: CreateFinancingApplicationDto) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  @Permissions('financing_applications.status.update')
  updateStatus(@Body() dto: UpdateApplicationStatusDto) {
    return this.service.updateStatus(dto);
  }
}
