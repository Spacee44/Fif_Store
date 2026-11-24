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
