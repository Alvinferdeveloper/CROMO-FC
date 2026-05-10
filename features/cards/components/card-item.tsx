import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowLeftRight, User } from 'lucide-react'

interface CardItemProps {
  card: {
    id: string
    player_name: string
    card_number: string | null
    team_name: string
    image_url: string | null
    desired_trade: string | null
    country: string | null
    location_city: string | null
    profiles?: { full_name: string | null } | null
  }
}

export function CardItem({ card }: CardItemProps) {
  const username = card.profiles?.full_name?.split(' ')[0] || 'Usuario'
  const location = card.location_city
    ? `${card.location_city}${card.country ? `, ${card.country}` : ''}`
    : null

  return (
    <Link href={`/cards/${card.id}`} className="block group h-full">
      <div
        className="relative h-full flex flex-col bg-card rounded-3xl transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.15)] ring-1 ring-border group-hover:ring-primary/20 overflow-hidden"
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {/* Image Container - More dramatic aspect ratio */}
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

          {/* Premium Bottom Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* Number badge (Floating Pill) */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              #{card.card_number || 'S/N'}
            </span>
          </div>

          {/* Location pill above image */}
          {location && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white/90 w-fit max-w-full">
              <MapPin className="h-3 w-3 shrink-0 text-emerald-400" />
              <span className="text-[10px] font-semibold truncate">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Info Container - Cleaned up borders */}
        <div className="flex flex-col flex-1 p-4 gap-3 bg-card">

          {/* Player and Team */}
          <div>
            <h3 className="font-bold text-base leading-tight text-foreground truncate mb-1 transition-colors group-hover:text-primary">
              {card.player_name}
            </h3>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest truncate">
              {card.team_name}
            </p>
          </div>

          {/* Trade Desired */}
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

          {/* User Footer - Removed hard borders */}
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