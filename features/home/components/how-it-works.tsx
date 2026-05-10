export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative max-w-[1440px] w-full mx-auto px-6 sm:px-8 z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Completa tu álbum en <span className="text-primary">3 pasos.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            La forma más rápida, segura y moderna de intercambiar tus repetidas sin fricción. Diseñado para coleccionistas.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">

          {/* Step 1: Upload (Large Horizontal Box spanning 2 columns on large screens if we wanted, but let's make it span 2 columns on tablet, 1 on desktop, wait. Let's do a classic asymmetric bento) */}
          <div className="lg:col-span-2 relative bg-accent/30 rounded-[2rem] border border-border overflow-hidden p-10 flex flex-col md:flex-row items-center gap-10 group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />

            <div className="flex-1 space-y-4 relative z-10">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-foreground font-bold text-sm shadow-sm">1</span>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Sube tu cromo</h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                Registra tus repetidas en tu inventario digital. Escanéalos o búscalos y estarán visibles para toda la comunidad instantáneamente.
              </p>
            </div>

            {/* Visual: Abstract Scanner */}
            <div className="shrink-0 relative w-48 h-56 bg-card border border-border rounded-2xl shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500 flex flex-col overflow-hidden z-10" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}>
              <div className="h-1/2 bg-muted/40 w-full" />
              <div className="flex-1 p-4 space-y-3">
                <div className="w-3/4 h-2.5 bg-border rounded-full" />
                <div className="w-1/2 h-2.5 bg-border/50 rounded-full" />
              </div>
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)] animate-[scan_2.5s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Step 2: Find (Square box) */}
          <div className="relative bg-accent/30 rounded-[2rem] border border-border overflow-hidden p-10 flex flex-col group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />

            <div className="space-y-4 relative z-10 mb-10">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-foreground font-bold text-sm shadow-sm">2</span>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Encuentra tu match</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                El algoritmo detecta a otros coleccionistas que tienen exactamente lo que buscas.
              </p>
            </div>

            {/* Visual: Radar */}
            <div className="mt-auto relative h-32 flex items-center justify-center z-10">
              <div className="absolute w-24 h-24 border border-primary/20 rounded-full scale-100 group-hover:scale-[1.5] transition-transform duration-700 opacity-50" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
              <div className="absolute w-36 h-36 border border-primary/10 rounded-full scale-100 group-hover:scale-[1.2] transition-transform duration-700 opacity-30" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
              <div className="relative w-16 h-20 bg-card border border-primary/30 rounded-xl shadow-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Step 3: Trade (Large box spanning 2 columns or 3 columns depending on layout. Let's make it span all columns at the bottom) */}
          <div className="md:col-span-2 lg:col-span-3 relative bg-accent/30 rounded-[2rem] border border-border overflow-hidden p-10 flex flex-col md:flex-row items-center justify-between gap-10 group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />

            <div className="flex-1 space-y-4 relative z-10 max-w-xl">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-foreground font-bold text-sm shadow-sm">3</span>
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Haz el intercambio</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Abre el chat, coordina el lugar de encuentro y realiza el intercambio de manera segura. Cada cromo que consigas te acerca más a completar tu álbum.
              </p>
            </div>

            {/* Visual: Cards Swapping */}
            <div className="shrink-0 relative w-64 h-48 flex items-center justify-center z-10">
              <div className="absolute w-24 h-32 bg-card border border-border rounded-xl shadow-md transform -translate-x-8 -rotate-12 group-hover:-translate-x-12 transition-transform duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
              <div className="absolute w-24 h-32 bg-primary/10 border border-primary/30 rounded-xl shadow-xl transform translate-x-8 rotate-12 group-hover:translate-x-12 transition-transform duration-500 z-10" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
              <div className="absolute z-20 bg-background rounded-full p-2.5 shadow-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </section>
  );
}