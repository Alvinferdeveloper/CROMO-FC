'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Search, PlusCircle } from 'lucide-react'
import { VisualCardDeck } from '@/features/cards/components/visual-card-deck'
import { UploadCardModal } from '@/features/cards/components/upload-card-modal'

const HERO_BG_URL = '/illustrations/bg_illustration.jpg'

interface HeroProps {
  isAuthenticated: boolean
}

export function Hero({ isAuthenticated }: HeroProps) {
  const router = useRouter()

  const handleUploadClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push('/login')
    }
  }

  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-fixed pt-20 pb-36 px-6"
      style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
    >
      {/* Dark overlay to ensure contrast and an epic feel */}
      <div className="absolute inset-0 bg-linear-to-br from-black/95 via-black/80 to-emerald-950/90 z-2" />

      <div className="relative z-10 max-w-5xl w-full mx-auto mt-8 text-center flex flex-col items-center gap-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
          Mundial 2026 · Comunidad Oficial
        </div>

        <div className="space-y-6">
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white drop-shadow-2xl m-0">
            COMPLETA TU <br />
            {/* Removed gradient text, used solid primary color per impeccable rules */}
            <span className="text-emerald-400">
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
          <Button
            asChild
            size="lg"
            className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 active:scale-[0.97] transition-transform duration-200"
            style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            <Link href="/explore">
              <Search className="mr-2 h-5 w-5" />
              Explorar Cromos
            </Link>
          </Button>

          {isAuthenticated ? (
            <UploadCardModal
              trigger={
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14 rounded-2xl cursor-pointer text-lg font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm active:scale-[0.97] transition-[transform,background-color] duration-200"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Subir el mío
                </Button>
              }
            />
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-lg font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm active:scale-[0.97] transition-[transform,background-color] duration-200"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              onClick={handleUploadClick}
            >
              <Link href="/login">
                <PlusCircle className="mr-2 h-5 w-5" />
                Subir el mío
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
