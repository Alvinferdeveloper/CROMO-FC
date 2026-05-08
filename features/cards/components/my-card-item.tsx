'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, CheckCircle2, RefreshCcw } from 'lucide-react'
import { toggleCardAvailability, deleteCardPost } from '../actions/card-actions'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface MyCardItemProps {
  card: any
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
      "relative group overflow-hidden rounded-2xl border bg-card transition-all",
      !card.is_available && "opacity-60 grayscale-[0.5]"
    )}>
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {card.image_url && (
          <Image
            src={card.image_url}
            alt={card.player_name}
            fill
            className="object-cover"
          />
        )}
        {!card.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-black font-black px-4 py-2 rounded-full text-sm uppercase tracking-tighter transform -rotate-12 shadow-2xl">
              Intercambiado
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold truncate">{card.player_name}</h3>
          <p className="text-xs text-muted-foreground">{card.team_name} • {card.card_number || 'S/N'}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={card.is_available ? "outline" : "default"}
            size="sm"
            className="flex-1 rounded-xl h-10"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {card.is_available ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Finalizar</>
            ) : (
              <><RefreshCcw className="mr-2 h-4 w-4" /> Reactivar</>
            )}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="rounded-xl h-10 w-10 shrink-0"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
