/** Browser calls /api/* — proxied to Django via next.config.ts rewrites */
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
    throw new Error('Unable to connect to server. Check that the API is deployed and NEXT_PUBLIC_API_URL is set on Vercel.');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { detail?: string };
      if (data.detail) message = data.detail;
    } catch {
      const text = await res.text();
      if (text) message = text;
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
