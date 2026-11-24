import { defineConfig } from 'prisma/config';

// Configuración de la CLI de Prisma (generate, db pull, migrate diff, db execute).
// La CLI trabaja contra el archivo local fif_store.db; la app en producción NO usa
// esta URL: se conecta a Turso desde app/lib/db.ts con el adaptador de libSQL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? 'file:./fif_store.db' },
});
