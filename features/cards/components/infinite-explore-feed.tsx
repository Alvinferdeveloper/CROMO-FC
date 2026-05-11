'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CardItem } from './card-item'
import { getExploreCards } from '../actions/explore-actions'
import { Loader2 } from 'lucide-react'
import { Card } from '@/types/card'

interface InfiniteExploreFeedProps {
  initialCards: Card[]
  searchParams: any
  activeLat?: number | null
  activeLng?: number | null
}

export function InfiniteExploreFeed({ initialCards, searchParams, activeLat, activeLng }: InfiniteExploreFeedProps) {
  const [cards, setCards] = useState<Card[]>(initialCards)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialCards.length >= 12)
  const [isLoading, setIsLoading] = useState(false)
  
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px'
  })

  // Reset feed when search params change
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
      const nextCards = await getExploreCards({
        ...searchParams,
        rarity: searchParams.rarity,
        lat: activeLat,
        lng: activeLng,
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
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.28, 
                delay: (index % 12) * 0.04,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              <CardItem card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sentinel for Infinite Scroll */}
      <div ref={ref} className="w-full flex justify-center py-8">
        {hasMore ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" />
            <p className="text-xs font-medium text-muted-foreground/60">Cargando más cromos</p>
          </div>
        ) : cards.length > 0 ? (
          <div className="text-center py-6">
            <p className="text-xs font-medium text-muted-foreground/40">Has visto todos los cromos disponibles</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
