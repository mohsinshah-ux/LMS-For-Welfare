import { NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { count: activeFinancing } = await supabase
      .from('financing_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { data: amounts } = await supabase.from('financing_applications').select('financing_amount');

    const totalFinancingPortfolio =
      amounts?.reduce((sum, row) => sum + Number(row.financing_amount || 0), 0) ?? 0;

    return NextResponse.json({
      totalFinancingPortfolio,
      activeFinancing: activeFinancing ?? 0,
      overdueInstallments: 0,
      profitGenerated: 0
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Dashboard error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
