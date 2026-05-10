import { createClient } from '@/lib/supabase-server'
import { Hero } from '@/features/home/components/hero'
import { TeaserSection } from '@/features/home/components/teaser-section'
import { HowItWorks } from '@/features/home/components/how-it-works'
import { Card } from '@/types/card'

/**
 * Hybrid Home Page (Landing Page).
 * High impact hero section + a 'Teaser' of nearby/recent cards.
 */
export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null
  if (user) {
    const { data } = await supabase.from('profiles')
      .select('location_city, country, location_lat, location_lng')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  // 2. Fetch teaser cards using smart logic (City -> Country -> Distance)
  const { data: teaserCards } = await supabase.rpc('get_smart_teaser', {
    p_user_city: userProfile?.location_city,
    p_user_country: userProfile?.country,
    p_user_lat: userProfile?.location_lat,
    p_user_lng: userProfile?.location_lng,
    p_limit: 10
  })

  // 3. Format teaser data for CardItem compatibility
  const formattedTeaser: Card[] = teaserCards?.map((card: any) => ({
    ...card,
    profiles: {
      full_name: card.profile_name
    }
  })) || []

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Hero />
      <TeaserSection cards={formattedTeaser} userCity={userProfile?.location_city} />
      <HowItWorks />
    </div>
  )
}
