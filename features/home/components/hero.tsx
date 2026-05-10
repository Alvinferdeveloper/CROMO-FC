import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, PlusCircle } from 'lucide-react'
import { VisualCardDeck } from '@/features/cards/components/visual-card-deck'

const HERO_BG_URL = '/illustrations/bg_illustration.png'

export function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-fixed pt-20 pb-36 px-6"
      style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/80 to-emerald-950/90 z-2" />

      <div className="relative z-10 max-w-5xl w-full mx-auto mt-8 text-center flex flex-col items-center gap-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
          Mundial 2026 · Comunidad Oficial
        </div>

        <div className="space-y-6">
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.9] tracking-tighter text-white drop-shadow-2xl m-0 italic">
            COMPLETA TU <br />
            <span className="bg-linear-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              COLECCIÓN.
            </span>
          </h1>
          <p className="text-[clamp(1.1rem,2.5vw,1.3rem)] text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed m-0 px-4">
            La plataforma de intercambio más grande para el Mundial 2026.
            Encuentra coleccionistas cerca de ti y cambia tus repetidas en segundos.
          </p>
        </div>

        <div className="w-full scale-90 md:scale-100">
          <VisualCardDeck />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-6">
          <Button asChild size="lg" className="flex-1 h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
            <Link href="/explore">
              <Search className="mr-2 h-5 w-5" />
              Explorar Cromos
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 h-14 rounded-2xl text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
            <Link href="/upload-card">
              <PlusCircle className="mr-2 h-5 w-5" />
              Subir el mío
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
