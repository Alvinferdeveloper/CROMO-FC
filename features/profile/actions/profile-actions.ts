'use server'

import { createClient } from '@/lib/supabase-server'
import { profileSchema, type ProfileValues } from '../schemas/profile-schema'
import { revalidatePath } from 'next/cache'

export async function updateProfile(values: ProfileValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autorizado' }

  const validatedFields = profileSchema.safeParse(values)
  if (!validatedFields.success) return { error: 'Datos inválidos' }

  const { fullName, whatsapp, instagram, locationCity, country, lat, lng } = validatedFields.data

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      location_city: locationCity,
      country: country,
      location_lat: lat,
      location_lng: lng,
      contact_methods: {
        whatsapp,
        instagram,
      },
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
