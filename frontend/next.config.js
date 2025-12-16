/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:3001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://0.0.0.0:3001/uploads/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    '43ce7abe-879f-4b15-9ac2-cd655fcf04a3-00-19c7zf71h2x1y.riker.replit.dev',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
