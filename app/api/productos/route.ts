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
