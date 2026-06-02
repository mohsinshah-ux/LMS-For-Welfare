const LOCAL_API = 'http://127.0.0.1:8000';

function isPrivateHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
  if (host.endsWith('.local')) return true;
  if (host.startsWith('10.')) return true;
  if (host.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true;
  return false;
}

export function getApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '');

  if (configured) {
    try {
      const parsed = new URL(configured);
      if (isPrivateHost(parsed.hostname) && process.env.NODE_ENV === 'production') {
        throw new Error(
          'NEXT_PUBLIC_API_URL cannot be localhost or a private IP on Vercel. Use your public Render backend URL (https://...).'
        );
      }
      if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
        throw new Error('NEXT_PUBLIC_API_URL must use https in production.');
      }
      return configured;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('NEXT_PUBLIC')) throw error;
      throw new Error('NEXT_PUBLIC_API_URL is not a valid URL.');
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return LOCAL_API;
  }

  throw new Error(
    'NEXT_PUBLIC_API_URL is missing on Vercel. Set it to your public Django API URL (e.g. https://your-app.onrender.com).'
  );
}

export function getApiConfigHint(): string {
  try {
    return getApiBase();
  } catch (error) {
    return error instanceof Error ? error.message : 'API not configured';
  }
}
