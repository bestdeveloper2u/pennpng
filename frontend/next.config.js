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
    '*.replit.dev',
    '*.riker.replit.dev',
    '*.sisko.replit.dev',
    '*.kirk.replit.dev',
    '*.janeway.replit.dev',
    '*.picard.replit.dev',
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
