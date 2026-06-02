import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateFinancingApplicationDto } from './dto/create-financing-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class FinancingApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  list() {
    return this.prisma.financingApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    });
  }

  async create(dto: CreateFinancingApplicationDto, userId?: string) {
    const app = await this.prisma.financingApplication.create({
      data: {
        applicationNo: dto.applicationNo,
        customerId: dto.customerId,
        financingType: dto.financingType,
        financingAmount: dto.financingAmount,
        createdById: userId
      }
    });
    await this.auditLogService.write({
      userId,
      action: 'FINANCING_APPLICATION_CREATED',
      entityType: 'financing_application',
      entityId: app.id,
      newValues: app
    });
    return app;
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto, userId?: string) {
    const existing = await this.prisma.financingApplication.findUniqueOrThrow({
      where: { id }
    });
    const updated = await this.prisma.financingApplication.update({
      where: { id },
      data: { status: dto.toStatus as never }
    });

    await this.auditLogService.write({
      userId,
      action: 'FINANCING_APPLICATION_STATUS_UPDATED',
      entityType: 'financing_application',
      entityId: id,
      oldValues: { status: existing.status },
      newValues: { status: dto.toStatus, remarks: dto.remarks }
    });

    return updated;
  }
}
