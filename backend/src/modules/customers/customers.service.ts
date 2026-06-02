import { Injectable } from '@nestjs/common';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService
  ) {}

  list() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200
    });
  }

  async create(dto: CreateCustomerDto, userId?: string) {
    const row = await this.prisma.customer.create({
      data: {
        customerId: dto.customerId,
        fullName: dto.fullName,
        cnic: dto.cnic,
        mobileNumber: dto.mobileNumber,
        email: dto.email,
        createdById: userId
      }
    });

    await this.auditLogService.write({
      userId,
      action: 'CUSTOMER_CREATED',
      entityType: 'customer',
      entityId: row.id,
      newValues: row
    });

    return row;
  }
}
