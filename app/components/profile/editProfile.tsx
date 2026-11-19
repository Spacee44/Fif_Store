'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Usuario } from '../../lib/data';
import { actualizarUsuarioActual, useHidratado, useUsuarioActual } from '../../lib/store';
import Avatar from '../ui/avatar';
import PhoneShell from '../ui/phoneShell';
import TopBar from '../ui/topBar';

export default function EditProfile() {
  const usuario = useUsuarioActual();
  const hidratado = useHidratado();

  return (
    <PhoneShell>
      <TopBar titulo="Editar perfil" fallbackHref="/perfil" />
      <main className="flex-grow overflow-y-auto">
        {hidratado ? (
          <Formulario usuario={usuario} />
        ) : (
          <p className="text-center text-fif-muted text-xl mt-24">Cargando…</p>
        )}
      </main>
    </PhoneShell>
  );
}

function Formulario({ usuario }: { usuario: Usuario }) {
  const router = useRouter();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [carrera, setCarrera] = useState(usuario.carrera);
  const [telefono, setTelefono] = useState(usuario.telefono);

  const campo =
    'w-full h-[53px] bg-fif-input rounded-full px-5 text-fif-navy text-xl focus:outline-none focus:ring-2 focus:ring-fif-orange';
  const etiqueta = 'block text-fif-navy text-xl mb-2 ml-3';

  return (
    <form
      className="px-6 pt-14 pb-10 flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        actualizarUsuarioActual({
          nombre: nombre.trim() || usuario.nombre,
          carrera: carrera.trim(),
          telefono: telefono.replace(/\D/g, ''),
        });
        router.replace('/perfil');
      }}
    >
      <Avatar
        nombre={nombre || usuario.nombre}
        className="self-center w-[162px] h-[152px] text-[4rem]"
      />

      <label htmlFor="ep-nombre" className={`${etiqueta} mt-14`}>
        Nombre
      </label>
      <input
        id="ep-nombre"
        type="text"
        required
        autoComplete="name"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={campo}
      />

      <label htmlFor="ep-carrera" className={`${etiqueta} mt-7`}>
        Carrera
      </label>
      <input
        id="ep-carrera"
        type="text"
        value={carrera}
        onChange={(e) => setCarrera(e.target.value)}
        className={campo}
      />

      <label htmlFor="ep-tel" className={`${etiqueta} mt-7`}>
        Teléfono
      </label>
      <input
        id="ep-tel"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        pattern="[0-9 ]{10,14}"
        title="10 dígitos"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className={campo}
      />

      <button
        type="submit"
        className="mt-20 mx-3 h-[66px] rounded-[20px] bg-fif-orange hover:bg-fif-orange-hover text-fif-navy text-2xl shadow-md active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-fif-navy"
      >
        Guardar Cambios
      </button>
    </form>
  );
}
