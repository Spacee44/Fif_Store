import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Navegación */}
      <nav className="flex items-center justify-between p-6 max-w-7-xl mx-auto border-b border-slate-800">
        <div className="text-xl font-bold tracking-wider text-indigo-400">MI_PRODUCTO</div>
        <div className="space-x-6 hidden md:block text-sm text-slate-300">
          <a href="#caracteristicas" className="hover:text-white transition">Características</a>
          <a href="#precios" className="hover:text-white transition">Precios</a>
          <a href="#contacto" className="hover:text-white transition">Contacto</a>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          Empezar Gratis
        </button>
      </nav>

      {/* Sección Hero (Principal) */}
      <header className="max-w-4xl mx-auto text-center px-6 py-20 md:py-32">
        <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-900/50">
          Nueva Versión 2.0
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 leading-tight">
          La forma más inteligente de <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">gestionar tus proyectos</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Optimiza tus flujos de trabajo, automatiza las tareas repetitivas y mantén a tu equipo sincronizado en un solo lugar.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition">
            Comenzar prueba de 14 días
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-medium border border-slate-700 transition">
            Ver demostración
          </button>
        </div>
      </header>

      {/* Sección de Características Breves */}
      <section id="caracteristicas" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/60">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-indigo-600/10 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-lg mb-4">⚡</div>
            <h3 className="text-lg font-semibold">Velocidad Máxima</h3>
            <p className="mt-2 text-slate-400 text-sm">Carga instantánea optimizada nativamente con Next.js y renderizado estático.</p>
          </div>
          <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-purple-600/10 text-purple-400 rounded-lg flex items-center justify-center font-bold text-lg mb-4">🔒</div>
            <h3 className="text-lg font-semibold">Seguridad Total</h3>
            <p className="mt-2 text-slate-400 text-sm">Tus datos encriptados de extremo a extremo con los estándares más altos.</p>
          </div>
          <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 bg-pink-600/10 text-pink-400 rounded-lg flex items-center justify-center font-bold text-lg mb-4">📊</div>
            <h3 className="text-lg font-semibold">Métricas en Tiempo Real</h3>
            <p className="mt-2 text-slate-400 text-sm">Visualiza el rendimiento de tus campañas mediante un panel intuitivo.</p>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="text-center py-8 text-xs text-slate-500 border-t border-slate-800/60 mt-12">
        &copy; {new Date().getFullYear()} MiProducto Inc. Todos los derechos reservados.
      </footer>
    </div>
  );
}
