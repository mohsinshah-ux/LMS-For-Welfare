import { AuthGuard } from '@/components/auth-guard';
import { KpiCard } from '@/components/kpi-card';
import { PortfolioChart } from '@/components/portfolio-chart';

export default function HomePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Islamic LMS Executive Dashboard</h1>
          <p className="text-sm text-slate-600">Role-aware KPIs, financing, recovery and financial health.</p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Total Financing Portfolio" value="PKR 125.0M" trend="+8.3% vs last month" />
          <KpiCard title="Active Financing" value={540} trend="+23 new this month" />
          <KpiCard title="Overdue Installments" value={37} trend="-6% from last week" />
          <KpiCard title="Profit Generated" value="PKR 2.3M" trend="+12.1% MoM" />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioChart />
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-slate-700">Recent Activities</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Manager approved application APP-2026-00124</li>
              <li>Recovery reminder sent for customer CUST-00219</li>
              <li>Payment receipt generated for installment #8</li>
              <li>New Murabaha product updated by Super Admin</li>
            </ul>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
