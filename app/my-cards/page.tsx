import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { MyCardsView } from '@/features/cards/components/my-cards-view'
import { Card } from '@/types/card'

export default async function MyCardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: initialCards } = await supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .range(0, 11)

  const { data: profile } = await supabase
    .from('profiles')
    .select('location_city')
    .eq('id', user.id)
    .single()

  return (
    <MyCardsView 
      initialCards={(initialCards as Card[]) || []} 
      userCity={profile?.location_city} 
    />
  )
}