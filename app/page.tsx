import { createClient } from '@/lib/supabase-server'
import { SmartFeedContainer } from '@/features/cards/components/smart-feed-container'
import { CardFilters } from '@/features/cards/components/card-filters'
import { HeroSearchBar } from '@/features/cards/components/hero-search-bar'
import { MarketplaceHeader } from '@/features/cards/components/marketplace-header'
import { MarketplaceEmpty } from '@/features/cards/components/marketplace-empty'
import { getPaginatedCards } from '@/features/cards/actions/get-cards'

const HERO_BG_URL = '/illustrations/bg_illustration.png'

interface PageProps {
  searchParams: Promise<{ search?: string; country?: string; city?: string }>
}

export default async function Home({ searchParams }: PageProps) {
  const { search, country, city } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('location_city, country').eq('id', user.id).single()
    userProfile = data
  }

  // Initial fetch using SSR
  const { data: initialCards, error } = await getPaginatedCards({
    page: 0,
    search,
    userCity: userProfile?.location_city
  })

  const hasActiveFilters = !!(search || country || city)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-fixed pt-16 pb-24 px-6"
        style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/80 to-emerald-950/90 z-2" />

        <div className="relative z-10 max-w-3xl w-full mx-auto  mt-8 text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-xs font-bold tracking-widest uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
            Mundial 2026 · Álbum oficial
          </div>
          <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] font-black leading-[1.1] tracking-tight text-white drop-shadow-2xl m-0">
            Cambia tus repetidas <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              fácil y cerca.
            </span>
          </h1>
          <p className="text-[clamp(1rem,2vw,1.15rem)] text-zinc-300 max-w-xl font-medium leading-relaxed m-0">
            Conectamos coleccionistas del Mundial 2026 para que completes tu álbum sin gastar de más.
          </p>
          <div className="w-full max-w-2xl mt-2">
            <HeroSearchBar />
          </div>
        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <main className="relative z-20 container mx-auto px-4 sm:px-6 -mt-12 mb-16 flex flex-col gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/5 border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col">
            <MarketplaceHeader
              count={initialCards?.length || 0}
              hasActiveFilters={hasActiveFilters}
              userCity={userProfile?.location_city}
            />
            <hr className="border-slate-100 dark:border-zinc-800" />
            <div className="pt-2">
              <CardFilters />
            </div>
          </div>
        </div>

        <div className="w-full">
          {error ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 flex flex-col items-center gap-3 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Error de conexión</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No pudimos cargar las cartas. Reintenta.
              </p>
            </div>
          ) : initialCards && initialCards.length > 0 ? (
            <SmartFeedContainer
              initialCards={initialCards}
              search={search}
              userCity={userProfile?.location_city}
            />
          ) : (
            <MarketplaceEmpty />
          )}
        </div>
      </main>
    </div>
  )
}
