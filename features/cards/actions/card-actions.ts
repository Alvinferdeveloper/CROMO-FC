'use server'

import { createClient } from '@/lib/supabase-server'
import { cardSchema } from '../schemas/card-schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCardPost(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Debes estar autenticado' }

  const values = {
    playerName: formData.get('playerName'),
    cardNumber: formData.get('cardNumber'),
    teamName: formData.get('teamName'),
    albumName: formData.get('albumName'),
    description: formData.get('description'),
    desiredTrade: formData.get('desiredTrade'),
    image: formData.get('image'),
  }

  const validatedFields = cardSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Campos inválidos o falta la imagen' }
  }

  const {
    playerName,
    cardNumber,
    teamName,
    albumName,
    description,
    desiredTrade,
    image
  } = validatedFields.data

  // 1. Subir imagen a Supabase Storage
  const file = image as File
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Math.random()}.${fileExt}`
  const filePath = fileName

  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('card-images')
    .upload(filePath, file)

  if (uploadError) {
    console.log('Error al subir la imagen:', uploadError)
    return { error: 'Error al subir la imagen' }
  }

  // 2. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('card-images')
    .getPublicUrl(filePath)

  // 3. Guardar en la base de datos
  const { error: dbError } = await supabase.from('card_posts').insert({
    user_id: user.id,
    player_name: playerName,
    card_number: cardNumber,
    team_name: teamName,
    album_name: albumName,
    description: description,
    desired_trade: desiredTrade,
    image_url: publicUrl,
  })

  if (dbError) {
    return { error: 'Error al guardar el post' }
  }

  revalidatePath('/')
  redirect('/')
}
