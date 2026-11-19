'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { actualizarUsuarioActual } from '../../lib/store';

export default function Register() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const campo =
    'w-full bg-fif-input text-gray-800 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-fif-orange transition-all placeholder-[#a9a9a9]';

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-screen bg-fif-navy sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col sm:my-8">
        <div className="flex flex-col items-center pt-10 pb-6 px-6 shrink-0">
          <div className="bg-white w-[180px] h-[180px] rounded-[36px] shadow-lg flex items-center justify-center mb-4 p-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/7-removebg-preview.png"
              alt="FIF Store Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-white text-center text-[1.1rem] leading-snug font-medium max-w-[250px] tracking-wide">
            Compra y venta entre compañeros de la FIF
          </h2>
        </div>

        <div className="bg-white w-full flex-grow rounded-t-[40px] pt-8 pb-6 px-8 flex flex-col overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <h1 className="text-fif-navy text-[1.75rem] font-semibold mb-6">
            Crear tu Cuenta
          </h1>

          <form
            className="flex flex-col flex-grow"
            onSubmit={(e) => {
              e.preventDefault();
              actualizarUsuarioActual({ nombre: nombre.trim(), correo: correo.trim() });
              router.push('/feed');
            }}
          >
            <div className="mb-4">
              <label htmlFor="reg-nombre" className="block text-fif-navy text-sm mb-2 ml-2">
                Nombre Completo
              </label>
              <input
                id="reg-nombre"
                type="text"
                required
                autoComplete="name"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre aqui"
                className={campo}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-correo" className="block text-fif-navy text-sm mb-2 ml-2">
                Correo institucional
              </label>
              <input
                id="reg-correo"
                type="email"
                required
                autoComplete="email"
                pattern=".+@uaq\.edu\.mx"
                title="Usa tu correo institucional @uaq.edu.mx"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@uaq.edu.mx"
                className={campo}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="reg-pass" className="block text-fif-navy text-sm mb-2 ml-2">
                Contraseña
              </label>
              <input
                id="reg-pass"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="***********"
                className={`${campo} tracking-widest`}
              />
            </div>

            <div className="mt-auto mb-4 flex justify-center">
              <button
                type="submit"
                className="w-4/5 max-w-[200px] bg-fif-orange hover:bg-fif-orange-hover text-fif-navy font-bold text-lg rounded-full py-3.5 shadow-md transition-colors active:scale-95"
              >
                Registrarte
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/" className="text-fif-navy font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
