import "dotenv/config";

import { defineConfig, env } from "prisma/config";

const isDevelopment = env("NODE_ENV") === "development";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: isDevelopment ? env("URL_DB_DEVELOPER") : env("URL_DB"),
  },
});