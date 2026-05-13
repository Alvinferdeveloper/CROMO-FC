'use client'

import { useEffect, useState } from 'react'
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
  const [activeTab, setActiveTab] = useState<string>('available')
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px'
  })

  const handleTabChange = async (value: string) => {
    setActiveTab(value)
    setIsLoading(true)
    setPage(1)
    
    try {
      const filteredCards = await getMyCards({
        page: 0,
        pageSize: 12,
        isAvailable: value === 'available'
      })
      
      setCards(filteredCards)
      setHasMore(filteredCards.length >= 12)
    } catch (error) {
      console.error('Error filtering cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCards(initialCards)
    setPage(1)
    setHasMore(initialCards.length >= 12)
  }, [initialCards])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMoreCards()
    }
  }, [inView, hasMore, isLoading])

  const loadMoreCards = async () => {
    setIsLoading(true)
    try {
      const nextCards = await getMyCards({
        page,
        pageSize: 12,
        isAvailable: activeTab === 'available'
      })

      if (nextCards.length < 12) {
        setHasMore(false)
      }

      setCards(prev => [...prev, ...nextCards])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading more cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <Tabs defaultValue="available" onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl h-12">
            <TabsTrigger 
              value="available" 
              className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm transition-all"
            >
              Disponibles
            </TabsTrigger>
            <TabsTrigger 
              value="traded" 
              className="rounded-xl px-6 font-bold text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:shadow-sm transition-all"
            >
              Intercambiados
            </TabsTrigger>
          </TabsList>
          
          <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {cards.length} {activeTab === 'available' ? 'Cromos Activos' : 'Intercambios logrados'}
          </p>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MyCardSkeleton />
                  </motion.div>
                ))
              ) : (
                cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    transition={{ 
                      duration: 0.25, 
                      delay: (index % 12) * 0.04,
                      ease: [0.23, 1, 0.32, 1] 
                    }}
                  >
                    <MyCardItem card={card} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {!isLoading && cards.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50 dark:bg-zinc-800/20 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-zinc-800">
              <span className="text-4xl mb-4 block">🏟️</span>
              <p className="text-slate-500 font-bold uppercase text-[11px] tracking-widest">
                {activeTab === 'available' 
                  ? 'No tienes cromos activos para intercambiar' 
                  : 'Aún no has marcado ningún cromo como intercambiado'
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div ref={ref} className="w-full flex justify-center py-10">
        {hasMore && !isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronizando...</p>
          </div>
        ) : cards.length > 0 && !isLoading ? (
          <div className="text-center py-6 opacity-30">
            <p className="text-[11px] font-black uppercase tracking-widest italic">Estás al día</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
