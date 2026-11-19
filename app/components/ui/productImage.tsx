import Image from 'next/image';
import { ICONO_CATEGORIA, type Producto } from '../../lib/data';

/**
 * Muestra la primera foto del producto o, si no tiene, el ícono de su
 * categoría (como en el diseño de Figma).
 */
export default function ProductImage({
  producto,
  iconSize,
}: {
  producto: Producto;
  iconSize: number;
}) {
  const foto = producto.imagenes[0];

  if (foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={foto} alt={producto.nombre} className="w-full h-full object-cover" />
    );
  }

  return (
    <Image
      src={ICONO_CATEGORIA[producto.categoria]}
      alt=""
      width={iconSize}
      height={iconSize}
    />
  );
}
