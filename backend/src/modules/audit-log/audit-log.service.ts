import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async write(input: {
    userId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    oldValues?: unknown;
    newValues?: unknown;
    ipAddress?: string;
    deviceInfo?: string;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValues: input.oldValues as object | undefined,
        newValues: input.newValues as object | undefined,
        ipAddress: input.ipAddress,
        deviceInfo: input.deviceInfo
      }
    });
  }
}
