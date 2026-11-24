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
