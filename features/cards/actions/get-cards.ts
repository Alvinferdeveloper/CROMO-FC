'use server'

import { createClient } from '@/lib/supabase-server'

export async function getPaginatedCards({ 
  page = 0, 
  pageSize = 12,
  search,
  lat,
  lng,
  userCity
}: { 
  page?: number, 
  pageSize?: number,
  search?: string,
  lat?: number,
  lng?: number,
  userCity?: string
}) {
  const supabase = await createClient()
  
  const from = page * pageSize
  
  const { data, error } = await supabase.rpc('get_smart_cards_v2', {
    p_user_lat: lat,
    p_user_lng: lng,
    p_user_city: userCity,
    p_search: search,
    p_limit: pageSize,
    p_offset: from
  })

  if (error) {
    console.error('Error in RPC get_smart_cards_v2:', error)
    return { error: error.message }
  }

  // Map RPC result back to CardItem structure
  const formattedData = data?.map((item: any) => ({
    ...item,
    profiles: {
      full_name: item.profile_name
    }
  }))

  return { data: formattedData || [] }
}
