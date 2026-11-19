import type { ReactNode } from 'react';

/**
 * Marco tipo teléfono que comparten todas las pantallas
 * (mismo contenedor que usan el login y el feed).
 */
export default function PhoneShell({
  children,
  className = 'bg-white',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div
        className={`w-full max-w-md h-screen sm:h-[850px] sm:max-h-screen sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col sm:my-8 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
