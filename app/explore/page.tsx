import { createClient } from '@/lib/supabase-server'
import { ExploreFilters } from '@/features/cards/components/explore-filters'
import { TrendingSidebar } from '@/features/cards/components/trending-sidebar'
import { ExploreSearchHeader } from '@/features/cards/components/explore-search-header'
import { InfiniteExploreFeed } from '@/features/cards/components/infinite-explore-feed'
import { MapPin, Info } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    city?: string;
    lat?: string;
    lng?: string;
    team?: string;
  }>
}

/**
 * Advanced Exploration Page.
 * Professional marketplace layout with independent feed scroll.
 */
export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Fetch initial batch (first 12 cards)
  const { data: initialCards } = await supabase.rpc('get_advanced_market_cards', {
    p_search: params.search || null,
    p_country: params.country || null,
    p_city: params.city || null,
    p_team: params.team || null,
    p_user_lat: params.lat ? parseFloat(params.lat) : null,
    p_user_lng: params.lng ? parseFloat(params.lng) : null,
    p_limit: 12,
    p_offset: 0
  })

  // Format initial data
  const formattedInitial = initialCards?.map((card: any) => ({
    ...card,
    profiles: {
      full_name: card.profile_name
    }
  })) || []

  const isNearbyActive = !!(params.lat && params.lng)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] mt-20 bg-background overflow-hidden">
      <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-4 flex-1 flex flex-col pt-6 min-h-0">
        <ExploreSearchHeader />

        <div className="flex-1 flex gap-8 overflow-hidden min-h-0">
          {/* Left Column: Fixed Filters */}
          <div className="hidden lg:block w-64 overflow-y-auto pb-10 custom-scrollbar pr-2 pt-1">
            <ExploreFilters />
          </div>

          {/* Center Column: Independent Scrollable Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 min-h-0 pt-1">
            <div className="space-y-5 max-w-6xl mx-auto pb-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">Mercado de cromos</h2>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">Encuentra tu próximo intercambio</p>
                </div>

                {isNearbyActive && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
                    <MapPin className="h-3 w-3" />
                    GPS activo
                  </div>
                )}
              </div>

              {isNearbyActive && (
                <div className="p-3.5 rounded-xl bg-accent/60 border border-border flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
                  <Info className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Resultados ordenados por cercanía a tu ubicación.
                  </p>
                </div>
              )}

              <InfiniteExploreFeed
                initialCards={formattedInitial}
                searchParams={params}
              />
            </div>
          </div>

          {/* Right Column: Fixed Trends */}
          <div className="hidden xl:block w-80 overflow-y-auto pb-10 custom-scrollbar pt-1">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
