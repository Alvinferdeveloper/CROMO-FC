'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2, CheckCircle2, RefreshCcw, } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { toggleCardAvailability, deleteCardPost } from '../actions/card-actions'
import { EditCardModal } from './edit-card-modal'
import { Card } from '@/types/card'

interface MyCardItemProps {
  card: Card
  onDelete: (cardId: string) => void
  onToggle: (cardId: string) => void
}

export function MyCardItem({ card, onDelete, onToggle }: MyCardItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    const { success } = await toggleCardAvailability(card.id, card.is_available)
    if (success) {
      onToggle(card.id)
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const { success } = await deleteCardPost(card.id)
    if (success) {
      onDelete(card.id)
    }
    setIsLoading(false)
  }

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700">

      {/* Image Container */}
      <div className="relative aspect-4/5 bg-zinc-100 dark:bg-zinc-950">
        <Image
          src={card.image_url || '/placeholder.png'}
          alt={card.player_name}
          fill
          className={cn("object-cover transition-transform duration-500 group-hover:scale-105", !card.is_available && "grayscale opacity-60")}
        />

        {!card.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-bold text-zinc-900 uppercase rounded-full shadow-sm">
              Intercambiado
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md text-[10px] font-bold text-white rounded-md">
          #{card.card_number || '00'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">{card.player_name}</h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{card.team_name}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant={card.is_available ? "outline" : "default"}
            size="sm"
            className="w-full h-9 cursor-pointer rounded-lg text-xs font-bold"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {card.is_available ? <><CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Disponible</> : <><RefreshCcw className="w-3.5 h-3.5 mr-2" /> Reactivar</>}
          </Button>

          <div className="flex gap-2">
            <EditCardModal card={card}>
              <Button variant="ghost" size="sm" className="flex-1 cursor-pointer rounded-lg text-xs">Editar</Button>
            </EditCardModal>

            <ConfirmDialog
              title="¿Eliminar este cromo?"
              description="Esta acción no se puede deshacer. Se eliminará permanentemente de tu colección."
              confirmText="Eliminar"
              variant="destructive"
              onConfirm={handleDelete}
              trigger={
                <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}