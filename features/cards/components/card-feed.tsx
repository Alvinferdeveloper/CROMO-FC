'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPaginatedCards } from '../actions/get-cards'
import { CardItem } from './card-item'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface CardFeedProps {
  initialCards: any[]
  search?: string
  lat?: number
  lng?: number
  userCity?: string
}

export function CardFeed({ initialCards, search, lat, lng, userCity }: CardFeedProps) {
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cards', search, lat, lng, userCity],
    queryFn: ({ pageParam = 0 }) => getPaginatedCards({ 
      page: pageParam, 
      search,
      lat,
      lng,
      userCity
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If there's an error or no data, stop
      if (!lastPage || !lastPage.data || lastPage.data.length < 12) {
        return undefined
      }
      return allPages.length
    },
    // Use initialCards for the first page
    initialData: {
      pages: [{ data: initialCards }],
      pageParams: [0],
    },
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const allCards = data?.pages.flatMap((page) => page?.data || []) || []

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {allCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: (index % 12) * 0.05,
                ease: [0.21, 0.47, 0.32, 0.98]
              }}
            >
              <CardItem card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trigger Area */}
      <div 
        ref={ref} 
        className="flex justify-center py-12"
      >
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Buscando más cromos...</p>
          </div>
        ) : hasNextPage ? (
          <div className="h-1" />
        ) : (
          <p className="text-center text-muted-foreground font-medium italic">
            Has llegado al final. ¡No hay más cromos por ahora!
          </p>
        )}
      </div>
    </div>
  )
}
