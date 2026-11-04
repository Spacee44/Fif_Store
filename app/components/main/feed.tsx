'use client';

import { useState } from 'react';
import Link from 'next/link';

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen?: string; // ruta en /public, por ejemplo "/images/takis.png"
};

// Datos de ejemplo: más adelante vendrán de tu base de datos / API
const PRODUCTOS: Producto[] = [
  { id: 1, nombre: 'Takis 240g', precio: 15, categoria: 'Papas' },
  { id: 2, nombre: 'Ruffles', precio: 20, categoria: 'Papas' },
  { id: 3, nombre: 'Chidas Jalapeño', precio: 25, categoria: 'Papas' },
  { id: 4, nombre: 'Chidas Adobadas', precio: 25, categoria: 'Papas' },
  { id: 5, nombre: 'Coca-Cola 600ml', precio: 25, categoria: 'Bebidas' },
  { id: 6, nombre: 'Emperador Chocolate', precio: 18, categoria: 'Galletas' },
  { id: 7, nombre: 'Panditas', precio: 12, categoria: 'Gomitas' },
  { id: 8, nombre: 'Mazapán De la Rosa', precio: 8, categoria: 'Dulces' },
];

const CATEGORIAS = ['Todo', 'Papas', 'Galletas', 'Gomitas', 'Bebidas', 'Dulces'];

export default function Feed() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todo');

  const productosFiltrados = PRODUCTOS.filter((p) => {
    const coincideCategoria = categoria === 'Todo' || p.categoria === categoria;
    const coincideBusqueda = p.nombre
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-screen bg-white sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col sm:my-8">

        {/* ENCABEZADO: logo + buscador */}
        <header className="bg-[#1b364c] rounded-b-[36px] px-6 pt-8 pb-6 shrink-0">
          <div className="text-center mb-5">
            <h1 className="text-white font-serif text-[2rem] leading-none tracking-[0.18em]">
              FIF STORE
            </h1>
            <p className="text-white/80 text-[0.65rem] tracking-[0.3em] mt-1">
              compra y venta
            </p>
          </div>

          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2d4059]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="¿Qué estás buscando?"
              aria-label="Buscar productos"
              className="w-full bg-white text-gray-800 rounded-full pl-12 pr-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#fbb040] placeholder-gray-400 font-medium"
            />
          </div>
        </header>

        {/* CONTENIDO CON SCROLL */}
        <main className="flex-grow overflow-y-auto px-5 pt-5 pb-28">

          {/* Categorías */}
          <div
            className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Categorías"
          >
            {CATEGORIAS.map((cat) => {
              const activa = cat === categoria;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activa}
                  onClick={() => setCategoria(cat)}
                  className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    activa
                      ? 'bg-[#fbb040] text-[#2d4059]'
                      : 'bg-[#e8ecef] text-[#2d4059] hover:bg-[#dde2e6]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Productos */}
          {productosFiltrados.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4">
              {productosFiltrados.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/producto/${p.id}`}
                    className="block rounded-2xl border border-gray-200 bg-white overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#fbb040] active:scale-[0.98] transition-transform"
                  >
                    <div className="aspect-[4/3] bg-[#fdebc8] flex items-center justify-center">
                      {p.imagen && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imagen}
                          alt={p.nombre}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="px-3 py-2.5">
                      <p className="text-[#2d4059] text-sm font-medium leading-tight truncate">
                        {p.nombre}
                      </p>
                      <p className="text-[#2d4059] text-sm mt-1">${p.precio}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 text-sm mt-16 px-6">
              <p className="font-medium text-[#2d4059] mb-1">
                No encontramos productos
              </p>
              <p>Prueba con otra palabra o elige otra categoría.</p>
            </div>
          )}
        </main>

        {/* BARRA INFERIOR */}
        <nav
          className="absolute bottom-0 inset-x-0 bg-[#1b364c] rounded-t-[36px] h-24 px-10 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          <Link
            href="/feed"
            aria-label="Inicio"
            className="p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb040] rounded-full"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3l9 8h-2.5v9h-4.5v-6h-4v6H5.5v-9H3l9-8z" />
            </svg>
          </Link>

          <Link
            href="/vender"
            aria-label="Publicar producto"
            className="-mt-8 w-16 h-16 rounded-full bg-[#fbb040] hover:bg-[#f5a123] shadow-lg flex items-center justify-center text-[#1b364c] active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>

          <Link
            href="/perfil"
            aria-label="Mi perfil"
            className="p-2 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fbb040] rounded-full"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="12" cy="8" r="4.5" />
              <path d="M3.5 21c0-4.6 3.8-7.5 8.5-7.5s8.5 2.9 8.5 7.5H3.5z" />
            </svg>
          </Link>
        </nav>
      </div>
    </div>
  );
}
