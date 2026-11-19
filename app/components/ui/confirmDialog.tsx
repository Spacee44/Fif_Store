'use client';

import { useEffect, useRef } from 'react';

/** Modal de confirmación (diseño "Borrar Publicación"). */
export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Eliminar',
  onConfirmar,
  onCancelar,
}: {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    cancelarRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center px-6"
      onClick={onCancelar}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-titulo"
        aria-describedby="confirm-mensaje"
        className="bg-white rounded-[20px] w-[235px] px-6 py-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-titulo" className="text-fif-navy text-xl leading-tight">
          {titulo}
        </h2>
        <p id="confirm-mensaje" className="text-[#7d7d7d] text-base mt-3 leading-tight">
          {mensaje}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            ref={cancelarRef}
            type="button"
            onClick={onCancelar}
            className="flex-1 h-9 rounded-[20px] border border-black text-black text-base hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="flex-1 h-9 rounded-[20px] bg-fif-danger text-white text-base hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-orange"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
