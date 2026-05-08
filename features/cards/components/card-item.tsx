import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Repeat2 } from 'lucide-react'

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
  const username = card.profiles?.full_name?.split(' ')[0].toLowerCase() || 'user'
  const location = card.location_city
    ? `${card.location_city}${card.country ? `, ${card.country}` : ''}`
    : null

  return (
    <Link href={`/cards/${card.id}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/8 hover:-translate-y-0.5 hover:border-primary/25">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.player_name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground/40">
              <span className="text-3xl">🃏</span>
              <span className="text-xs font-medium">Sin foto</span>
            </div>
          )}

          {/* Gradient overlay bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/60 to-transparent" />

          {/* Card number badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white/90 tracking-wider">
            #{card.card_number || 'S/N'}
          </div>

          {/* Location bottom-left over image */}
          {location && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-white/80 font-medium">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate max-w-[110px]">{location}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-3 py-2.5 space-y-1.5">
          <div>
            <h3 className="font-bold text-sm leading-tight truncate">{card.player_name}</h3>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide truncate">
              {card.team_name}
            </p>
          </div>

          {card.desired_trade && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground border-t border-border/50 pt-1.5">
              <Repeat2 className="h-3 w-3 text-primary shrink-0" />
              <span className="truncate italic">{card.desired_trade}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end pt-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground/60">@{username}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
