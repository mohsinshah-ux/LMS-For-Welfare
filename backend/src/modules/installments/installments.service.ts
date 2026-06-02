import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { GenerateInstallmentsDto } from './dto/generate-installments.dto';

@Injectable()
export class InstallmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService
  ) {}

  list() {
    return this.prisma.installment.findMany({
      include: { application: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  async generate(dto: GenerateInstallmentsDto) {
    const created = [];
    const firstDate = new Date(dto.firstDueDate);
    for (let i = 0; i < dto.count; i++) {
      const due = new Date(firstDate);
      due.setMonth(due.getMonth() + i);
      const principal = dto.principalPerInstallment;
      const profit = dto.profitPerInstallment;
      const total = principal + profit;
      created.push(
        this.prisma.installment.create({
          data: {
            applicationId: dto.applicationId,
            installmentNumber: i + 1,
            dueDate: due,
            principalAmount: principal,
            profitAmount: profit,
            totalDue: total,
            outstandingAmount: total
          }
        })
      );
    }
    const rows = await this.prisma.$transaction(created);
    await this.audit.write({
      action: 'INSTALLMENTS_GENERATED',
      entityType: 'financing_application',
      entityId: dto.applicationId,
      newValues: { count: rows.length }
    });
    return rows;
  }
}
