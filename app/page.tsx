import { createClient } from '@/lib/supabase-server'
import { CardItem } from '@/features/cards/components/card-item'
import { CardFilters } from '@/features/cards/components/card-filters'
import { HeroSearchBar } from '@/features/cards/components/hero-search-bar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

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

  const { data: cards, error } = await query.order('created_at', { ascending: false }).limit(40)
  const hasActiveFilters = search || country || city

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── HERO ── */}
      <section
        className="relative min-h-0 flex items-center justify-center overflow-hidden bg-cover bg-center bg-fixed py-12 px-6"
        style={{ backgroundImage: `url('${HERO_BG_URL}')` }}
      >
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/85 via-black/70 to-emerald-950/80 z-1" />

        {/* Decorative orbs */}
        <div
          className="absolute -top-36 -left-44 w-[500px] h-[500px] rounded-full blur-[100px] opacity-40 animate-pulse z-2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-28 -right-24 w-[380px] h-[380px] rounded-full blur-[90px] opacity-30 animate-pulse z-3 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)' }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center gap-5">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/15 backdrop-blur-md text-white/85 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            Mundial 2026 · Álbum oficial
          </div>

          {/* Title */}
          <h1 className="text-[clamp(2.6rem,6vw,5rem)] font-black leading-none tracking-tight text-white drop-shadow-2xl m-0">
            Cambia tus repetidas{' '}
            <span className="bg-linear-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              fácil y cerca.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[clamp(1rem,2vw,1.15rem)] text-white/65 max-w-lg font-medium leading-relaxed m-0">
            Conectamos coleccionistas del Mundial 2026 para que completes tu álbum sin gastar de más.
          </p>

          {/* Search bar */}
          <HeroSearchBar />


        </div>
      </section>

      {/* ── MARKETPLACE ── */}
      <main className="container mx-auto px-4 py-8">
        <CardFilters />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              {hasActiveFilters ? 'Resultados de búsqueda' : 'Explorar Cromos'}
              {!hasActiveFilters && userProfile?.location_city && (
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Cerca de {userProfile.location_city}
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              {cards?.length || 0} cromos disponibles ahora
            </p>
          </div>
        </div>

        {error ? (
          <div className="p-12 text-center bg-muted/30 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground font-bold">Ocurrió un error al conectar. Reintenta.</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {cards.map((card) => <CardItem key={card.id} card={card} />)}
          </div>
        ) : (
          <div className="p-20 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
            <span className="text-6xl mb-6 block">🏟️</span>
            <h3 className="text-2xl font-black mb-2">No encontramos nada</h3>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto font-medium">
              Prueba con otros filtros o sé el primero en subir un cromo en esta zona.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg">
              <Link href="/upload-card">Publicar Cromo</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
