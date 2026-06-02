import { getApiBase } from './api-config';

function parseErrorMessage(status: number, body: string): string {
  if (!body) return `Request failed (${status})`;
  try {
    const data = JSON.parse(body) as Record<string, unknown>;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
      return String(data.non_field_errors[0]);
    }
    if (typeof data === 'object' && data !== null) {
      const firstKey = Object.keys(data)[0];
      const val = data[firstKey];
      if (Array.isArray(val) && val[0]) return String(val[0]);
    }
  } catch {
    // not JSON
  }
  if (body.includes('DNS_HOSTNAME_RESOLVED_PRIVATE') || body.includes('bom1::')) {
    return 'API URL points to a private host. On Vercel set NEXT_PUBLIC_API_URL to your public Render backend (https://...).';
  }
  return body.length > 240 ? `${body.slice(0, 240)}...` : body;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiBase = getApiBase();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;

  let res: Response;
  try {
    res = await fetch(`${apiBase}${normalizedPath}`, {
      ...init,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {})
      }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Network error';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new Error(
        `Cannot reach API at ${apiBase}. Deploy Django on Render, set NEXT_PUBLIC_API_URL on Vercel, and allow CORS for your Vercel domain.`
      );
    }
    throw error;
  }

  const body = await res.text();

  if (!res.ok) {
    throw new Error(parseErrorMessage(res.status, body));
  }

  if (!body) {
    return {} as T;
  }

  return JSON.parse(body) as T;
}

export { getApiBase, getApiConfigHint } from './api-config';
