import Image from 'next/image';
import Link from 'next/link';

/** Barra de navegación inferior: inicio, publicar y perfil. */
export default function BottomNav() {
  return (
    <nav
      className="absolute bottom-0 inset-x-0 bg-fif-navy rounded-t-[62px] h-24 px-9 flex items-center justify-between"
      aria-label="Navegación principal"
    >
      <Link
        href="/feed"
        aria-label="Inicio"
        className="rounded-full p-1 opacity-90 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
      >
        <Image src="/icons/home.png" alt="" width={57} height={57} />
      </Link>

      <Link
        href="/vender"
        aria-label="Publicar producto"
        className="-mt-6 rounded-full active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Image src="/icons/plus.png" alt="" width={74} height={74} />
      </Link>

      <Link
        href="/perfil"
        aria-label="Mi perfil"
        className="rounded-full p-1 opacity-90 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
      >
        <Image src="/icons/person.png" alt="" width={58} height={58} />
      </Link>
    </nav>
  );
}
