-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "carrera" TEXT NOT NULL DEFAULT 'Ing. en Software',
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_usuarios" ("carrera", "correo", "created_at", "id", "nombre", "password", "telefono") SELECT "carrera", "correo", "created_at", "id", "nombre", "password", "telefono" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_usuarios_2" ON "usuarios"("correo");
Pragma writable_schema=0;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

