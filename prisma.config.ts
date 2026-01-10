import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // CHANGE THIS to process.env.DIRECT_URL
    url: process.env.DIRECT_URL, 
  },
});