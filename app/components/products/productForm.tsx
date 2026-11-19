'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { CATEGORIAS, type Categoria } from '../../lib/data';
import type { DatosProducto } from '../../lib/store';

const MAX_FOTOS = 4;
const LADO_MAX = 800; // px: las fotos se reducen antes de guardarlas

/** Reduce la imagen y la convierte a data URL (JPEG) para poder guardarla. */
function leerFoto(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new window.Image();
    img.onload = () => {
      const escala = Math.min(1, LADO_MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });
}

export default function ProductForm({
  inicial,
  textoBoton,
  onGuardar,
}: {
  inicial?: DatosProducto;
  textoBoton: string;
  onGuardar: (datos: DatosProducto) => void;
}) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [precio, setPrecio] = useState(inicial ? String(inicial.precio) : '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [categoria, setCategoria] = useState<Categoria | null>(inicial?.categoria ?? null);
  const [imagenes, setImagenes] = useState<string[]>(inicial?.imagenes ?? []);
  const [error, setError] = useState('');
  const inputFotos = useRef<HTMLInputElement>(null);

  const agregarFotos = async (archivos: FileList | null) => {
    if (!archivos) return;
    const disponibles = MAX_FOTOS - imagenes.length;
    const seleccion = Array.from(archivos).slice(0, disponibles);
    try {
      const nuevas = await Promise.all(seleccion.map(leerFoto));
      setImagenes((prev) => [...prev, ...nuevas].slice(0, MAX_FOTOS));
    } catch {
      setError('No se pudo cargar una de las fotos.');
    }
  };

  const campo =
    'w-full h-14 bg-fif-field rounded-[20px] px-5 text-fif-navy text-xl placeholder-[#989898] focus:outline-none focus:ring-2 focus:ring-fif-orange';
  const etiqueta = 'block text-fif-navy text-2xl mb-2 ml-2';

  return (
    <form
      className="px-9 pt-8 pb-8 flex flex-col"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const valorPrecio = Number(precio);
        if (!nombre.trim()) return setError('Escribe el nombre del producto.');
        if (!precio || !Number.isFinite(valorPrecio) || valorPrecio <= 0)
          return setError('Escribe un precio válido mayor a 0.');
        if (!categoria) return setError('Elige una categoría.');
        setError('');
        onGuardar({
          nombre: nombre.trim(),
          precio: Math.round(valorPrecio * 100) / 100,
          descripcion: descripcion.trim(),
          categoria,
          imagenes,
        });
      }}
    >
      {/* Fotografías */}
      <p className={etiqueta}>
        Fotografias({imagenes.length}/{MAX_FOTOS})
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {imagenes.length < MAX_FOTOS && (
          <button
            type="button"
            onClick={() => inputFotos.current?.click()}
            aria-label="Agregar fotografía"
            className="shrink-0 w-[111px] h-[115px] rounded-[20px] bg-fif-cream border-2 border-fif-orange flex items-center justify-center hover:brightness-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-navy"
          >
            <Image src="/icons/add-camera.png" alt="" width={79} height={72} />
          </button>
        )}

        {imagenes.length === 0 && (
          <div className="shrink-0 w-[111px] h-[115px] rounded-[20px] bg-fif-cream border-2 border-fif-orange flex items-center justify-center">
            <Image src="/icons/picture.png" alt="" width={79} height={72} />
          </div>
        )}

        {imagenes.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 w-[111px] h-[115px] rounded-[20px] border-2 border-fif-orange overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Fotografía ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setImagenes((prev) => prev.filter((_, j) => j !== i))}
              aria-label={`Quitar fotografía ${i + 1}`}
              className="absolute top-1 right-1 w-7 h-7 rounded-full bg-white/90 text-fif-danger text-lg leading-none flex items-center justify-center shadow"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        ref={inputFotos}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          agregarFotos(e.target.files);
          e.target.value = '';
        }}
      />

      {/* Nombre */}
      <label htmlFor="pf-nombre" className={`${etiqueta} mt-6`}>
        Nombre del producto
      </label>
      <input
        id="pf-nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Ingresa el nombre aqui"
        maxLength={60}
        className={campo}
      />

      {/* Precio */}
      <label htmlFor="pf-precio" className={`${etiqueta} mt-6`}>
        Precio (MXN)
      </label>
      <input
        id="pf-precio"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.5"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        placeholder="Ingresa el precio aqui"
        className={campo}
      />

      {/* Descripción */}
      <label htmlFor="pf-desc" className={`${etiqueta} mt-6`}>
        Descripción
      </label>
      <textarea
        id="pf-desc"
        rows={2}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Ingresa descripcion aqui"
        maxLength={300}
        className={`${campo} h-auto min-h-14 py-3 resize-none`}
      />

      {/* Categoría */}
      <p className={`${etiqueta} mt-4`} id="pf-cat">
        Categoría
      </p>
      <div className="flex flex-wrap gap-x-2.5 gap-y-3.5 px-2" role="radiogroup" aria-labelledby="pf-cat">
        {CATEGORIAS.map((cat) => {
          const activa = cat === categoria;
          return (
            <button
              key={cat}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => setCategoria(cat)}
              className={`w-[134px] h-[43px] rounded-[20px] text-fif-navy text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-navy ${
                activa ? 'bg-fif-orange' : 'bg-fif-field hover:bg-[#e8e8e8]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-fif-danger text-base mt-5 text-center">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 h-[78px] rounded-[30px] bg-fif-orange hover:bg-fif-orange-hover text-fif-navy text-[2rem] shadow-md active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-navy"
      >
        {textoBoton}
      </button>
    </form>
  );
}
