import { useState, useEffect, useMemo } from 'react'
import { getWishlist } from '../actions/wishlist-actions'
import { WishlistItem } from '../schemas/wishlist-schema'

/**
 * Hook to manage wishlist state and matching logic.
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await getWishlist()
      if (data) setItems(data)
      setIsLoading(false)
    }
    load()
  }, [])

  /**
   * Checks if a card matches an item in the wishlist using flexible matching.
   */
  const isNeeded = (playerName: string) => {
    const name = playerName.toLowerCase()
    return items.some(item => {
      const wanted = item.player_name.toLowerCase()
      return name.includes(wanted) || wanted.includes(name)
    })
  }

  return {
    items,
    isLoading,
    isNeeded,
    refresh: async () => {
      const { data } = await getWishlist()
      if (data) setItems(data)
    }
  }
}
