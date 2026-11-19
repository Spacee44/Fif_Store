// Tipos y datos de ejemplo de FIF Store.
// Más adelante estos datos vendrán de la base de datos / API.

export type Categoria =
  | 'Papas'
  | 'Galletas'
  | 'Gomitas'
  | 'Bebidas'
  | 'Dulces'
  | 'Comida';

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: Categoria;
  descripcion: string;
  vendedorId: string;
  vendido: boolean;
  imagenes: string[]; // data URLs o rutas en /public
};

export type Usuario = {
  id: string;
  nombre: string;
  carrera: string;
  telefono: string;
  correo: string;
};

export const CATEGORIAS: Categoria[] = [
  'Papas',
  'Galletas',
  'Gomitas',
  'Bebidas',
  'Dulces',
  'Comida',
];

// Ícono ilustrativo (del diseño en Figma) para cada categoría.
export const ICONO_CATEGORIA: Record<Categoria, string> = {
  Papas: '/icons/fries.png',
  Galletas: '/icons/cookie.png',
  Gomitas: '/icons/candy.png',
  Bebidas: '/icons/soda.png',
  Dulces: '/icons/candy.png',
  Comida: '/icons/pizza.png',
};

export const USUARIO_ACTUAL_ID = 'u1';

export const USUARIOS_INICIALES: Usuario[] = [
  {
    id: 'u1',
    nombre: 'Alan Rubio',
    carrera: 'Ing. en Software',
    telefono: '4421234567',
    correo: 'alan.rubio@uaq.edu.mx',
  },
  {
    id: 'u2',
    nombre: 'Josue Castillo',
    carrera: 'Ing. en Software',
    telefono: '4427654321',
    correo: 'josue.castillo@uaq.edu.mx',
  },
  {
    id: 'u3',
    nombre: 'Daniel Fort',
    carrera: 'Ing. en Software',
    telefono: '4421112233',
    correo: 'daniel.fort@uaq.edu.mx',
  },
];

export const PRODUCTOS_INICIALES: Producto[] = [
  { id: 1, nombre: 'Takis 240g', precio: 15, categoria: 'Papas', descripcion: 'Takis Fuego de 240g, cerrados.', vendedorId: 'u2', vendido: false, imagenes: [] },
  { id: 2, nombre: 'Ruffles', precio: 20, categoria: 'Papas', descripcion: 'Ruffles queso, bolsa grande.', vendedorId: 'u2', vendido: false, imagenes: [] },
  { id: 3, nombre: 'Chidas Jalapeño', precio: 25, categoria: 'Papas', descripcion: 'Chidas sabor jalapeño.', vendedorId: 'u2', vendido: false, imagenes: [] },
  { id: 4, nombre: 'Chidas Adobadas', precio: 25, categoria: 'Papas', descripcion: 'Chidas adobadas de 250g', vendedorId: 'u2', vendido: false, imagenes: [] },
  { id: 5, nombre: 'Coca-Cola 600ml', precio: 25, categoria: 'Bebidas', descripcion: 'Vendo coca bien fria, me encuentro en el C02', vendedorId: 'u2', vendido: false, imagenes: [] },
  { id: 6, nombre: 'Emperador Chocolate', precio: 18, categoria: 'Galletas', descripcion: 'Paquete de galletas Emperador.', vendedorId: 'u3', vendido: false, imagenes: [] },
  { id: 7, nombre: 'Panditas', precio: 12, categoria: 'Gomitas', descripcion: 'Bolsita de gomitas Panditas.', vendedorId: 'u3', vendido: false, imagenes: [] },
  { id: 8, nombre: 'Mazapán De la Rosa', precio: 8, categoria: 'Dulces', descripcion: 'Mazapán clásico.', vendedorId: 'u3', vendido: true, imagenes: [] },
  { id: 9, nombre: 'Brownies caseros', precio: 25, categoria: 'Galletas', descripcion: 'Brownies hechos en casa, con nuez.', vendedorId: 'u1', vendido: false, imagenes: [] },
  { id: 10, nombre: 'Gomitas', precio: 15, categoria: 'Gomitas', descripcion: 'Gomitas enchiladas.', vendedorId: 'u1', vendido: false, imagenes: [] },
  { id: 11, nombre: 'Rebanada de pizza', precio: 20, categoria: 'Comida', descripcion: 'Rebanada de pizza de Liru siza, de pepperoni', vendedorId: 'u1', vendido: false, imagenes: [] },
];

export const FAVORITOS_INICIALES: number[] = [1, 5, 3];

export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function imagenProducto(p: Producto): string {
  return p.imagenes[0] ?? ICONO_CATEGORIA[p.categoria];
}

export function enlaceWhatsApp(telefono: string, mensaje: string): string {
  const numero = telefono.replace(/\D/g, '');
  return `https://wa.me/52${numero}?text=${encodeURIComponent(mensaje)}`;
}
