export function HowItWorks() {
  return (
    <section className="relative bg-emerald-950 py-24 overflow-hidden text-white">
      {/* Shine of background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative container mx-auto px-6 z-10">

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-5">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Completa tu álbum en <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-emerald-500">3 pasos</span>
          </h2>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            La forma más rápida, segura y moderna de intercambiar tus repetidas.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Step 1: Upload (Animation of scanning cromo) */}
          <div className="relative bg-white/3 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] overflow-hidden hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
            {/* Giant number in background */}
            <span className="absolute -top-6 right-2 text-[150px] font-black text-white/2 group-hover:text-emerald-500/ transition-colors duration-500 select-none">1</span>

            {/* Visual representation of a cromo */}
            <div className="relative w-16 h-16 mb-8 mt-2">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-500 border border-emerald-500/30"></div>
              <div className="absolute inset-0 bg-emerald-900 border-2 border-emerald-400 rounded-xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                {/* Scanning line animation */}
                <div className="w-full h-[2px] bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)] animate-[bounce_2s_infinite]"></div>
              </div>
            </div>

            <h3 className="relative text-xl font-bold mb-3 z-10">Sube tu cromo</h3>
            <p className="relative text-emerald-100/60 text-sm leading-relaxed z-10">
              Registra tus repetidas en tu inventario digital. Solo toma un par de clics.
            </p>
          </div>

          {/* Step 2: Find (Animation of cromo as a radar) */}
          <div className="relative bg-white/2 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] overflow-hidden hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
            <span className="absolute -top-6 right-2 text-[150px] font-black text-white/2 group-hover:text-emerald-500/ transition-colors duration-500 select-none">2</span>

            {/* Visual representation */}
            <div className="relative w-16 h-16 mb-8 mt-2 flex items-center justify-center">
              {/* Radar circles */}
              <div className="absolute inset-0 border border-emerald-500/30 rounded-full scale-110 group-hover:animate-ping opacity-50"></div>
              <div className="absolute inset-2 border border-emerald-500/50 rounded-full scale-110"></div>
              {/* Cromo in the center */}
              <div className="relative w-8 h-10 bg-emerald-900 border-2 border-emerald-400 rounded-md z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>

            <h3 className="relative text-xl font-bold mb-3 z-10">Encuentra tu match</h3>
            <p className="relative text-emerald-100/60 text-sm leading-relaxed z-10">
              El algoritmo detecta coleccionistas cerca de ti que necesitan lo que tú tienes.
            </p>
          </div>

          {/* Step 3: Trade (Two cards crossing) */}
          <div className="relative bg-white/3 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] overflow-hidden hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-500 group">
            <span className="absolute -top-6 right-2 text-[150px] font-black text-white/2 group-hover:text-emerald-500/ transition-colors duration-500 select-none">3</span>

            {/* Visual representation */}
            <div className="relative w-16 h-16 mb-8 mt-2 flex items-center justify-center">
              {/* Cromo 1 */}
              <div className="absolute w-10 h-12 bg-emerald-900 border border-emerald-500/50 rounded-md transform -translate-x-3 -rotate-12 group-hover:-translate-x-4 transition-all duration-500"></div>
              {/* Cromo 2 (Gold/Special for contrast) */}
              <div className="absolute w-10 h-12 bg-emerald-950 border-2 border-emerald-300 rounded-md transform translate-x-3 rotate-12 group-hover:translate-x-4 transition-all duration-500 z-10 shadow-lg"></div>
              {/* Exchange arrow in the center */}
              <div className="absolute z-20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>

            <h3 className="relative text-xl font-bold mb-3 z-10">Haz el intercambio</h3>
            <p className="relative text-emerald-100/60 text-sm leading-relaxed z-10">
              Coordina el encuentro por chat y completa tu página faltante.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}