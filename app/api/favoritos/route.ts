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
