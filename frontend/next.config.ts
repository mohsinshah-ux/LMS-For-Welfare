import type { NextConfig } from 'next';

/**
 * Do NOT proxy /api to localhost here — Vercel server-side rewrites cannot reach
 * private hosts (DNS_HOSTNAME_RESOLVED_PRIVATE). The browser calls NEXT_PUBLIC_API_URL directly.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;
