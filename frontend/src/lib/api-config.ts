/** All API routes run on Vercel (same origin). No Render / external backend. */
export function getApiBase(): string {
  return '/api';
}

export function getApiConfigHint(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    return 'Supabase not configured — add Vercel ↔ Supabase integration env vars';
  }
  return `Supabase: ${url} · API: /api (Vercel)`;
}
