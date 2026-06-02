'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getApiConfigHint } from '@/lib/api-config';
import { createClient } from '@/lib/supabase/client';

const APP_URL = 'https://lms-for-welfare.vercel.app';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@lms.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiHint = useMemo(() => getApiConfigHint(), []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!data.session) {
        throw new Error('No session returned. Create the user in Supabase Auth first.');
      }

      localStorage.setItem('lms_access_token', data.session.access_token);
      localStorage.setItem('lms_refresh_token', data.session.refresh_token);
      localStorage.setItem('lms_user_roles', JSON.stringify(['super_admin']));
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Islamic LMS Login</h1>
        <p className="mt-1 text-sm text-slate-600">App: {APP_URL}</p>
        <p className="mb-2 break-all text-xs text-slate-500">{apiHint}</p>
        <p className="mb-4 text-xs text-amber-800">
          Supabase only — create user in Supabase → Authentication → Users (email + password below).
        </p>

        <label className="mb-2 block text-sm text-slate-700">Email</label>
        <input
          className="mb-4 w-full rounded border p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <label className="mb-2 block text-sm text-slate-700">Password</label>
        <input
          className="mb-4 w-full rounded border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
