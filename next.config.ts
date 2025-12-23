/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Ensure Prisma is not bundled into the client-side
  serverExternalPackages: ['@prisma/client'],

  // 2. Explicitly include Prisma binaries in the deployment trace
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },

  // 3. Recommended for Next.js 16 with Turbopack
  experimental: {
    turbo: {
      resolveAlias: {
        // Helps resolve Prisma types if they fail in the build worker
        '@prisma/client': ['./node_modules/@prisma/client/index.js'],
      },
    },
  },
};

export default nextConfig;