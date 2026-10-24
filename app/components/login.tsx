'use client';


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      
      <div className="w-full max-w-md h-screen sm:h-[850px] sm:max-h-screen bg-[#1b364c] sm:rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col sm:my-8">
        
        <div className="flex flex-col items-center pt-16 pb-8 px-6">
          <div className="bg-white w-[240px] h-[240px] rounded-[36px] shadow-lg flex items-center justify-center mb-6 p-2 overflow-hidden">
            <img 
              src="/images/7-removebg-preview.png"
              alt="FIF Store Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-gray-400 text-sm">Logo</div>
          </div>

          <h2 className="text-white text-center text-[1.1rem] leading-snug font-medium max-w-[250px] tracking-wide">
            Compra y venta entre compañeros de la FIF
          </h2>
        </div>

        <div className="bg-white w-full flex-grow rounded-t-[40px] pt-10 pb-8 px-8 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          
          <h1 className="text-[#2d4059] text-[1.75rem] font-semibold mb-8">
            Iniciar sesión
          </h1>

          <form className="flex flex-col flex-grow" onSubmit={(e) => e.preventDefault()}>
            
            <div className="mb-5">
              <label className="block text-gray-700 text-sm mb-2 ml-2">
                correo institucional
              </label>
              <input 
                type="email" 
                placeholder="correo@uaq.edu.mx"
                className="w-full bg-[#e8ecef] text-gray-800 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#f6a847] transition-all placeholder-gray-400 font-medium"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm mb-2 ml-2">
                contraseña
              </label>
              <input 
                type="password" 
                placeholder="***************"
                className="w-full bg-[#e8ecef] text-gray-800 rounded-full px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#f6a847] transition-all placeholder-gray-400 font-medium tracking-widest"
              />
            </div>

            <div className="mt-auto mb-6 flex justify-center">
              <button 
                type="submit"
                className="w-4/5 max-w-[250px] bg-[#fbb040] hover:bg-[#f5a123] text-[#2d4059] font-bold text-lg rounded-full py-3.5 shadow-md transition-colors active:scale-95"
              >
                Entrar
              </button>
            </div>


            <div className="text-center mt-2">
              <p className="text-gray-500 text-sm">
                ¿Aun no tienes cuenta?{' '}
                <a href="#" className="text-[#2d4059] font-semibold hover:underline">
                  Regístrate
                </a>
              </p>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}