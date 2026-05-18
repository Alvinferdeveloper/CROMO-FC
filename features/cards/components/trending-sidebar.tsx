import { Button } from '@/components/ui/button'
import { Flame, Star, Trophy } from 'lucide-react'
import Image from 'next/image'

const TRENDING_CARDS = [
  { id: '1', name: 'Lionel Messi', team: 'Argentina', type: 'Normal', image: '/images/messi.jpg' },
  { id: '2', name: 'Cristiano Ronaldo', team: 'Portugal', type: 'Oro', image: '/images/cristiano.jpg' },
  { id: '3', name: 'Kylian Mbappé', team: 'Francia', type: 'Bronce', image: '/images/mbappe.jpg' },
  { id: '4', name: 'Lamine Yamal', team: 'España', type: 'Plata', image: '/images/lamine.jpg' },
]

export function TrendingSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-5 w-80 shrink-0">
      {/* Community Stats — compact inline, no dark block */}
      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <Flame className="h-3 w-3 text-primary" />
          En vivo
        </h3>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">1,248</p>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Coleccionistas activos</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">452</p>
            <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Intercambios hoy</p>
          </div>
        </div>
      </div>

      {/* Most Wanted Cards */}
      <div className="p-5 rounded-2xl border border-border bg-card">
        <h3 className="text-xs font-semibold text-muted-foreground mb-5 flex items-center gap-2">
          <Trophy className="h-3 w-3 text-amber-500" />
          Los más buscados
        </h3>

        <div className="space-y-3.5">
          {TRENDING_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-3.5 group cursor-pointer rounded-xl p-2 -mx-2 transition-[background-color] duration-200 hover:bg-accent/50"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            >
              <div className="relative h-14 w-11 shrink-0 rounded-lg overflow-hidden border border-border transition-transform duration-200 group-hover:scale-105"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <Image src={card.image} alt={card.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{card.name}</p>
                <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{card.team}</p>
                <p className="text-[10px] font-medium text-primary/70 mt-1">{card.type}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-5 rounded-xl text-xs font-medium h-9 hover:border-primary/30 hover:bg-primary/5 active:scale-[0.97] transition-[transform,border-color,background-color] duration-200"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          Ver ranking completo
        </Button>
      </div>

      {/* Tip */}
      <div className="p-4 rounded-xl bg-accent/50 border border-border">
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Activar tu ubicación aumenta las posibilidades de intercambio en un 80%.
        </p>
      </div>
    </aside>
  )
}
