import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Search, ArrowRight, Users, Flame } from 'lucide-react'
import { CardItem } from '@/features/cards/components/card-item'
import { Card } from '@/types/card'

interface TeaserSectionProps {
  cards: Card[]
  userCity?: string | null
}

export function TeaserSection({ cards, userCity }: TeaserSectionProps) {
  return (
    <section className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-8 -mt-16 mb-32">
      <div className="flex flex-col gap-12">
        
        {/* Bold Asymmetric Callout Header */}
        <div className="relative overflow-hidden bg-card rounded-[2rem] shadow-xl border border-border group">
          {/* Subtle animated background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-50 group-hover:opacity-70 transition-opacity duration-1000 -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row">
            
            {/* Left Content Area (70%) */}
            <div className="flex-1 p-8 md:p-12 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {userCity ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                    <MapPin className="h-3 w-3" /> Zona activa: {userCity}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                    <Search className="h-3 w-3" /> Tendencias globales
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-foreground text-[11px] font-bold uppercase tracking-wider border border-border">
                  <Flame className="h-3 w-3 text-orange-500" />
                  {cards?.length || 0} publicaciones recientes
                </span>
              </div>

              <div className="space-y-3 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {userCity ? 'El mercado en tu ciudad está activo.' : 'Explora el mercado mundial.'}
                </h2>
                <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
                  Encuentra coleccionistas que buscan completar su álbum. La forma más rápida, segura y moderna de conseguir tus faltantes.
                </p>
              </div>
            </div>

            {/* Right Call-to-Action Area (30%) - Split Design */}
            <div className="w-full md:w-80 bg-accent/30 border-t md:border-t-0 md:border-l border-border p-8 flex flex-col justify-center gap-6">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Users className="h-3 w-3" /> Comunidad 2026
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] relative z-10 hover:z-20 transition-transform hover:scale-110">👤</div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground leading-none">+12k</span>
                    <span className="text-[10px] text-muted-foreground font-medium">coleccionistas</span>
                  </div>
                </div>
              </div>
              
              <Button 
                asChild 
                className="w-full rounded-2xl h-14 font-semibold text-base shadow-lg shadow-primary/20 active:scale-[0.97] transition-transform duration-200"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <Link href="/explore">
                  Ver todo el mercado <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
          </div>
        </div>

        {/* Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-foreground tracking-tight">Agregados recientemente</h3>
          </div>
          
          {cards && cards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {cards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center bg-accent/30 rounded-[2rem] border border-border">
              <p className="text-muted-foreground font-medium">No hay cromos subidos aún cerca de ti.</p>
            </div>
          )}
        </div>
        
      </div>
    </section>
  )
}
