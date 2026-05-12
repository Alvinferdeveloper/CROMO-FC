'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MyCardItem } from './my-card-item'
import { getMyCards } from '../actions/my-cards-actions'
import { Loader2 } from 'lucide-react'
import { Card } from '@/types/card'

interface MyCardsInfiniteFeedProps {
  initialCards: Card[]
}

export function MyCardsInfiniteFeed({ initialCards }: MyCardsInfiniteFeedProps) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialCards.length >= 12)
  const [isLoading, setIsLoading] = useState(false)
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px'
  })

  // This handles real-time updates when initialCards prop changes from parent revalidation
  useEffect(() => {
    // If the first page of cards has changed, reset the feed
    // We compare IDs or count to avoid unnecessary resets if possible
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
        pageSize: 12
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: (index % 12) * 0.05,
                ease: [0.23, 1, 0.32, 1] 
              }}
            >
              <MyCardItem card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sentinel for Infinite Scroll */}
      <div ref={ref} className="w-full flex justify-center py-10">
        {hasMore ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sincronizando colección...</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="text-center py-6 opacity-30">
            <p className="text-[11px] font-black uppercase tracking-widest italic">Toda tu colección está al día</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
