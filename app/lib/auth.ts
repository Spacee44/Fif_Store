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
