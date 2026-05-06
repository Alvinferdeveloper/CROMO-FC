import { z } from 'zod'

export const cardSchema = z.object({
  playerName: z.string().min(2, 'El nombre del jugador es requerido'),
  cardNumber: z.string().optional(),
  teamName: z.string().min(2, 'El equipo o selección es requerido'),
  albumName: z.string().optional(),
  description: z.string().optional(),
  desiredTrade: z.string().min(2, 'Dinos qué buscas a cambio'),
  image: z.any().refine((file) => file instanceof File, 'La imagen es requerida'),
})

export type CardValues = z.infer<typeof cardSchema>
