import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { FinancingApplicationsController } from './financing-applications.controller';
import { FinancingApplicationsService } from './financing-applications.service';

@Module({
  imports: [AuditLogModule],
  controllers: [FinancingApplicationsController],
  providers: [FinancingApplicationsService]
})
export class FinancingApplicationsModule {}
