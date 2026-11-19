'use client';

// Estado del lado del cliente (productos, favoritos, usuarios) guardado en
// localStorage. Es un sustituto temporal de la API / base de datos: cuando
// exista un backend, basta con reemplazar las acciones de este archivo.

import { useSyncExternalStore } from 'react';
import {
  FAVORITOS_INICIALES,
  PRODUCTOS_INICIALES,
  USUARIO_ACTUAL_ID,
  USUARIOS_INICIALES,
  type Producto,
  type Usuario,
} from './data';

type Estado = {
  productos: Producto[];
  usuarios: Usuario[];
  favoritos: number[];
};

const CLAVE = 'fif-store-v1';

const ESTADO_INICIAL: Estado = {
  productos: PRODUCTOS_INICIALES,
  usuarios: USUARIOS_INICIALES,
  favoritos: FAVORITOS_INICIALES,
};

let estado: Estado = ESTADO_INICIAL;
let cargado = false;
const oyentes = new Set<() => void>();

function cargar() {
  if (cargado || typeof window === 'undefined') return;
  cargado = true;
  try {
    const guardado = window.localStorage.getItem(CLAVE);
    if (guardado) estado = { ...ESTADO_INICIAL, ...JSON.parse(guardado) };
  } catch {
    // Almacenamiento no disponible o datos corruptos: usamos los iniciales.
  }
}

function guardar() {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin espacio (p. ej. demasiadas fotos) o almacenamiento bloqueado.
  }
}

function actualizar(fn: (e: Estado) => Estado) {
  cargar();
  estado = fn(estado);
  guardar();
  oyentes.forEach((o) => o());
}

function suscribir(oyente: () => void) {
  cargar();
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}

function obtenerEstado() {
  cargar();
  return estado;
}

function obtenerEstadoServidor() {
  return ESTADO_INICIAL;
}

export function useStore(): Estado {
  return useSyncExternalStore(suscribir, obtenerEstado, obtenerEstadoServidor);
}

const noop = () => () => {};

/** `true` una vez que el cliente ya leyó localStorage. */
export function useHidratado(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useUsuarioActual(): Usuario {
  const { usuarios } = useStore();
  return usuarios.find((u) => u.id === USUARIO_ACTUAL_ID) ?? USUARIOS_INICIALES[0];
}

// ----- Acciones -----

export type DatosProducto = Pick<
  Producto,
  'nombre' | 'precio' | 'categoria' | 'descripcion' | 'imagenes'
>;

export function crearProducto(datos: DatosProducto): number {
  let nuevoId = 0;
  actualizar((e) => {
    // Basado en la hora para no reutilizar ids de publicaciones borradas.
    nuevoId = Math.max(Date.now(), ...e.productos.map((p) => p.id + 1));
    const nuevo: Producto = {
      ...datos,
      id: nuevoId,
      vendedorId: USUARIO_ACTUAL_ID,
      vendido: false,
    };
    return { ...e, productos: [nuevo, ...e.productos] };
  });
  return nuevoId;
}

export function editarProducto(id: number, datos: DatosProducto) {
  actualizar((e) => ({
    ...e,
    productos: e.productos.map((p) => (p.id === id ? { ...p, ...datos } : p)),
  }));
}

export function alternarVendido(id: number) {
  actualizar((e) => ({
    ...e,
    productos: e.productos.map((p) =>
      p.id === id ? { ...p, vendido: !p.vendido } : p,
    ),
  }));
}

export function eliminarProducto(id: number) {
  actualizar((e) => ({
    ...e,
    productos: e.productos.filter((p) => p.id !== id),
    favoritos: e.favoritos.filter((f) => f !== id),
  }));
}

export function alternarFavorito(id: number) {
  actualizar((e) => ({
    ...e,
    favoritos: e.favoritos.includes(id)
      ? e.favoritos.filter((f) => f !== id)
      : [...e.favoritos, id],
  }));
}

export function actualizarUsuarioActual(
  datos: Partial<Omit<Usuario, 'id'>>,
) {
  actualizar((e) => ({
    ...e,
    usuarios: e.usuarios.map((u) =>
      u.id === USUARIO_ACTUAL_ID ? { ...u, ...datos } : u,
    ),
  }));
}
