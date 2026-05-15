import { createClient } from '@/lib/supabase-server'
import { ExploreFilters } from '@/features/cards/components/explore-filters'
import { TrendingSidebar } from '@/features/cards/components/trending-sidebar'
import { ExploreSearchHeader } from '@/features/cards/components/explore-search-header'
import { InfiniteExploreFeed } from '@/features/cards/components/infinite-explore-feed'
import { MapPin, Info } from 'lucide-react'
import { Card } from '@/types/card'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Explorar Cromos',
  description: `Busca e intercambia cromos de fútbol con otros coleccionistas en ${siteConfig.name}. Filtra por equipo, rareza o ubicación.`,
  openGraph: {
    title: `Mercado de Cromos | ${siteConfig.name}`,
    description: `Encuentra los cromos que te faltan para completar tu álbum en ${siteConfig.name}.`,
  },
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    country?: string;
    city?: string;
    lat?: string;
    lng?: string;
    team?: string;
    rarity?: string;
  }>
}

/**
 * Advanced Exploration Page.
 * Professional marketplace layout with independent feed scroll.
 */
export default async function ExplorePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // 1. Get user profile for location fallback
  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null
  if (user) {
    const { data } = await supabase.from('profiles')
      .select('location_city, country, location_lat, location_lng')
      .eq('id', user.id)
      .single()
    userProfile = data
  }

  const activeLat = params.lat ? parseFloat(params.lat) : userProfile?.location_lat
  const activeLng = params.lng ? parseFloat(params.lng) : userProfile?.location_lng

  // 2. Fetch initial batch (first 12 cards) using the intelligent RPC
  const { data: initialCards, error: rpcError } = await supabase.rpc('get_advanced_market_cards', {
    p_search: params.search || null,
    p_country: params.country || null,
    p_city: params.city || null,
    p_team: params.team || null,
    p_rarity: (params.rarity as any) || null,
    p_user_lat: activeLat || null,
    p_user_lng: activeLng || null,
    p_user_city: userProfile?.location_city || null,
    p_user_country: userProfile?.country || null,
    p_limit: 12,
    p_offset: 0
  })

  if (rpcError) {
    console.error("Error en RPC get_advanced_market_cards:", rpcError)
  }

  // 3. Format initial data for CardItem compatibility
  const formattedInitial: Card[] = initialCards?.map((card: any) => ({
    ...card,
    profiles: {
      full_name: card.profile_name
    }
  })) || []

  const isNearbyActive = !!(activeLat && activeLng)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] mt-20 bg-background overflow-hidden font-sans">
      <div className="max-w-[1440px] w-full mx-auto px-2 sm:px-4 flex-1 flex flex-col pt-6 min-h-0">

        {/* Top search & GPS header */}
        <ExploreSearchHeader />

        <div className="flex-1 flex gap-8 overflow-hidden min-h-0 mt-4">
          {/* Left Column: Fixed Filters */}
          <div className="hidden lg:block w-64 overflow-y-auto pb-10 custom-scrollbar pr-2 pt-1">
            <ExploreFilters />
          </div>

          {/* Center Column: Independent Scrollable Feed */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 min-h-0 pt-1">
            <div className="space-y-5 max-w-6xl mx-auto pb-20">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground uppercase tracking-widest text-[11px]">
                    Mercado de cromos
                  </h2>
                  <h3 className="text-2xl font-black tracking-tighter">Encuentra tu próximo intercambio</h3>
                </div>

                {isNearbyActive && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase border border-emerald-500/20">
                    <MapPin className="h-3 w-3" />
                    Priorizando cercanía
                  </div>
                )}
              </div>

              {isNearbyActive && (
                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-200/50 flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
                  <Info className="h-4 w-4 text-blue-500 shrink-0" />
                  <p className="text-[11px] text-blue-800 font-bold uppercase tracking-tight">
                    Los resultados están ordenados por relevancia geográfica a tu perfil.
                  </p>
                </div>
              )}

              {/* The dynamic infinite scroll feed */}
              <InfiniteExploreFeed
                initialCards={formattedInitial}
                searchParams={params}
                activeLat={activeLat}
                activeLng={activeLng}
                userCity={userProfile?.location_city}
                userCountry={userProfile?.country}
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
