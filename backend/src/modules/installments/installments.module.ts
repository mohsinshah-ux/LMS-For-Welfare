import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { InstallmentsController } from './installments.controller';
import { InstallmentsService } from './installments.service';

@Module({
  imports: [AuditLogModule],
  controllers: [InstallmentsController],
  providers: [InstallmentsService]
})
export class InstallmentsModule {}
