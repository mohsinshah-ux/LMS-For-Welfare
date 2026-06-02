/**
 * Same-origin /api/* is proxied to the Django backend via next.config.ts rewrites.
 * Set NEXT_PUBLIC_API_URL on Vercel to your Render/Railway backend URL (https).
 */
export function getApiBase(): string {
  return '/api';
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;

  let res: Response;
  try {
    res = await fetch(`${getApiBase()}${normalizedPath}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {})
      }
    });
  } catch {
    const backend = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    throw new Error(
      `Cannot reach API. Deploy the Django backend and set NEXT_PUBLIC_API_URL on Vercel to your backend URL (currently configured as ${backend}).`
    );
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
