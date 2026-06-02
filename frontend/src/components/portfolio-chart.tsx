'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'Jan', value: 1.2 },
  { month: 'Feb', value: 1.35 },
  { month: 'Mar', value: 1.48 },
  { month: 'Apr', value: 1.62 },
  { month: 'May', value: 1.8 },
  { month: 'Jun', value: 1.92 }
];

export function PortfolioChart() {
  return (
    <div className="h-72 rounded-lg border bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-slate-700">Portfolio Trend (M)</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#bae6fd" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
