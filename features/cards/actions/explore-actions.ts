'use server'

import { createClient } from '@/lib/supabase-server'

export async function getExploreCards({
  search,
  country,
  city,
  team,
  lat,
  lng,
  page = 0,
  pageSize = 12
}: {
  search?: string
  country?: string
  city?: string
  team?: string
  lat?: number | null
  lng?: number | null
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const offset = page * pageSize

  const { data, error } = await supabase.rpc('get_advanced_market_cards', {
    p_search: search || null,
    p_country: country || null,
    p_city: city || null,
    p_team: team || null,
    p_user_lat: lat || null,
    p_user_lng: lng || null,
    p_limit: pageSize,
    p_offset: offset
  })

  if (error) throw new Error(error.message)

  // Map to the format expected by CardItem
  return data?.map((card: any) => ({
    ...card,
    profiles: {
      full_name: card.profile_name
    }
  })) || []
}
