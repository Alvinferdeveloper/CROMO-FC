import { z } from 'zod'

export const profileSchema = z.object({
  fullName: z.string().min(2, 'El nombre es requerido'),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  locationCity: z.string().optional(),
  country: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>
