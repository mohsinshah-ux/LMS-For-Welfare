import { Injectable } from '@nestjs/common';
import { InstallmentStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditLogService
  ) {}

  list() {
    return this.prisma.payment.findMany({
      include: { installment: true },
      orderBy: { paymentDate: 'desc' }
    });
  }

  async create(dto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const installment = await tx.installment.findUniqueOrThrow({
        where: { id: dto.installmentId }
      });

      const amount = Number(dto.amountPaid);
      const outstanding = Number(installment.outstandingAmount);
      const nextOutstanding = Math.max(0, outstanding - amount);
      const nextPaid = Number(installment.paidAmount) + amount;

      const payment = await tx.payment.create({
        data: {
          installmentId: dto.installmentId,
          paymentDate: new Date(),
          paymentMethod: dto.paymentMethod,
          transactionId: dto.transactionId,
          amountPaid: amount,
          principalPortion: amount,
          remainingBalance: nextOutstanding
        }
      });

      let status: InstallmentStatus = 'partial';
      if (nextOutstanding === 0) status = 'paid';
      if (nextPaid === 0) status = 'pending';

      const updatedInstallment = await tx.installment.update({
        where: { id: dto.installmentId },
        data: {
          paidAmount: nextPaid,
          outstandingAmount: nextOutstanding,
          status
        }
      });

      await this.audit.write({
        action: 'PAYMENT_RECORDED',
        entityType: 'installment',
        entityId: dto.installmentId,
        newValues: {
          paymentId: payment.id,
          amount,
          outstanding: nextOutstanding
        }
      });

      return { payment, installment: updatedInstallment };
    });
  }
}
