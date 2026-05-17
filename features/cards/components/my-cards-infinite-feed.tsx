'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MyCardItem } from './my-card-item'
import { MyCardSkeleton } from './my-card-skeleton'
import { getMyCards } from '../actions/my-cards-actions'
import { Loader2 } from 'lucide-react'
import { Card } from '@/types/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MyCardsInfiniteFeedProps {
  initialCards: Card[]
}

export function MyCardsInfiniteFeed({ initialCards }: MyCardsInfiniteFeedProps) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialCards.length >= 12)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'available' | 'traded'>('available')

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '400px' })

  const loadCards = useCallback(async (tab: 'available' | 'traded', reset = false) => {
    setIsLoading(true)
    if (reset) setCards([]) // Clear list immediately to show skeletons
    try {
      const nextPage = reset ? 1 : page
      const data = await getMyCards({
        page: reset ? 0 : page,
        pageSize: 12,
        isAvailable: tab === 'available'
      })

      setCards(reset ? data : prev => [...prev, ...data])
      setHasMore(data.length >= 12)
      setPage(reset ? 1 : page + 1)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  const handleTabChange = (value: string) => {
    const tab = value as 'available' | 'traded'
    setActiveTab(tab)
    loadCards(tab, true)
  }

  const handleCardDelete = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const handleCardToggle = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const handleCardUpdate = (updatedCard: Card) => {
    setCards(prev => prev.map(card => card.id === updatedCard.id ? updatedCard : card))
  }

  // Sync only if structure changes or initial load, to protect infinite scroll progress
  useEffect(() => {
    if (cards.length === 0 || initialCards.length === 0) {
      setCards(initialCards)
      setPage(1)
      setHasMore(initialCards.length >= 12)
    }
  }, [initialCards])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadCards(activeTab)
    }
  }, [inView, hasMore, isLoading, activeTab, loadCards])

  return (
    <div className="space-y-8">
      <Tabs defaultValue="available" onValueChange={handleTabChange} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-12 w-full sm:w-auto">
            <TabsTrigger value="available" className="rounded-lg px-6 text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              Disponibles
            </TabsTrigger>
            <TabsTrigger value="traded" className="rounded-lg px-6 text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
              Intercambiados
            </TabsTrigger>
          </TabsList>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2">
            {cards.length} Resultados encontrados
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-8 outline-none">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <MyCardItem
                    card={card}
                    onDelete={handleCardDelete}
                    onToggle={handleCardToggle}
                    onUpdate={handleCardUpdate}
                  />
                </motion.div>
              ))}
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <MyCardSkeleton key={`skel-${i}`} />
              ))}
            </AnimatePresence>
          </div>

          {!isLoading && cards.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-zinc-500 font-medium">No se encontraron cromos en esta categoría.</p>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <div ref={ref} className="h-20 flex items-center justify-center">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />}
      </div>
    </div>
  )
}