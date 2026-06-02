import { Injectable } from '@nestjs/common';
import { CreateFinancingApplicationDto } from './dto/create-financing-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class FinancingApplicationsService {
  private readonly rows: Array<Record<string, unknown>> = [];

  list() {
    return this.rows;
  }

  create(dto: CreateFinancingApplicationDto) {
    const app = {
      id: crypto.randomUUID(),
      applicationNo: dto.applicationNo,
      customerId: dto.customerId,
      financingAmount: dto.financingAmount,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    this.rows.push(app);
    return app;
  }

  updateStatus(dto: UpdateApplicationStatusDto) {
    return {
      message: 'Status transition recorded',
      ...dto,
      changedAt: new Date().toISOString()
    };
  }
}
