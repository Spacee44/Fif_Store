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
