import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? '';

if (process.env.VERCEL === '1' && apiUrl) {
  if (/localhost|127\.0\.0\.1|192\.168\.|10\.\d+\./i.test(apiUrl)) {
    console.warn(
      '[LMS] NEXT_PUBLIC_API_URL must be a public HTTPS URL on Vercel, not localhost. Login will fail until fixed.'
    );
  } else if (!apiUrl.startsWith('https://')) {
    console.warn('[LMS] NEXT_PUBLIC_API_URL should use https:// in production.');
  }
} else if (process.env.VERCEL === '1' && !apiUrl) {
  console.warn(
    '[LMS] NEXT_PUBLIC_API_URL is not set on Vercel. Build will succeed but login needs: https://islamic-lms-api.onrender.com'
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_VERCEL_APP_URL: 'https://lms-for-welfare.vercel.app'
  },
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
