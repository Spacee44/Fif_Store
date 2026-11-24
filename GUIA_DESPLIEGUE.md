# Guía de despliegue: Vercel + Turso + Prisma ORM

Esta guía explica cómo publicar **FIF Store** en internet usando:

- **[Vercel](https://vercel.com)** como hosting de la aplicación Next.js (páginas y API).
- **[Turso](https://turso.tech)** como base de datos en la nube (libSQL, compatible con SQLite).
- **[Prisma ORM 7](https://www.prisma.io)** para hacer las consultas a la base de datos.

> **Estado de la verificación (23 de noviembre de 2026).** Todo el código de esta guía se aplicó y probó en una copia del proyecto con Next.js 16.4.6, Prisma 7.10.1 y `@prisma/adapter-libsql` 7.10.1: compila con `npm run build` y pasó 25 pruebas de la API (productos, búsqueda, login, registro, favoritos y publicaciones con varias fotos) contra una base libSQL. Los pasos de las cuentas de Turso y Vercel siguen su documentación oficial, pero no se pudieron ejecutar sin esas cuentas.

## Contenido

1. [¿Qué cambia y por qué?](#qué-cambia-y-por-qué)
2. [Requisitos](#0-requisitos)
3. [Paso 1. Actualizar dependencias](#paso-1-actualizar-dependencias)
4. [Paso 2. Configurar Prisma](#paso-2-configurar-prisma)
5. [Paso 3. Migrar las consultas a Prisma](#paso-3-migrar-las-consultas-a-prisma)
6. [Paso 4. Crear la base de datos en Turso](#paso-4-crear-la-base-de-datos-en-turso)
7. [Paso 5. Desplegar en Vercel](#paso-5-desplegar-en-vercel)
8. [Paso 6. Verificar en producción](#paso-6-verificar-en-producción)
9. [Cambios futuros al esquema](#cambios-futuros-al-esquema)
10. [Límites y recomendaciones antes de publicar](#límites-y-recomendaciones-antes-de-publicar)
11. [Solución de problemas](#solución-de-problemas)

---

## ¿Qué cambia y por qué?

Hoy la API guarda los datos en el archivo `fif_store.db` usando `better-sqlite3`. Eso funciona en tu computadora, pero **no en Vercel**: la API corre en funciones *serverless* que no tienen un disco permanente, así que cualquier cambio en un archivo local se perdería.

La solución es mover la base de datos a Turso y acceder a ella con Prisma:

```
Navegador ──► Vercel (Next.js)
                ├─ páginas y fotos del catálogo (public/) ── servidas por la CDN de Vercel
                └─ API /api/*  ──► Prisma Client + adaptador libSQL ──► Turso (SQLite en la nube)
```

Lo que **no** cambia: las pantallas, los componentes, las imágenes de `public/` y las respuestas JSON de la API (el frontend no se toca). En desarrollo puedes seguir usando `fif_store.db` sin cuenta de Turso.

---

## 0. Requisitos

- Cuentas en **GitHub** (el repositorio `Spacee44/Fif_Store`), **Vercel** y **Turso** (las tres tienen plan gratuito).
- **Node.js 22 o 24.** Prisma 7.10.1 exige Node `^20.19`, `^22.12` o `>=24`.
- **CLI de Turso** (se instala en el paso 4) y `sqlite3` (ya viene en macOS).
- Haz los cambios en una rama:

```bash
git checkout main && git pull
git checkout -b despliegue-vercel
```

---

## Paso 1. Actualizar dependencias

Ejecuta los dos comandos **en este orden** (primero la CLI de Prisma):

```bash
npm install -D -E prisma@7.10.1 eslint-config-next@16.4.6
npm install -E next@16.4.6 @prisma/client@7.10.1 @prisma/adapter-libsql@7.10.1
```

Antes de seguir, comprueba que quedó instalada la CLI correcta:

```bash
npx prisma --version     # la línea "prisma" debe decir 7.10.1
```

> ⚠️ Si dice `8.0.0-rc…`, o si algún comando de Prisma menciona `prisma7.config.ts` o "Prisma 8", **el paso 1 no se aplicó**: repite los dos `npm install` y revisa que terminen sin errores. La CLI 8 no lee `prisma.config.ts`, así que tampoco encuentra el esquema.

Por qué estas versiones exactas:

- **`prisma` y `@prisma/client` deben ser la misma versión.** Hoy el proyecto tiene `prisma` 8.0.0-rc.35 (una versión de prueba que npm instala por defecto porque su etiqueta `latest` apunta a ella) y `@prisma/client` 7.10.1. Fija ambas en **7.10.1**.
- **`@prisma/adapter-libsql`** conecta Prisma con Turso; ya incluye `@libsql/client`, no hace falta instalarlo aparte.
- **Next.js 16.4.6** corrige dos avisos de seguridad que `npm audit` reporta para 16.4.3 ([GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) y [GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8)). Es una actualización de parche, sin cambios incompatibles.

> ⚠️ **No ejecutes `npm audit fix --force`.** `npm audit` marca una alerta alta en `effect`, una dependencia de la CLI de Prisma que solo se usa al compilar; la "solución" que propone es bajar a Prisma 6, lo que rompería todo.

Por último, unos ajustes pequeños (el script `postinstall` se agrega más adelante, en el paso 2.3):

1. **`.gitignore`**: el cliente de Prisma se genera solo, no se sube al repositorio. Agrega al final:

   ```gitignore
   # cliente generado por Prisma (se crea con `prisma generate`)
   /app/generated/
   ```

2. **`eslint.config.mjs`** (opcional): para que ESLint no revise el código generado, agrega `"app/generated/**",` dentro de `globalIgnores([...])`. Hoy no marca errores ahí; solo hace el lint más rápido.

3. **`next.config.ts`** (opcional, limpieza): borra la línea `serverExternalPackages: ['better-sqlite3'],`. Next.js ya trata automáticamente como externos `@libsql/client`, `libsql`, `@prisma/client` y `prisma`.

`better-sqlite3` puede quedarse instalado: lo sigue usando `scripts/seed.js` para generar la base en tu computadora, pero la app ya no lo usa.

---

## Paso 2. Configurar Prisma

Los dos archivos de este paso **los creas tú**: ningún comando los genera. Créalos con un editor de código (por ejemplo, VS Code), como texto plano, y copia el contenido de abajo. TextEdit en modo de texto enriquecido los guardaría en otro formato. Deben quedar así, en la raíz del proyecto (junto a `package.json`):

```
Fif_Store/
├── package.json
├── prisma.config.ts        ← paso 2.1
└── prisma/
    └── schema.prisma       ← paso 2.2
```

Puedes comprobarlo con `ls prisma.config.ts prisma/schema.prisma` (no debe decir *No such file*).

### 2.1 `prisma.config.ts` (archivo nuevo, en la raíz)

Prisma 7 lee su configuración de este archivo. La CLI trabaja contra tu archivo local; la app en producción se conecta a Turso por otro camino (paso 3).

```ts
import { defineConfig } from 'prisma/config';

// Configuración de la CLI de Prisma (generate, db pull, migrate diff, db execute).
// La CLI trabaja contra el archivo local fif_store.db; la app en producción NO usa
// esta URL: se conecta a Turso desde app/lib/db.ts con el adaptador de libSQL.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? 'file:./fif_store.db' },
});
```

### 2.2 `prisma/schema.prisma` (archivo nuevo)

El esquema describe **exactamente las tablas que ya existen** en `fif_store.db`. Los modelos usan nombres en singular y *camelCase* (`Producto`, `vendedorId`) y se conectan con las tablas y columnas reales (`productos`, `vendedor_id`) mediante `@@map` y `@map`. Así no hay que renombrar nada en la base.

```prisma
// Esquema de FIF Store para Prisma ORM 7.
// Refleja exactamente las tablas que ya existen en fif_store.db (y en Turso),
// por eso cada modelo usa @@map / @map hacia los nombres reales en español.

generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model Usuario {
  id        String     @id
  nombre    String
  carrera   String     @default("Ing. en Software")
  telefono  String
  correo    String     @unique(map: "usuarios_correo_key")
  password  String
  createdAt DateTime?  @default(now()) @map("created_at")
  productos Producto[]
  favoritos Favorito[]

  @@map("usuarios")
}

model Producto {
  id          Int        @id @default(autoincrement())
  nombre      String
  precio      Float
  categoria   String
  descripcion String
  vendedorId  String     @map("vendedor_id")
  vendido     Int        @default(0) // 0 = disponible, 1 = vendido
  imagenes    String     @default("[]") // arreglo JSON de rutas o fotos en Base64
  createdAt   DateTime?  @default(now()) @map("created_at")
  vendedor    Usuario    @relation(fields: [vendedorId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  favoritos   Favorito[]

  @@index([vendedorId], map: "idx_productos_vendedor")
  @@index([categoria], map: "idx_productos_categoria")
  @@map("productos")
}

model Favorito {
  id         Int       @id @default(autoincrement())
  usuarioId  String    @map("usuario_id")
  productoId Int       @map("producto_id")
  createdAt  DateTime? @default(now()) @map("created_at")
  usuario    Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade, onUpdate: NoAction)
  producto   Producto  @relation(fields: [productoId], references: [id], onDelete: Cascade, onUpdate: NoAction)

  @@unique([usuarioId, productoId], map: "sqlite_autoindex_favoritos_1")
  @@index([usuarioId], map: "idx_favoritos_usuario")
  @@map("favoritos")
}
```

> `sqlite_autoindex_favoritos_1` es el índice que SQLite creó automáticamente para la restricción `UNIQUE` de `favoritos`: no lo cambies, o Prisma intentará reconstruir la tabla. El índice único del correo se llama `usuarios_correo_key` y lo crea la normalización del paso 2.4.

### 2.3 Generar el cliente y agregar `postinstall`

```bash
npx prisma generate
```

Debe responder:

```
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma.
✔ Generated Prisma Client (7.10.1) to ./app/generated/prisma
```

Esto crea el cliente tipado en `app/generated/prisma/`. Si la CLI muestra *"This is a major update… npm i prisma@latest"*, ignóralo: esa "actualización" es la versión 8 de prueba.

**Ahora sí**, agrega en `package.json` el script **`postinstall`**. Así Vercel genera el cliente de Prisma en cada instalación; Vercel guarda en caché `node_modules` y, sin esto, el cliente podría quedar desactualizado.

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "postinstall": "prisma generate"
}
```

> Agrégalo solo cuando `npx prisma generate` ya funcione. Si lo pones antes de que exista `prisma/schema.prisma` (o con la CLI 8 instalada), `npm install` sin argumentos y `npm ci` (lo que ejecuta Vercel) terminarán con error en `command sh -c prisma generate`.

### 2.4 Normalizar la base local (una sola vez)

En la tabla `usuarios`, la llave primaria se creó sin `NOT NULL` (una particularidad de SQLite que Prisma 7 no acepta en el esquema). Con estos comandos Prisma genera y aplica la corrección **conservando todos los datos**, y de paso crea el índice único del correo como `usuarios_correo_key`. Detén antes `npm run dev`, porque usa el mismo archivo.

```bash
# 1) Ver la diferencia entre el esquema y la base (la primera vez aparece la tabla usuarios)
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > prisma/normalizar.sql

# 2) Aplicarla al archivo local fif_store.db
npx prisma db execute --file prisma/normalizar.sql

# 3) Comprobar: ahora debe responder "-- This is an empty migration."
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
```

Si en el paso 3 ves `-- This is an empty migration.`, el esquema y la base coinciden al 100%.

---

## Paso 3. Migrar las consultas a Prisma

Hay que cambiar el acceso a datos en `app/lib/db.ts`, `app/lib/auth.ts` y seis rutas de la API. Las respuestas JSON quedan iguales, así que el frontend no cambia. Equivalencias principales:

| Antes (`better-sqlite3`, síncrono) | Ahora (Prisma, con `await`) |
|---|---|
| `db.prepare('SELECT * FROM productos ORDER BY id').all()` | `await prisma.producto.findMany({ orderBy: { id: 'asc' } })` |
| `db.prepare('SELECT * FROM productos WHERE id = ?').get(id)` | `await prisma.producto.findUnique({ where: { id } })` |
| `INSERT INTO productos (...) VALUES (...)` | `await prisma.producto.create({ data: { ... } })` |
| `UPDATE productos SET vendido = ? WHERE id = ?` | `await prisma.producto.update({ where: { id }, data: { vendido } })` |
| `DELETE FROM productos WHERE id = ?` | `await prisma.producto.deleteMany({ where: { id } })` |
| `SELECT ... FROM usuarios WHERE LOWER(correo) = ?` | `await prisma.usuario.findUnique({ where: { correo } })` |
| columnas `vendedor_id`, `producto_id`, `usuario_id` | campos `vendedorId`, `productoId`, `usuarioId` |

### 3.1 `app/lib/db.ts` (reemplaza todo el archivo)

`getPrisma()` crea un único cliente al primer uso:

- **Sin variables de entorno** (desarrollo) usa el archivo local `fif_store.db`.
- **Con `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`** se conecta a Turso.
- **En producción sin esas variables** lanza un error claro en lugar de fallar en silencio.

Ojo: la clase del adaptador se llama **`PrismaLibSql`** (así la exporta la versión 7.10.1; algunos ejemplos de la documentación la escriben `PrismaLibSQL`, que no existe).

```ts
import { PrismaLibSql } from '@prisma/adapter-libsql';
import {
  PrismaClient,
  type Producto as ProductoDb,
  type Usuario as UsuarioDb,
} from '@/app/generated/prisma/client';
import { type Categoria, type Producto, type Usuario } from './data';

// Un solo PrismaClient por proceso. En desarrollo Next.js recarga los módulos,
// así que se guarda en globalThis para no abrir una conexión nueva en cada cambio.
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Devuelve el cliente de Prisma conectado a Turso (producción) o al archivo
 * local fif_store.db (desarrollo). Se crea al primer uso, no al importar el
 * módulo, para que `next build` no necesite conectarse a la base de datos.
 */
export function getPrisma(): PrismaClient {
  if (globalParaPrisma.prisma) return globalParaPrisma.prisma;

  const url =
    process.env.TURSO_DATABASE_URL ??
    (process.env.NODE_ENV === 'production' ? undefined : 'file:./fif_store.db');
  if (!url) {
    throw new Error('Falta la variable de entorno TURSO_DATABASE_URL');
  }

  const adapter = new PrismaLibSql({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  const prisma = new PrismaClient({ adapter });
  globalParaPrisma.prisma = prisma;
  return prisma;
}

// ----- Conversión de los registros de la BD a los tipos que usa la app -----

export function aProducto(p: ProductoDb): Producto {
  let imagenes: string[] = [];
  try {
    const valor = JSON.parse(p.imagenes);
    if (Array.isArray(valor)) imagenes = valor;
  } catch {
    imagenes = [];
  }

  return {
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    categoria: p.categoria as Categoria,
    descripcion: p.descripcion,
    vendedorId: p.vendedorId,
    vendido: p.vendido === 1,
    imagenes,
  };
}

/** Nunca incluye la contraseña. */
export function aUsuario(u: Pick<UsuarioDb, 'id' | 'nombre' | 'carrera' | 'telefono' | 'correo'>): Usuario {
  return {
    id: u.id,
    nombre: u.nombre,
    carrera: u.carrera,
    telefono: u.telefono,
    correo: u.correo,
  };
}
```

### 3.2 `app/lib/auth.ts`

Solo cambian la importación y la función `getCurrentUser`. Archivo completo:

```ts
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { aUsuario, getPrisma } from './db';
import { type Usuario } from './data';

const SESSION_COOKIE_NAME = 'fif_session';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value ?? null;
}

export async function getCurrentUser(): Promise<Usuario | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const row = await getPrisma().usuario.findUnique({
    where: { id: userId },
    select: { id: true, nombre: true, carrera: true, telefono: true, correo: true },
  });
  return row ? aUsuario(row) : null;
}

export async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
```

### 3.3 Rutas de la API

Reemplaza cada archivo completo. `app/api/auth/logout/route.ts` no cambia.

Detalles que vale la pena notar:

- En los `GET` que leen cookies (`/api/auth/me` y `/api/favoritos`), el `catch` llama primero a **`unstable_rethrow(error)`**. Durante el `build`, Next.js intenta prerenderizar esas rutas y usa un error interno para detectar que leen cookies; sin esa línea, el `try/catch` lo atrapa y aparece un error falso en el log del build.
- Al borrar una publicación se borran primero sus favoritos dentro de una transacción. Así no se depende de que la base aplique `ON DELETE CASCADE`.

<details>
<summary><code>app/api/productos/route.ts</code></summary>

```ts
import { NextResponse } from 'next/server';
import { aProducto, getPrisma } from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const busqueda = searchParams.get('q')?.trim();

    const filas = await getPrisma().producto.findMany({
      where: {
        ...(categoria && categoria !== 'Todo' ? { categoria } : {}),
        ...(busqueda ? { nombre: { contains: busqueda } } : {}),
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ productos: filas.map(aProducto) });
  } catch (error) {
    console.error('Error en GET /api/productos:', error);
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUserId = (await getCurrentUserId()) || 'u1';
    const { nombre, precio, categoria, descripcion, imagenes } = await request.json();

    if (!nombre || !precio || !categoria) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const creado = await getPrisma().producto.create({
      data: {
        nombre: String(nombre).trim(),
        precio: Number(precio),
        categoria,
        descripcion: String(descripcion || '').trim(),
        vendedorId: currentUserId,
        imagenes: JSON.stringify(Array.isArray(imagenes) ? imagenes : []),
      },
    });

    return NextResponse.json({ ok: true, producto: aProducto(creado) });
  } catch (error) {
    console.error('Error en POST /api/productos:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
```

</details>

<details>
<summary><code>app/api/productos/[id]/route.ts</code></summary>

```ts
import { NextResponse } from 'next/server';
import { aProducto, getPrisma } from '@/app/lib/db';

type Contexto = { params: Promise<{ id: string }> };

/** Convierte el parámetro de la URL en un id numérico (o null si no es válido). */
async function leerId({ params }: Contexto): Promise<number | null> {
  const { id } = await params;
  const numero = Number(id);
  return Number.isInteger(numero) ? numero : null;
}

const noEncontrado = () => NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

export async function GET(_request: Request, contexto: Contexto) {
  try {
    const id = await leerId(contexto);
    const producto = id === null ? null : await getPrisma().producto.findUnique({ where: { id } });
    if (!producto) return noEncontrado();

    return NextResponse.json({ producto: aProducto(producto) });
  } catch (error) {
    console.error('Error en GET /api/productos/[id]:', error);
    return NextResponse.json({ error: 'Error al consultar producto' }, { status: 500 });
  }
}

export async function PUT(request: Request, contexto: Contexto) {
  try {
    const id = await leerId(contexto);
    if (id === null) return noEncontrado();

    const body = await request.json();
    const prisma = getPrisma();
    const existe = await prisma.producto.findUnique({ where: { id }, select: { id: true } });
    if (!existe) return noEncontrado();

    // Puede marcar como vendido o actualizar los datos generales
    const data =
      body.vendido !== undefined
        ? { vendido: body.vendido ? 1 : 0 }
        : {
            nombre: body.nombre ?? undefined,
            precio: body.precio ? Number(body.precio) : undefined,
            categoria: body.categoria ?? undefined,
            descripcion: body.descripcion ?? undefined,
            imagenes: Array.isArray(body.imagenes) ? JSON.stringify(body.imagenes) : undefined,
          };

    const actualizado = await prisma.producto.update({ where: { id }, data });
    return NextResponse.json({ ok: true, producto: aProducto(actualizado) });
  } catch (error) {
    console.error('Error en PUT /api/productos/[id]:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, contexto: Contexto) {
  try {
    const id = await leerId(contexto);
    if (id !== null) {
      const prisma = getPrisma();
      // Primero sus favoritos, para no depender de que la BD aplique ON DELETE CASCADE
      await prisma.$transaction([
        prisma.favorito.deleteMany({ where: { productoId: id } }),
        prisma.producto.deleteMany({ where: { id } }),
      ]);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error en DELETE /api/productos/[id]:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
```

</details>

<details>
<summary><code>app/api/favoritos/route.ts</code></summary>

```ts
import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getPrisma } from '@/app/lib/db';
import { getCurrentUserId } from '@/app/lib/auth';

async function listar(usuarioId: string) {
  const filas = await getPrisma().favorito.findMany({
    where: { usuarioId },
    select: { productoId: true },
  });
  return filas.map((f) => f.productoId);
}

export async function GET() {
  try {
    const userId = (await getCurrentUserId()) || 'u1';
    return NextResponse.json({ favoritos: await listar(userId) });
  } catch (error) {
    unstable_rethrow(error); // deja pasar las señales internas de Next (p. ej. cookies() al prerenderizar)
    console.error('Error en GET /api/favoritos:', error);
    return NextResponse.json({ error: 'Error al consultar favoritos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = (await getCurrentUserId()) || 'u1';
    const { productoId } = await request.json();
    const id = Number(productoId);

    if (!productoId || !Number.isInteger(id)) {
      return NextResponse.json({ error: 'productoId es requerido' }, { status: 400 });
    }

    const prisma = getPrisma();
    const clave = { usuarioId_productoId: { usuarioId: userId, productoId: id } };
    const existente = await prisma.favorito.findUnique({ where: clave });

    if (existente) {
      await prisma.favorito.delete({ where: clave });
    } else {
      await prisma.favorito.create({ data: { usuarioId: userId, productoId: id } });
    }

    return NextResponse.json({ ok: true, esFavorito: !existente, favoritos: await listar(userId) });
  } catch (error) {
    console.error('Error en POST /api/favoritos:', error);
    return NextResponse.json({ error: 'Error al alternar favorito' }, { status: 500 });
  }
}
```

</details>

<details>
<summary><code>app/api/auth/me/route.ts</code></summary>

```ts
import { unstable_rethrow } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';
import { aUsuario, getPrisma } from '@/app/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const usuarios = await getPrisma().usuario.findMany({
      select: { id: true, nombre: true, carrera: true, telefono: true, correo: true },
    });

    return NextResponse.json({ user, usuarios: usuarios.map(aUsuario) });
  } catch (error) {
    unstable_rethrow(error); // deja pasar las señales internas de Next (p. ej. cookies() al prerenderizar)
    console.error('Error en /api/auth/me:', error);
    return NextResponse.json({ user: null, usuarios: [] });
  }
}
```

</details>

<details>
<summary><code>app/api/auth/login/route.ts</code></summary>

```ts
import { NextResponse } from 'next/server';
import { aUsuario, getPrisma } from '@/app/lib/db';
import { verifyPassword, setSession } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: 'Ingresa tu correo y contraseña' },
        { status: 400 }
      );
    }

    const cleanEmail = correo.trim().toLowerCase();
    const user = await getPrisma().usuario.findUnique({ where: { correo: cleanEmail } });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'El correo no está registrado en el sistema' },
        { status: 401 }
      );
    }

    const passwordValida = verifyPassword(contrasena, user.password);
    if (!passwordValida) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    await setSession(user.id);

    return NextResponse.json({
      ok: true,
      user: aUsuario(user),
    });
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el inicio de sesión' },
      { status: 500 }
    );
  }
}
```

</details>

<details>
<summary><code>app/api/auth/register/route.ts</code></summary>

```ts
import { NextResponse } from 'next/server';
import { aUsuario, getPrisma } from '@/app/lib/db';
import { hashPassword, setSession } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, contrasena, carrera, telefono } = body;

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    if (!correo || !correo.trim()) {
      return NextResponse.json({ error: 'El correo institucional es obligatorio' }, { status: 400 });
    }

    const cleanEmail = correo.trim().toLowerCase();
    if (!cleanEmail.endsWith('@uaq.edu.mx') && !cleanEmail.endsWith('@alumnos.uaq.mx')) {
      return NextResponse.json(
        { error: 'Debes utilizar tu correo institucional (@uaq.edu.mx)' },
        { status: 400 }
      );
    }

    if (!contrasena || contrasena.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    const existing = await prisma.usuario.findUnique({ where: { correo: cleanEmail }, select: { id: true } });
    if (existing) {
      return NextResponse.json(
        { error: 'Este correo institucional ya cuenta con una cuenta registrada' },
        { status: 409 }
      );
    }

    const newId = `u_${Date.now()}`;
    const passwordHash = hashPassword(contrasena);
    const carreraFinal = carrera?.trim() || 'Ing. en Software';
    const telefonoFinal = telefono?.trim() || '4420000000';

    const newUser = await prisma.usuario.create({
      data: {
        id: newId,
        nombre: nombre.trim(),
        carrera: carreraFinal,
        telefono: telefonoFinal,
        correo: cleanEmail,
        password: passwordHash,
      },
    });
    await setSession(newId);

    return NextResponse.json({
      ok: true,
      user: aUsuario(newUser),
    });
  } catch (error) {
    console.error('Error en /api/auth/register:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar el registro' },
      { status: 500 }
    );
  }
}
```

</details>

### 3.4 Probar en tu computadora

```bash
npm run lint      # no debe marcar nada en app/lib ni en app/api
npm run build     # debe terminar sin errores
npm run dev       # usa fif_store.db (todavía sin Turso)
```

`npm run lint` revisa todo el proyecto. Si muestra avisos en otros archivos, por ejemplo `require()` en `scripts/*.js`, `prefer-const` en `app/lib/store.ts` o variables `err`/`e` sin usar, **son anteriores a la migración y no bloquean el despliegue**: desde Next.js 16, `next build` ya no ejecuta el linter. Para dejarlo limpio:

- **`scripts/*.js`:** son scripts de Node en CommonJS. En `eslint.config.mjs`, después de `...nextTs,`, agrega `{ files: ["scripts/**/*.js"], rules: { "@typescript-eslint/no-require-imports": "off" } },`.
- **`app/lib/store.ts`:** cambia `let nuevoEstado` por `const nuevoEstado`.
- **`catch (err)` o `catch (e)` cuya variable no se usa:** déjalo como `catch {`.

En el resumen de rutas que muestra `npm run build`, todas las rutas `/api/...` deben aparecer con **ƒ** (dinámicas). Después, en http://localhost:3000, revisa que:

- el feed muestre los productos;
- funcione el login con `alan.rubio@uaq.edu.mx` / `password123`;
- se pueda crear una publicación con varias fotos (carrusel) y marcar favoritos.

---

## Paso 4. Crear la base de datos en Turso

### 4.1 Instalar la CLI e iniciar sesión

```bash
brew install tursodatabase/tap/turso                 # macOS con Homebrew
# o bien: curl -sSfL https://get.tur.so/install.sh | bash

turso auth signup      # si aún no tienes cuenta
turso auth login       # si ya la tienes
```

Con el script de instalación, la CLI queda en `~/.turso/turso`. Si al terminar la terminal responde `command not found: turso`, abre una terminal nueva para que se cargue el `PATH`, o usa la ruta completa `~/.turso/turso`.

### 4.2 Preparar el archivo `fif_store.db`

Lo que haya en tu `fif_store.db` local es lo que se subirá a Turso (productos, usuarios, favoritos y publicaciones de prueba).

1. **Detén `npm run dev`.**
2. Pasa a la base los cambios pendientes del archivo `-wal`, como pide Turso:

```bash
sqlite3 fif_store.db "PRAGMA journal_mode='wal'; PRAGMA wal_checkpoint(TRUNCATE);"
ls -l fif_store.db-wal    # debe pesar 0 bytes (o no existir)
```

> Si te saltas este paso, las publicaciones más recientes pueden quedarse fuera.

### 4.3 Crear la base en Turso a partir del archivo

Ejecuta esto **desde la raíz del proyecto**, donde está `fif_store.db`:

```bash
turso db create fif-store --from-file ./fif_store.db --wait
turso db shell fif-store "SELECT name FROM sqlite_master WHERE type='table';"   # deben salir productos, usuarios y favoritos
```

> ⚠️ La opción `--from-file` es lo que sube tus datos. Si creas la base sin ella, o desde el panel web de Turso, queda **vacía** (sin tablas) y en el paso 4.5 verás `no such table`. En ese caso, ve al paso 4.5.
>
> No uses el dato `Size` de `turso db show` para comprobarlo: se actualiza con retraso y puede decir `0 B` aunque la base ya tenga todos los datos.

- El archivo puede pesar hasta 2 GB.
- La ubicación de la base depende del grupo de tu cuenta. Con `turso db locations -l` ves las ubicaciones disponibles y su latencia.
- Conviene que quede cerca de la región de las funciones de Vercel (por defecto `iad1`, Washington D. C., EE. UU.).

### 4.4 Obtener la URL y el token

```bash
turso db show fif-store --url        # algo como libsql://fif-store-tu-usuario.turso.io
turso db tokens create fif-store     # token de acceso (por defecto no expira)
```

Guarda los dos valores: serán las variables **`TURSO_DATABASE_URL`** y **`TURSO_AUTH_TOKEN`**.

Sobre el token:

- Puedes hacer que caduque con `--expiration 30d`, o que sea de solo lectura con `--read-only`. La app necesita escribir, así que no uses `--read-only` para ella.
- **Nunca subas el token a GitHub.**

### 4.5 Verificar los datos

```bash
turso db shell fif-store "SELECT COUNT(*) FROM productos;"
turso db shell fif-store "SELECT COUNT(*) FROM usuarios;"
```

Los números deben coincidir con tu base local (`sqlite3 fif_store.db "SELECT COUNT(*) FROM productos;"`).

**Si responde `no such table`:** la base de Turso se creó vacía. Tienes dos formas de cargar los datos:

- **Opción A, sin borrar la base** (conserva la URL y el token que ya tengas). Genera un volcado SQL de tu base local y ejecútalo en Turso:

  ```bash
  sqlite3 fif_store.db .dump > respaldo.sql
  turso db shell fif-store < respaldo.sql
  rm respaldo.sql
  ```

- **Opción B, volver a crearla desde el archivo.** Después tendrás que crear un token nuevo (paso 4.4), porque el anterior deja de servir:

  ```bash
  turso db destroy fif-store
  turso db create fif-store --from-file ./fif_store.db --wait
  ```

Después repite las consultas de arriba.

### 4.6 (Opcional) Probar tu app local contra Turso

Crea `.env.local` en la raíz. `.gitignore` ya ignora los archivos `.env*`.

```bash
TURSO_DATABASE_URL="libsql://fif-store-tu-usuario.turso.io"
TURSO_AUTH_TOKEN="pega-aquí-tu-token"
```

Al correr `npm run dev`, la app usará Turso en lugar del archivo local. Borra o renombra `.env.local` para volver a usar `fif_store.db`.

---

## Paso 5. Desplegar en Vercel

### 5.1 Subir los cambios a GitHub

Primero confirma que estás en la rama del paso 0:

```bash
git branch --show-current      # debe decir despliegue-vercel
# si dice main, crea la rama ahora (se lleva tus cambios con ella):
git switch -c despliegue-vercel
```

Luego sube los cambios:

```bash
git add -A
git commit -m "Migracion a Prisma y Turso para desplegar en Vercel"
git push -u origin despliegue-vercel
```

Antes de hacer `git add -A`, revisa con `git status` que no vayas a subir `.env.local`. El archivo `prisma/normalizar.sql` del paso 2.4 ya se aplicó y no hace falta subirlo; puedes borrarlo.

Abre un *pull request* hacia `main` (GitHub muestra el enlace al hacer el `push`) y únelo cuando la versión de prueba (*preview*) funcione.

### 5.2 Importar el proyecto

1. En https://vercel.com/new, conecta tu cuenta de GitHub e **importa el repositorio `Spacee44/Fif_Store`**.
2. Vercel detecta **Next.js**: deja los comandos de *build* e instalación como vienen. El `postinstall` generará el cliente de Prisma.

### 5.3 Variables de entorno

Antes de desplegar, en la configuración del proyecto (*Settings → Environment Variables*) agrega:

| Nombre | Valor | Entornos |
|---|---|---|
| `TURSO_DATABASE_URL` | la URL `libsql://...` del paso 4.4 | Production (y Preview si quieres) |
| `TURSO_AUTH_TOKEN` | el token del paso 4.4 (márcalo como *Sensitive*) | Production (y Preview si quieres) |

Para las versiones *preview*, lo ideal es otra base de Turso (por ejemplo `fif-store-pruebas`) para no tocar los datos reales.

> Los cambios en las variables **solo aplican a despliegues nuevos**: después de cambiarlas, vuelve a desplegar (*Redeploy*).

### 5.4 Versión de Node.js

En la configuración del proyecto elige **Node.js 22.x o 24.x**. Prisma 7 no funciona con versiones anteriores a 20.19.

### 5.5 Desplegar

Pulsa **Deploy**. En el log del *build* debes ver:

```
✔ Generated Prisma Client (7.10.1) to ./app/generated/prisma
✓ Compiled successfully
```

Al terminar, Vercel te da la URL pública (algo como `https://fif-store.vercel.app`).

### 5.6 Alternativa: desde la terminal con la CLI de Vercel

```bash
npm i -g vercel
vercel login
vercel link                                                        # vincula la carpeta con el proyecto
vercel env add TURSO_DATABASE_URL --environment production
vercel env add TURSO_AUTH_TOKEN --environment production --sensitive
vercel --prod                                                      # despliegue a producción
vercel env pull .env.local                                         # (opcional) baja las variables a tu .env.local
```

---

## Paso 6. Verificar en producción

En la URL de Vercel, comprueba:

- [ ] El feed muestra los productos con sus fotos.
- [ ] La búsqueda y los filtros por categoría funcionan.
- [ ] Inicias sesión con `alan.rubio@uaq.edu.mx` / `password123`.
- [ ] Puedes registrarte con un correo `@uaq.edu.mx`.
- [ ] Puedes crear una publicación con 2 a 4 fotos, y el detalle muestra el carrusel.
- [ ] Favoritos, "Marcar como vendido" y "Eliminar" funcionan.
- [ ] La publicación nueva aparece en Turso: `turso db shell fif-store "SELECT id, nombre FROM productos ORDER BY id DESC LIMIT 3;"`
- [ ] En Vercel, la sección de **Logs** del proyecto no muestra errores.

---

## Cambios futuros al esquema

Prisma Migrate no puede conectarse directamente a Turso. El flujo es generar el SQL de cada cambio contra tu copia local y aplicarlo en los dos lados. Por eso **tu `fif_store.db` local debe tener siempre el mismo esquema que Turso.**

```bash
# 1) Edita prisma/schema.prisma (por ejemplo, agrega un campo)

# 2) Genera el SQL del cambio comparando con tu base local
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script > prisma/cambios/2026-12-01-descripcion.sql

# 3) Revisa el archivo .sql y aplícalo en local y en Turso
npx prisma db execute --file prisma/cambios/2026-12-01-descripcion.sql
turso db shell fif-store < prisma/cambios/2026-12-01-descripcion.sql

# 4) Regenera el cliente y despliega
npx prisma generate
```

Crea antes la carpeta `prisma/cambios/` y sube esos `.sql` al repositorio para tener el historial de cambios.

---

## Límites y recomendaciones antes de publicar

**Tamaño de las peticiones.** Vercel acepta como máximo **4.5 MB** por petición a una función. Si se excede, responde `413 FUNCTION_PAYLOAD_TOO_LARGE`. Como el formulario reduce cada foto a 800 px, 4 fotos caben de sobra.

**Fotos en Base64.** Las fotos que suben los usuarios se guardan como texto dentro de la base, y eso la hace crecer rápido. Para más adelante conviene guardarlas en un servicio de archivos (por ejemplo, Vercel Blob) y dejar en la base solo la URL.

**Datos locales y de producción.** Después de importar, los datos reales viven en Turso y tu `fif_store.db` queda solo para desarrollo. `scripts/seed.js` **borra y recrea** el archivo local; no afecta a Turso.

**Seguridad, antes de compartir la URL públicamente.** La app tiene estas limitaciones conocidas (ver `README.md`) que en internet sí importan:

- La cookie de sesión guarda el id del usuario sin firmar: cualquiera podría hacerse pasar por otro. Conviene firmarla (por ejemplo, con un JWT).
- `PUT` y `DELETE` de `/api/productos/[id]` no verifican que quien los llama sea el dueño de la publicación.
- Sin sesión, la creación de publicaciones y los favoritos se hacen a nombre del usuario `u1`. En producción deberían responder `401`.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `npx prisma generate` responde *"Could not find Prisma Schema…"* y menciona `prisma7.config.ts` | Está instalada la CLI 8.0.0-rc (el paso 1 no se aplicó) o falta algún archivo del paso 2 | `npx prisma --version` debe decir 7.10.1; si no, repite el paso 1. Revisa con `ls prisma.config.ts prisma/schema.prisma` que existan los dos archivos |
| `npm install` / `npm ci` fallan con `command sh -c prisma generate` | Existe el script `postinstall` pero falta `prisma/schema.prisma`, o está instalada la CLI 8 | Crea los archivos del paso 2 y confirma `npx prisma --version` = 7.10.1; mientras tanto puedes quitar `postinstall` y volver a agregarlo en el paso 2.3 |
| npx pregunta *"Need to install the following packages: prisma@8…"* | Estás fuera de la carpeta del proyecto, y npx descarga la versión más reciente (la 8 de prueba) | Responde `n`, entra a la raíz con `cd "…/Fif_Store"` (con comillas si la ruta tiene espacios), confirma con `ls package.json` y comprueba que `npx prisma --version` diga 7.10.1 |
| `npm run lint` marca `require()` en `scripts/*.js`, `prefer-const` en `store.ts` o variables sin usar | Avisos anteriores a la migración | No bloquean el build ni Vercel; ver cómo corregirlos en el paso 3.4 |
| El build falla con `Cannot find module '@/app/generated/prisma/client'` | No se generó el cliente | Revisa que exista el script `postinstall` en `package.json`; en local corre `npx prisma generate` |
| El build falla con `prisma: command not found` | Vercel no encontró la CLI | Mueve `prisma` de `devDependencies` a `dependencies` |
| `Error: Falta la variable de entorno TURSO_DATABASE_URL` | La variable no existe en Vercel o se agregó después del despliegue | Agrégala en *Settings → Environment Variables* y vuelve a desplegar |
| Errores de autenticación (401) al conectar con Turso | Token incorrecto, caducado o de solo lectura | Crea otro con `turso db tokens create fif-store`, actualiza `TURSO_AUTH_TOKEN` y vuelve a desplegar |
| `no such table: productos` | La base de Turso se creó vacía (sin `--from-file`, o desde el panel web) o la URL apunta a otra base | Confirma con `turso db shell fif-store "SELECT name FROM sqlite_master WHERE type='table';"` y carga los datos con la opción A o B del paso 4.5 |
| `command not found: turso` | La terminal no tiene la CLI en el `PATH` | Abre una terminal nueva o usa `~/.turso/turso` |
| `git push` responde *"src refspec despliegue-vercel does not match any"* | La rama no existe: el commit quedó en `main` | `git switch -c despliegue-vercel` y repite el `push`. Para que tu `main` local vuelva a coincidir con GitHub: `git branch -f main origin/main` |
| Faltan publicaciones recientes en Turso | El `-wal` no se pasó a la base antes de importar | Repite el paso 4.2 y vuelve a importar (o recrea la base) |
| Al publicar responde `413 FUNCTION_PAYLOAD_TOO_LARGE` | La petición supera 4.5 MB | Sube menos fotos o más ligeras |
| `migrate diff` quiere reconstruir la tabla `usuarios` | No se hizo la normalización | Haz el paso 2.4 |
| La CLI dice *"This is a major update"* | Aviso de la versión 8 de prueba | Ignóralo; quédate en 7.10.1 (`PRISMA_HIDE_UPDATE_MESSAGE=1` lo oculta) |
| `npm audit` reporta una alerta alta en `effect` | Dependencia de la CLI de Prisma (solo se usa al compilar) | No ejecutes `npm audit fix --force`: bajaría Prisma a la versión 6 |
| En el log del build aparece *"During prerendering, cookies() rejects…"* | Un `catch` atrapa la señal interna de Next | Agrega `unstable_rethrow(error)` al inicio de ese `catch` (ver paso 3.3) |

---

## Referencias

- Prisma, SQLite y Turso: https://www.prisma.io/docs/orm/overview/databases/turso
- Actualizar a Prisma 7: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Prisma en Vercel: https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel
- Turso CLI: https://docs.turso.tech/cli/installation y https://docs.turso.tech/cli/db/create
- Migrar a Turso: https://docs.turso.tech/cloud/migrate-to-turso
- Turso con Vercel: https://docs.turso.tech/integrations/vercel
- Límites de las funciones de Vercel: https://vercel.com/docs/functions/limitations
- Variables de entorno en Vercel: https://vercel.com/docs/environment-variables
