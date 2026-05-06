import Image from 'next/image'
import { MapPin, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardItemProps {
  card: {
    id: string
    player_name: string
    card_number: string | null
    team_name: string
    image_url: string | null
    desired_trade: string | null
    profiles?: {
      full_name: string | null
      location_city: string | null
    } | null
  }
}

export function CardItem({ card }: CardItemProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin foto
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
          {card.card_number || 'S/N'}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg leading-tight truncate">{card.player_name}</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {card.team_name}
          </p>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-start gap-2 text-sm">
            <Repeat className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-zinc-600 line-clamp-2 leading-snug italic">
              &quot;{card.desired_trade || 'Busco cambios generales'}&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{card.profiles?.location_city || 'Ubicación oculta'}</span>
          </div>
          <p className="text-[10px] font-semibold text-zinc-400">
            @{card.profiles?.full_name?.split(' ')[0].toLowerCase() || 'coleccionista'}
          </p>
        </div>
      </div>
    </div>
  )
}
