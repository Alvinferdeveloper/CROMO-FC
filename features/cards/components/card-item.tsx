import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowLeftRight, User, Star } from 'lucide-react'
import { Card } from '@/types/card'

interface CardItemProps {
  card: Card
}

const RARITY_STYLES = {
  Normal: {
    border: 'ring-border group-hover:ring-primary/20',
    badge: 'bg-black/40',
    glow: '',
    text: 'text-white'
  },
  Bronce: {
    border: 'ring-amber-600/30 border-amber-600/20 shadow-[0_0_15px_rgba(180,83,9,0.1)]',
    badge: 'bg-amber-700/80',
    glow: 'after:absolute after:inset-0 after:bg-linear-to-tr after:from-amber-500/5 after:to-transparent',
    text: 'text-amber-100'
  },
  Plata: {
    border: 'ring-slate-400/30 border-slate-400/20 shadow-[0_0_15px_rgba(100,116,139,0.1)]',
    badge: 'bg-slate-500/80',
    glow: 'after:absolute after:inset-0 after:bg-linear-to-tr after:from-slate-300/10 after:to-transparent',
    text: 'text-slate-100'
  },
  Oro: {
    border: 'ring-yellow-500/40 border-yellow-500/30 shadow-[0_10px_30px_rgba(234,179,8,0.15)]',
    badge: 'bg-yellow-600/90',
    glow: 'after:absolute after:inset-0 after:bg-linear-to-tr after:from-yellow-400/20 after:via-transparent after:to-yellow-400/10 animate-pulse-slow',
    text: 'text-yellow-50'
  }
}

export function CardItem({ card }: CardItemProps) {
  const username = card.profiles?.full_name?.split(' ')[0] || 'Usuario'
  const location = card.location_city
    ? `${card.location_city}${card.country ? `, ${card.country}` : ''}`
    : null

  const style = RARITY_STYLES[card.rarity] || RARITY_STYLES.Normal

  return (
    <Link href={`/cards/${card.id}`} className="block group h-full">
      <div
        className={`relative h-full flex flex-col bg-card rounded-3xl transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.15)] ring-1 ${style.border} overflow-hidden ${style.glow}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {/* Image Container */}
        <div className="relative aspect-4/5 overflow-hidden bg-muted/30 shrink-0">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.player_name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-linear-to-b from-muted/50 to-background">
              <span className="text-4xl opacity-30 drop-shadow-sm">🃏</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sin foto</span>
            </div>
          )}

          {/* Rarity Badge (Top Left) */}
          {card.rarity && card.rarity !== 'Normal' && (
            <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg ${style.badge} backdrop-blur-md border border-white/20 z-10 flex items-center gap-1 shadow-lg`}>
              <Star className={`h-2.5 w-2.5 fill-current ${style.text}`} />
              <span className={`text-[9px] font-black uppercase tracking-tighter ${style.text}`}>
                {card.rarity}
              </span>
            </div>
          )}

          {/* Premium Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* Number badge */}
          <div className="absolute top-3 right-3 px-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              #{card.card_number || 'S/N'}
            </span>
          </div>

          {/* Location pill */}
          {location && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/90 w-fit max-w-full">
              <MapPin className="h-3 w-3 shrink-0 text-emerald-400" />
              <span className="text-[10px] font-semibold truncate">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="flex flex-col flex-1 p-4 gap-3 bg-card">
          <div>
            <h3 className="font-bold text-base leading-tight text-foreground truncate mb-1 transition-colors group-hover:text-primary">
              {card.player_name}
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest truncate">
              {card.team_name}
            </p>
          </div>

          <div className="mt-auto pt-2">
            {card.desired_trade ? (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="h-3 w-3 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
                    Busca a cambio
                  </span>
                  <span className="text-[12px] font-semibold text-foreground truncate">
                    {card.desired_trade}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-6 flex items-center">
                <span className="text-[11px] text-muted-foreground font-medium px-2 py-1 bg-muted/50 rounded-md">Abierto a ofertas</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-3 mt-1 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-border before:to-transparent">
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 border border-border">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              {username}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}