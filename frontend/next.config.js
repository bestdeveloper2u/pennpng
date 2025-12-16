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
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3001/uploads/:path*',
      },
    ];
  },
  allowedDevOrigins: [
    '65c9e05e-95bf-4dd9-a311-e97be186ffe0-00-3vwhvfxuut9ek.sisko.replit.dev',
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
  ],
};

module.exports = nextConfig;
