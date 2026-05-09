import { createClient } from '@/lib/supabase-server'
import { CardItem } from '@/features/cards/components/card-item'
import { CardFilters } from '@/features/cards/components/card-filters'
import { HeroSearchBar } from '@/features/cards/components/hero-search-bar'
import { MarketplaceHeader } from '@/features/cards/components/marketplace-header'
import { MarketplaceEmpty } from '@/features/cards/components/marketplace-empty'

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

  let query = supabase.from('card_posts').select('*, profiles(full_name, location_city)')
  if (search) query = query.ilike('player_name', `%${search}%`)
  if (country) query = query.ilike('country', `%${country}%`)
  if (city) query = query.ilike('location_city', `%${city}%`)

  const { data: cards, error } = await query.order('created_at', { ascending: false }).limit(60)
  const hasActiveFilters = !!(search || country || city)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-fixed pt-16 pb-24 px-6"
        style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/90 via-black/80 to-emerald-950/90 z-2" />
        <div
          className="absolute -top-36 -left-44 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-pulse z-2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-28 -right-24 w-[380px] h-[380px] rounded-full blur-[90px] opacity-30 animate-pulse z-2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center gap-6">
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

        {/*  */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/5 border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col">
            <MarketplaceHeader
              count={cards?.length || 0}
              hasActiveFilters={hasActiveFilters}
              userCity={userProfile?.location_city}
            />
            <hr className="border-slate-100 dark:border-zinc-800" />
            <div className="pt-2">
              <CardFilters />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="w-full">
          {error ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 flex flex-col items-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Error de conexión</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                No pudimos cargar las cartas. Por favor, verifica tu conexión e intenta de nuevo.
              </p>
            </div>
          ) : cards && cards.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {cards.map((card) => (
                <div key={card.id} className="group animate-in fade-in zoom-in-95 duration-500">
                  <CardItem card={card} />
                </div>
              ))}
            </div>
          ) : (
            <MarketplaceEmpty />
          )}
        </div>
      </main>
    </div>
  )
}