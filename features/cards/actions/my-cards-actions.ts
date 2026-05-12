'use server'

import { createClient } from '@/lib/supabase-server'
import { Card } from '@/types/card'

/**
 * Fetches user's cards with pagination.
 */
export async function getMyCards({
  page = 0,
  pageSize = 12
}: {
  page?: number
  pageSize?: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('No autorizado')

  const offset = page * pageSize

  const { data, error } = await supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) throw new Error(error.message)

  return (data as Card[]) || []
}
