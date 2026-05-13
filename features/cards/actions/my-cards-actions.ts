'use server'

import { createClient } from '@/lib/supabase-server'
import { Card } from '@/types/card'

/**
 * Fetches user's cards with pagination.
 */
export async function getMyCards({
  page = 0,
  pageSize = 12,
  isAvailable
}: {
  page?: number
  pageSize?: number
  isAvailable?: boolean
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No autorizado')

  const offset = page * pageSize

  let query = supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (isAvailable !== undefined) {
    query = query.eq('is_available', isAvailable)
  }

  const { data, error } = await query.range(offset, offset + pageSize - 1)

  if (error) throw new Error(error.message)

  return (data as Card[]) || []
}
