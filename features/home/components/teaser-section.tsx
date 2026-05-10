import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Search, ArrowRight } from 'lucide-react'
import { CardItem } from '@/features/cards/components/card-item'

interface TeaserSectionProps {
  cards: any[]
  userCity?: string | null
}

export function TeaserSection({ cards, userCity }: TeaserSectionProps) {
  return (
    <main className="relative z-20 container mx-auto px-4 sm:px-6 -mt-16 mb-24">
      <div className="flex flex-col gap-10">
        {/* Enhanced Section Header */}
        <div className="relative overflow-hidden bg-white dark:bg-zinc-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-slate-100 dark:border-zinc-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap gap-2">
                {userCity ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    <MapPin className="mr-1 h-3 w-3" /> Zona Activa: {userCity}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    <Search className="mr-1 h-3 w-3" /> Tendencias Globales
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  {cards?.length || 0} publicaciones recientes
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                  {userCity ? 'Intercambios cerca de ti' : 'Explora el mercado mundial'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg leading-relaxed">
                  Encuentra coleccionistas activos que buscan completar su álbum. La forma más rápida de conseguir tus faltantes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-10">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Comunidad 2026</p>
                <div className="flex -space-x-3 mb-2 justify-center sm:justify-start">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-[10px]">👤</div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">+99</div>
                </div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 italic">&quot;Completé mi álbum ayer, ¡gracias!&quot;</p>
              </div>
              <Button asChild className="w-full bg-emerald-500 dark:bg-emerald-600 text-emerald-100 dark:text-emerald-300 sm:w-auto rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20">
                <Link href="/explore">
                  Ver todo el mercado <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {cards && cards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 px-2">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white/50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-zinc-800">
            <p className="text-slate-400 font-bold">No hay cromos subidos aún cerca de ti.</p>
          </div>
        )}

        <div className="sm:hidden flex justify-center pt-4">
          <Button variant="link" asChild className="font-bold text-lg">
            <Link href="/explore">Ver todo el mercado <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
