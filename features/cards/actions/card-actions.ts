'use server'

import { createClient } from '@/lib/supabase-server'
import { cardSchema, updateCardSchema } from '../schemas/card-schema'
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
    country: formData.get('country'),
    locationCity: formData.get('locationCity'),
    lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
    lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
    rarity: formData.get('rarity') || 'Normal',
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
    country,
    locationCity,
    lat,
    lng,
    rarity,
    image
  } = validatedFields.data

  // 1. Subir imagen a Supabase Storage
  const file = image as File
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Math.random()}.${fileExt}`
  const filePath = fileName

  const { error: uploadError } = await supabase.storage
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
    country: country,
    location_city: locationCity,
    location_lat: lat,
    location_lng: lng,
    rarity: rarity,
  })

  if (dbError) {
    console.log('Error al guardar el post:', dbError)
    return { error: 'Error al guardar el post' }
  }

  revalidatePath('/')
  redirect('/')
}

export async function updateCardPost(cardId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const values = {
    playerName: formData.get('playerName'),
    cardNumber: formData.get('cardNumber'),
    teamName: formData.get('teamName'),
    albumName: formData.get('albumName'),
    description: formData.get('description'),
    desiredTrade: formData.get('desiredTrade'),
    country: formData.get('country'),
    locationCity: formData.get('locationCity'),
    lat: formData.get('lat') ? Number(formData.get('lat')) : undefined,
    lng: formData.get('lng') ? Number(formData.get('lng')) : undefined,
    rarity: formData.get('rarity'),
    image: formData.get('image') || undefined,
  }

  const validatedFields = updateCardSchema.safeParse(values)
  if (!validatedFields.success) return { error: 'Campos inválidos' }

  const updateData: any = {
    player_name: validatedFields.data.playerName,
    card_number: validatedFields.data.cardNumber,
    team_name: validatedFields.data.teamName,
    album_name: validatedFields.data.albumName,
    description: validatedFields.data.description,
    desired_trade: validatedFields.data.desiredTrade,
    country: validatedFields.data.country,
    location_city: validatedFields.data.locationCity,
    location_lat: validatedFields.data.lat,
    location_lng: validatedFields.data.lng,
    rarity: validatedFields.data.rarity,
    updated_at: new Date().toISOString(),
  }

  // Handle new image if provided
  if (validatedFields.data.image instanceof File) {
    const file = validatedFields.data.image
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Math.random()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('card-images').upload(fileName, file)
    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from('card-images').getPublicUrl(fileName)
      updateData.image_url = publicUrl
    }
  }

  const { error } = await supabase
    .from('card_posts')
    .update(updateData)
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/my-cards')
  revalidatePath(`/cards/${cardId}`)
  revalidatePath('/')
  return { success: true }
}

export async function toggleCardAvailability(cardId: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('card_posts')
    .update({ is_available: !currentStatus })
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/my-cards')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCardPost(cardId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('card_posts')
    .delete()
    .eq('id', cardId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/my-cards')
  revalidatePath('/')
  return { success: true }
}
