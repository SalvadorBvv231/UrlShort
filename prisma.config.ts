import "dotenv/config";
import { defineConfig } from "prisma/config";

// El CLI de Prisma (migrate, db pull...) usa la conexión DIRECTA (sin pooler).
// La app en ejecución usa DATABASE_URL (con pooler) mediante el adapter, ver src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});
