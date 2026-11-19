'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIAS as CATEGORIAS_PRODUCTO } from '../../lib/data';
import { useStore } from '../../lib/store';
import BottomNav from '../ui/bottomNav';
import ProductImage from '../ui/productImage';

const CATEGORIAS = ['Todo', ...CATEGORIAS_PRODUCTO];

export default function Feed() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todo');
  const { productos } = useStore();

  // Solo se muestran las publicaciones que siguen disponibles.
  const productosFiltrados = productos.filter((p) => !p.vendido).filter((p) => {
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
                    <div className="aspect-[4/3] bg-[#fdebc8] flex items-center justify-center overflow-hidden">
                      <ProductImage producto={p} iconSize={64} />
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
            <div className="flex flex-col items-center text-center text-[#939393] text-lg mt-20 px-10">
              <Image src="/icons/sad.png" alt="" width={90} height={90} />
              <p className="mt-4">
                No encontramos productos. Prueba con otra búsqueda o categoría
              </p>
            </div>
          )}
        </main>

        {/* BARRA INFERIOR */}
        <BottomNav />
      </div>
    </div>
  );
}
