import { createClient } from '@/lib/supabase-server'
import { CardItem } from '@/features/cards/components/card-item'
import { CardFilters } from '@/features/cards/components/card-filters'
import { MarketplaceHeader } from '@/features/cards/components/marketplace-header'
import { MarketplaceEmpty } from '@/features/cards/components/marketplace-empty'

interface PageProps {
  searchParams: Promise<{ search?: string; country?: string; city?: string }>
}

/**
 * Dedicated Exploration Page.
 * Handles the full marketplace logic, filters, and exhaustive card feed.
 */
export default async function ExplorePage({ searchParams }: PageProps) {
  const { search, country, city } = await searchParams
  const supabase = await createClient()

  // Get user location for smart default sorting
  const { data: { user } } = await supabase.auth.getUser()
  let userCity = undefined
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('location_city').eq('id', user.id).single()
    userCity = profile?.location_city
  }

  // Build query
  let query = supabase
    .from('card_posts')
    .select('*, profiles(full_name)')
    .eq('is_available', true)

  // Apply filters
  if (search) query = query.ilike('player_name', `%${search}%`)
  if (country) query = query.ilike('country', `%${country}%`)
  if (city) query = query.ilike('location_city', `%${city}%`)

  const { data: cards, error } = await query
    .order('created_at', { ascending: false })
    .limit(40)

  const hasActiveFilters = !!(search || country || city)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 py-12">
      <main className="container mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/5 border border-slate-200 dark:border-zinc-800 p-6">
          <MarketplaceHeader
            count={cards?.length || 0}
            hasActiveFilters={hasActiveFilters}
            userCity={userCity}
          />
          <hr className="my-4 border-slate-100 dark:border-zinc-800" />
          <CardFilters />
        </div>

        {error ? (
          <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-red-100">
            <p className="text-red-500 font-bold text-lg">Error al conectar con la base de datos.</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {cards.map((card: any) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <MarketplaceEmpty />
        )}
      </main>
    </div>
  )
}
