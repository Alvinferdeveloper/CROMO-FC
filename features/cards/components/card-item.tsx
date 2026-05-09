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
      <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-emerald-500/10 group-hover:-translate-y-1.5 group-hover:border-emerald-400/50">
        <div className="relative aspect-3/4 overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0">
          {card.image_url ? (
            <Image
              src={card.image_url}
              alt={card.player_name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-200 to-slate-100 dark:from-zinc-800 dark:to-zinc-900">
              <span className="text-5xl opacity-50 drop-shadow-sm">🃏</span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Sin foto</span>
            </div>
          )}

          {/* Use a bottom gradient to darken the map text and pin so they are perfectly legible. */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

          {/* Number badge (Premium Style) */}
          <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md border border-black/5 dark:border-white/10">
            <span className="text-[11px] font-black text-slate-900 dark:text-white tracking-widest">
              #{card.card_number || 'S/N'}
            </span>
          </div>

          {/* Location above the image */}
          {location && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white/90">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
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
            <h3 className="font-extrabold text-[15px] leading-none text-slate-900 dark:text-white truncate mb-1.5 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              {card.player_name}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider truncate">
              {card.team_name}
            </p>
          </div>

          {/* Trade Desired (Call to Action visual) */}
          <div className="mt-auto">
            {card.desired_trade ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 leading-none mb-0.5">
                    Busca a cambio
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                    {card.desired_trade}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-[38px] border border-dashed border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Abierto a ofertas</span>
              </div>
            )}
          </div>

          {/* User Footer */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
              <User className="w-2.5 h-2.5 text-slate-500 dark:text-zinc-400" />
            </div>
            <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 truncate">
              {username}
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}