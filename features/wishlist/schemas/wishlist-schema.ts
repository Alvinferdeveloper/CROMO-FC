import { z } from 'zod'

export const wishlistSchema = z.object({
  playerName: z.string().min(2, 'El nombre del jugador es requerido').max(100),
  teamName: z.string().max(100).optional(),
  cardNumber: z.string().max(20).optional(),
  rarity: z.enum(['Normal', 'Bronce', 'Plata', 'Oro']).optional(),
})

export type WishlistValues = z.infer<typeof wishlistSchema>

export interface WishlistItem {
  id: string
  user_id: string
  player_name: string
  team_name: string | null
  card_number: string | null
  rarity: 'Normal' | 'Bronce' | 'Plata' | 'Oro' | null
  created_at: string
  updated_at: string
}
