'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle2, RefreshCcw } from 'lucide-react'
import { toggleCardAvailability, deleteCardPost } from '../actions/card-actions'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { EditCardModal } from './edit-card-modal'
import { Card } from '@/types/card'

interface MyCardItemProps {
  card: Card
}

export function MyCardItem({ card }: MyCardItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    await toggleCardAvailability(card.id, card.is_available)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres borrar este cromo?')) {
      setIsLoading(true)
      await deleteCardPost(card.id)
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      "group relative flex flex-col bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1",
      !card.is_available && "opacity-75"
    )}>
      {/* Image Container */}
      <div className="relative aspect-3/4 overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {card.image_url ? (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              !card.is_available && "grayscale-[0.5] blur-[1px]"
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800">
            <span className="text-4xl opacity-20">🃏</span>
          </div>
        )}

        {!card.is_available && (
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-900 dark:text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-2xl border border-white/20">
              Cromo Intercambiado
            </div>
          </div>
        )}

        {/* Floating ID badge */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-100 dark:border-zinc-800 px-2 py-1 rounded-lg text-[10px] font-black text-slate-500 dark:text-zinc-400">
          #{card.card_number || 'S/N'}
        </div>
      </div>

      {/* Info & Actions */}
      <div className="p-4 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white truncate leading-tight">
            {card.player_name}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1 truncate">
            {card.team_name}
          </p>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            variant={card.is_available ? "outline" : "default"}
            size="sm"
            className={cn(
              "w-full h-10 rounded-xl font-bold text-xs gap-2 cursor-pointer transition-all active:scale-95",
              card.is_available
                ? "border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                : "bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20"
            )}
            onClick={handleToggle}
            disabled={isLoading}
          >
            {card.is_available ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Marcar listo</>
            ) : (
              <><RefreshCcw className="h-3.5 w-3.5" /> Reactivar</>
            )}
          </Button>

          <div className="flex gap-2">
            <div className="flex-1">
              <EditCardModal card={card} />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer transition-all active:scale-90"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
