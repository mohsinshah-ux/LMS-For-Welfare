import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  kpisByRole(role: string) {
    return {
      role,
      totalFinancingPortfolio: 125000000,
      activeFinancing: 540,
      closedFinancing: 180,
      overdueInstallments: 37,
      totalCashInflow: 7200000,
      totalCashOutflow: 4900000,
      profitGenerated: 2300000,
      recoveryPerformance: 86.4
    };
  }
}
