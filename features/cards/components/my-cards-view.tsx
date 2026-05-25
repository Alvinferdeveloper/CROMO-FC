'use client'

import { useState } from 'react'
import { UploadCardModal } from './upload-card-modal'
import { Button } from '@/components/ui/button'
import { PlusCircle, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MyCardsInfiniteFeed } from './my-cards-infinite-feed'
import { WishlistManager } from '@/features/wishlist/components/wishlist-manager'
import { Card } from '@/types/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MyCardsViewProps {
  initialCards: Card[]
  userCity?: string | null
}

export function MyCardsView({ initialCards: serverCards, userCity }: MyCardsViewProps) {
  const [cards, setCards] = useState<Card[]>(serverCards)
  const today = (format as any)(new Date(), "EEEE, dd MMMM yyyy", { locale: es })

  // When a new card is uploaded, we prepend it to the local list
  const handleNewCard = (newCard: Card) => {
    setCards(prev => [newCard, ...prev])
  }

  // Handle deletion/toggle from children
  const handleCardDelete = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const handleCardUpdate = (updatedCard: Card) => {
    setCards(prev => prev.map(card => card.id === updatedCard.id ? updatedCard : card))
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Header Section */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] mb-1">
                Gestión de Inventario
              </p>
              <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Mis Cromos
              </h1>
              <p className="text-zinc-500 text-sm mt-1 capitalize">{today}</p>
            </div>

            <div className="flex items-center gap-4 mt-2 md:mt-12">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{cards.length} cromos activos</span>
              </div>
              <UploadCardModal
                onSuccess={handleNewCard}
                trigger={
                  <Button className="h-11 px-6 rounded-full cursor-pointer font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Subir Cromo
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Feed Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="inventory" className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl h-14 w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <TabsTrigger
                value="inventory"
                className="flex-1 rounded-xl font-black cursor-pointer uppercase tracking-widest text-[10px] data-[state=active]:bg-primary/80 data-[state=active]:shadow-xl data-[state=active]:text-white transition-all"
              >
                Mi Inventario
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className="flex-1 rounded-xl font-black cursor-pointer uppercase tracking-widest text-[10px] data-[state=active]:bg-primary/80 data-[state=active]:shadow-xl data-[state=active]:text-white transition-all"
              >
                Mazo de Deseos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inventory" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            {cards && cards.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                <MyCardsInfiniteFeed
                  initialCards={cards}
                  onCardUpdate={handleCardUpdate}
                  onCardDelete={handleCardDelete}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-white dark:bg-zinc-900/20 shadow-inner">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <PlusCircle className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white uppercase italic">Empieza tu colección</h3>
                <p className="text-zinc-500 max-w-sm mt-2 mb-8 font-medium">
                  No tienes cromos activos en este momento. Sube tu primer cromo para empezar a intercambiar con otros coleccionistas.
                </p>
                <UploadCardModal
                  onSuccess={handleNewCard}
                  trigger={
                    <Button size="lg" className="h-12 px-10 rounded-2xl cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-xs">
                      Publicar mi primer cromo
                    </Button>
                  }
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="outline-none">
            <WishlistManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
