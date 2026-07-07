/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Prisma must be marked as an external package to prevent bundling errors
  serverExternalPackages: ['@prisma/client'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 2. Optimized for Next.js 16 Performance
  experimental: {},

  // 3. Ensuring Prisma binaries are available in the Vercel Runtime
  outputFileTracingIncludes: {
    '/**': ['./node_modules/.prisma/client/*.node'],
  },
};

export default nextConfig;
