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
    '29fe3c0c-a17a-482e-96dc-d2c2ca3d96f5-00-pvxhr9n0dga8.riker.replit.dev',
    '*.riker.replit.dev',
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
