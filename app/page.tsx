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
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-fixed py-12 px-6"
        style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/85 via-black/70 to-emerald-950/80 z-2" />
        <div
          className="absolute -top-36 -left-44 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-pulse z-2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-28 -right-24 w-[380px] h-[380px] rounded-full blur-[90px] opacity-30 animate-pulse z-2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 backdrop-blur-md text-white/85 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            Mundial 2026 · Álbum oficial
          </div>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-black leading-none tracking-tight text-white drop-shadow-2xl m-0">
            Cambia tus repetidas{' '}
            <span className="bg-linear-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              fácil y cerca.
            </span>
          </h1>
          <p className="text-[clamp(0.9rem,2vw,1.05rem)] text-white/65 max-w-lg font-medium leading-relaxed m-0">
            Conectamos coleccionistas del Mundial 2026 para que completes tu álbum sin gastar de más.
          </p>
          <HeroSearchBar />
        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <main className="container mx-auto px-4 sm:px-6 pt-6 pb-12">
        <CardFilters />

        <MarketplaceHeader
          count={cards?.length || 0}
          hasActiveFilters={hasActiveFilters}
          userCity={userProfile?.location_city}
        />

        {error ? (
          <div className="p-10 text-center bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-sm text-muted-foreground font-medium">Ocurrió un error al conectar. Reintenta.</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {cards.map((card) => <CardItem key={card.id} card={card} />)}
          </div>
        ) : (
          <MarketplaceEmpty />
        )}
      </main>
    </div>
  )
}
