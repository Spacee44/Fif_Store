'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

/** Barra superior azul con botón de regreso, título y acción opcional. */
export default function TopBar({
  titulo,
  fallbackHref = '/feed',
  accion,
}: {
  titulo: string;
  fallbackHref?: string;
  accion?: ReactNode;
}) {
  const router = useRouter();

  const regresar = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <header className="bg-fif-navy h-[83px] shrink-0 grid grid-cols-[56px_1fr_56px] items-center px-3">
      <button
        type="button"
        onClick={regresar}
        aria-label="Regresar"
        className="w-12 h-12 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
      >
        <Image src="/icons/back.png" alt="" width={40} height={40} />
      </button>

      <h1 className="text-white text-[1.75rem] text-center truncate">{titulo}</h1>

      <div className="flex justify-center">{accion}</div>
    </header>
  );
}
