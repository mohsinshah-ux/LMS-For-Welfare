'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getApiConfigHint } from '@/lib/api';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: { username: string; roles?: string[] };
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiHint = useMemo(() => getApiConfigHint(), []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      localStorage.setItem('lms_access_token', res.accessToken);
      localStorage.setItem('lms_refresh_token', res.refreshToken);
      localStorage.setItem('lms_user_roles', JSON.stringify(res.user?.roles ?? []));
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
        <p className="mb-2 mt-1 text-sm text-slate-600">Default: superadmin / Admin@123</p>
        <p className="mb-4 break-all text-xs text-slate-500">API: {apiHint}</p>

        <label className="mb-2 block text-sm text-slate-700">Username or Email</label>
        <input
          className="mb-4 w-full rounded border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
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
