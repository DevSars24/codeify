import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // This allows Prisma 7 CLI and migrations to find the URL in Vercel
    url: env("DATABASE_URL"),
  },
});