/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Prisma must be marked as an external package to prevent bundling errors
  serverExternalPackages: ['@prisma/client'],

  // 2. Optimized for Next.js 16 Performance
  experimental: {
    // Note: 'turbo' has been moved to a top-level config or is enabled by default in v16.
    // We remove it from 'experimental' to stop the "Unrecognized key" error.
  },

  // 3. Ensuring Prisma binaries are available in the Vercel Runtime
  outputFileTracingIncludes: {
    '/**': ['./node_modules/.prisma/client/*.node'],
  },
};

export default nextConfig;