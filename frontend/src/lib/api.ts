import { getApiBase } from './api-config';

function parseErrorMessage(status: number, body: string): string {
  if (!body) return `Request failed (${status})`;
  try {
    const data = JSON.parse(body) as Record<string, unknown>;
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data.error === 'string') return data.error;
  } catch {
    // not JSON
  }
  return body.length > 240 ? `${body.slice(0, 240)}...` : body;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('lms_access_token') : null;

  const res = await fetch(`${getApiBase()}${normalizedPath}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    }
  });

  const body = await res.text();

  if (!res.ok) {
    throw new Error(parseErrorMessage(res.status, body));
  }

  if (!body) return {} as T;
  return JSON.parse(body) as T;
}

export { getApiBase, getApiConfigHint } from './api-config';
