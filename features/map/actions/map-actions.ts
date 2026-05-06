'use server'

import { createClient } from '@/lib/supabase-server'

export async function getCardsForMap() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('card_posts')
    .select('id, player_name, image_url, location_lat, location_lng, team_name, is_available')
    .eq('is_available', true)
    .not('location_lat', 'is', null)

  if (error) return { error: error.message }

  // Add slight jitter for privacy
  const jitteredData = data?.map(card => ({
    ...card,
    location_lat: card.location_lat + (Math.random() - 0.5) * 0.01,
    location_lng: card.location_lng + (Math.random() - 0.5) * 0.01
  }))

  return { data: jitteredData }
}
