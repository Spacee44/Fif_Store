import { iniciales } from '../../lib/data';

/** Círculo naranja con las iniciales del usuario. */
export default function Avatar({
  nombre,
  className = 'w-16 h-16 text-2xl',
}: {
  nombre: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full bg-fif-orange text-fif-navy flex items-center justify-center shrink-0 ${className}`}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </div>
  );
}
