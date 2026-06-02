/** Browser calls /api/* — proxied to Django via next.config.ts rewrites */
export function getApiBase(): string {
  return '/api';
}

function parseErrorMessage(status: number, body: string): string {
  if (!body) return `Request failed (${status})`;
  try {
    const data = JSON.parse(body) as Record<string, unknown>;
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) {
      return String(data.non_field_errors[0]);
    }
  } catch {
    // not JSON
  }
  return body.length > 240 ? `${body.slice(0, 240)}...` : body;
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
    throw new Error(
      'Unable to connect to server. Check that the API is deployed and NEXT_PUBLIC_API_URL is set on Vercel.'
    );
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
