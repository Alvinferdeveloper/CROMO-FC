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
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1.5 group-hover:border-primary/50">
        <div className="relative aspect-3/4 overflow-hidden bg-muted shrink-0">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.player_name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted to-background">
              <span className="text-5xl opacity-50 drop-shadow-sm">🃏</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sin foto</span>
            </div>
          )}

          {/* Use a bottom gradient to darken the map text and pin so they are perfectly legible. */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

          {/* Number badge (Premium Style) */}
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-card/95 backdrop-blur-md shadow-md border border-border">
            <span className="text-[11px] font-black text-foreground tracking-widest">
              #{card.card_number || 'S/N'}
            </span>
          </div>

          {/* Location above the image */}
          {location && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white/90">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="text-[11px] font-semibold truncate drop-shadow-md">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3.5 gap-3">

          {/* Player and Team */}
          <div>
            <h3 className="font-extrabold text-[15px] leading-none text-foreground truncate mb-1.5 transition-colors group-hover:text-primary">
              {card.player_name}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
              {card.team_name}
            </p>
          </div>

          {/* Trade Desired (Call to Action visual) */}
          <div className="mt-auto">
            {card.desired_trade ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                <ArrowLeftRight className="h-3.5 w-3.5 text-primary shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary/70 leading-none mb-0.5">
                    Busca a cambio
                  </span>
                  <span className="text-[11px] font-semibold text-primary/90 truncate">
                    {card.desired_trade}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-[38px] border border-dashed border-border rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground font-medium">Abierto a ofertas</span>
              </div>
            )}
          </div>

          {/* User Footer */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-border">
            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="w-2.5 h-2.5 text-muted-foreground" />
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