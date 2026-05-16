import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const cardSchema = z.object({
  playerName: z.string().min(2, 'El nombre del jugador es requerido').max(100),
  cardNumber: z.string().max(20).optional(),
  teamName: z.string().min(2, 'El equipo o selección es requerido').max(100),
  albumName: z.string().max(100).optional(),
  description: z.string().max(500, 'La descripción es muy larga').optional(),
  desiredTrade: z.string().min(2, 'Dinos qué buscas a cambio').max(200),
  country: z.string().min(2, 'El país es requerido'),
  locationCity: z.string().min(2, 'La ciudad o zona es requerida'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  rarity: z.enum(['Normal', 'Bronce', 'Plata', 'Oro']),
  image: z.any()
    .refine((file) => file instanceof File, 'La imagen es requerida')
    .refine((file) => file?.size <= MAX_FILE_SIZE, `El tamaño máximo es 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Solo se aceptan formatos .jpg, .jpeg, .png y .webp."
    ),
})

export const updateCardSchema = cardSchema.extend({
  image: z.any().optional(),
})

export type CardValues = z.infer<typeof cardSchema>
export type UpdateCardValues = z.infer<typeof updateCardSchema>
