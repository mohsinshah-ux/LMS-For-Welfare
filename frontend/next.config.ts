import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? '';

if (process.env.VERCEL === '1') {
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is required on Vercel. Set it to your public Render API URL (https://islamic-lms-api.onrender.com or your service URL).'
    );
  }
  if (/localhost|127\.0\.0\.1|192\.168\.|10\.\d+\./i.test(apiUrl)) {
    throw new Error(
      `NEXT_PUBLIC_API_URL must be a public HTTPS URL on Vercel. Current value: ${apiUrl}`
    );
  }
  if (!apiUrl.startsWith('https://')) {
    throw new Error('NEXT_PUBLIC_API_URL must start with https:// on Vercel.');
  }
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
