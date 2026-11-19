'use client';

import Image from 'next/image';
import Link from 'next/link';
import { alternarFavorito, useHidratado, useStore } from '../../lib/store';
import BottomNav from '../ui/bottomNav';
import PhoneShell from '../ui/phoneShell';
import ProductImage from '../ui/productImage';
import TopBar from '../ui/topBar';

export default function Favorites() {
  const { productos, favoritos } = useStore();
  const hidratado = useHidratado();
  const lista = favoritos
    .map((id) => productos.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return (
    <PhoneShell>
      <TopBar titulo="Favoritos" fallbackHref="/perfil" />

      <main className="flex-grow overflow-y-auto px-5 pt-6 pb-32">
        {!hidratado ? null : lista.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-fif-muted text-xl px-14">
            <Image src="/icons/favorite-big.png" alt="" width={90} height={90} />
            <p className="mt-4">
              Aún no tienes favoritos, Toca el corazón en una publicación para guardarla.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {lista.map((p) => (
              <li
                key={p.id}
                className="bg-white border border-fif-border rounded-[50px] min-h-[209px] px-4 py-5 flex items-center gap-6"
              >
                <Link
                  href={`/producto/${p.id}`}
                  aria-label={`Ver ${p.nombre}`}
                  className="w-[121px] h-[116px] shrink-0 bg-fif-cream rounded-[30px] flex items-center justify-center overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
                >
                  <ProductImage producto={p} iconSize={70} />
                </Link>

                <div className="min-w-0 text-2xl">
                  <Link
                    href={`/producto/${p.id}`}
                    className="block text-fif-navy hover:underline break-words"
                  >
                    {p.nombre}
                  </Link>
                  <p className="text-fif-navy">
                    ${p.precio}
                    {p.vendido && <span className="text-base text-fif-muted"> · Vendido</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => alternarFavorito(p.id)}
                    className="mt-3 text-left text-[red] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange rounded"
                  >
                    Quitar de favoritos
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <BottomNav />
    </PhoneShell>
  );
}
