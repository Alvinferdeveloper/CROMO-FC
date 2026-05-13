'use server'

import { createClient } from '@/lib/supabase-server'

/**
 * Fetches all available cards for the map.
 * Uses card coordinates if available, otherwise falls back to profile coordinates.
 */
export async function getCardsForMap() {
  const supabase = await createClient()

  // Fetch cards and the owner's profile coordinates
  const { data, error } = await supabase
    .from('card_posts')
    .select(`
      id, 
      player_name, 
      image_url, 
      location_lat, 
      location_lng, 
      team_name, 
      is_available,
      profiles (
        location_lat,
        location_lng
      )
    `)
    .eq('is_available', true)

  if (error) return { error: error.message }

  // 1. Filter and Map logic
  const processedCards = data
    ?.map(card => {
      // Priority: 1. Card GPS, 2. Profile GPS
      const lat = card.location_lat ?? (card.profiles as any)?.location_lat
      const lng = card.location_lng ?? (card.profiles as any)?.location_lng

      if (lat === null || lng === null) return null

      return {
        ...card,
        lat,
        lng
      }
    })
    .filter(Boolean) as any[]

  // 2. Add dynamic jitter to avoid perfect stacking
  // If multiple cards are in the same spot, they will "bloom" around the area
  const jitteredData = processedCards.map((card, index) => {
    const angle = (index / processedCards.length) * Math.PI * 2
    const radius = 0.002 + Math.random() * 0.003

    return {
      ...card,
      location_lat: card.lat + Math.cos(angle) * radius,
      location_lng: card.lng + Math.sin(angle) * radius
    }
  })

  return { data: jitteredData }
}
