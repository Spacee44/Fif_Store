'use client';

import { useRef, useState } from 'react';
import { ICONO_CATEGORIA, type Producto } from '../../lib/data';
import ProductImage from './productImage';

/**
 * Foto principal del detalle de un producto. Con una sola foto (o ninguna) se ve
 * igual que antes; con dos o más se convierte en un carrusel que se desliza con
 * el dedo, con flechas, puntos indicadores, contador y teclado.
 */
export default function ImageCarousel({
  producto,
  iconSize,
  className,
}: {
  producto: Producto;
  iconSize: number;
  /** Clases del contenedor (alto, fondo, etc.). */
  className: string;
}) {
  const fotos = producto.imagenes;
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);

  if (fotos.length <= 1) {
    return (
      <div className={`${className} flex items-center justify-center overflow-hidden`}>
        <ProductImage producto={producto} iconSize={iconSize} />
      </div>
    );
  }

  const total = fotos.length;
  // Por si la publicación cambia de número de fotos mientras está abierta.
  const indice = Math.min(actual, total - 1);

  const irA = (i: number) => {
    const el = pista.current;
    if (!el) return;
    const destino = Math.max(0, Math.min(total - 1, i));
    const sinAnimacion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: destino * el.clientWidth, behavior: sinAnimacion ? 'auto' : 'smooth' });
    setActual(destino);
  };

  return (
    <div
      className={`${className} relative overflow-hidden`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Fotos de ${producto.nombre}`}
    >
      <div
        ref={pista}
        tabIndex={0}
        aria-label={`Foto ${indice + 1} de ${total}. Usa las flechas del teclado para cambiar de foto.`}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.clientWidth) setActual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            irA(indice + 1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            irA(indice - 1);
          }
        }}
        className="flex h-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fif-orange"
      >
        {fotos.map((src, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${total}`}
            className="w-full h-full shrink-0 snap-center flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${producto.nombre} (foto ${i + 1} de ${total})`}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              draggable={false}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = ICONO_CATEGORIA[producto.categoria];
                e.currentTarget.className = 'w-auto h-auto max-w-[60%] max-h-[60%] object-contain m-auto';
              }}
            />
          </div>
        ))}
      </div>

      {/* Contador */}
      <span className="absolute top-3 right-3 rounded-full bg-black/55 text-white text-sm px-2.5 py-0.5 pointer-events-none" aria-hidden="true">
        {indice + 1} / {total}
      </span>

      {/* Flechas */}
      {indice > 0 && (
        <button
          type="button"
          onClick={() => irA(indice - 1)}
          aria-label="Foto anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-fif-navy shadow flex items-center justify-center hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      )}
      {indice < total - 1 && (
        <button
          type="button"
          onClick={() => irA(indice + 1)}
          aria-label="Foto siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-fif-navy shadow flex items-center justify-center hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}

      {/* Puntos indicadores */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {fotos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ver foto ${i + 1}`}
            aria-current={i === indice}
            className="p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
          >
            <span
              className={`block h-2 rounded-full shadow transition-all ${
                i === indice ? 'w-6 bg-fif-orange' : 'w-2 bg-white/90'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
