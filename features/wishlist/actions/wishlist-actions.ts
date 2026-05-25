'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { wishlistSchema, type WishlistValues, type WishlistItem } from '../schemas/wishlist-schema'
import { getFriendlyErrorMessage } from '@/lib/error-handler'

/**
 * Adds a new item to the user's wishlist.
 */
export async function addToWishlist(values: WishlistValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Debes iniciar sesión para usar la Wishlist' }

  const validatedFields = wishlistSchema.safeParse(values)
  if (!validatedFields.success) {
    return { error: 'Campos inválidos' }
  }

  const { data: newItem, error } = await supabase
    .from('wishlist_items')
    .insert({
      user_id: user.id,
      player_name: validatedFields.data.playerName,
      team_name: validatedFields.data.teamName,
      card_number: validatedFields.data.cardNumber,
      rarity: validatedFields.data.rarity,
    })
    .select()
    .single()

  if (error) return { error: getFriendlyErrorMessage(error) }

  revalidatePath('/my-cards')
  return { success: true, data: newItem }
}

/**
 * Removes an item from the user's wishlist.
 */
export async function removeFromWishlist(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: getFriendlyErrorMessage(error) }

  revalidatePath('/my-cards')
  return { success: true }
}

/**
 * Retrieves the user's wishlist with pagination.
 */
export async function getWishlist(page: number = 0, pageSize: number = 12): Promise<{ data?: WishlistItem[], error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { data: [] }

  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { error: getFriendlyErrorMessage(error) }

  return { data: data as WishlistItem[] }
}

/**
 * Finds card posts that match items in the user's wishlist using smart fuzzy matching.
 */
export async function getWishlistMatches() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { data: [] }

  const { data: matches, error } = await supabase
    .rpc('get_wishlist_matches', { p_user_id: user.id })

  if (error) return { error: getFriendlyErrorMessage(error) }

  return { data: matches }
}
