import { createClient } from '@/lib/supabase-server'
import { CardItem } from '@/features/cards/components/card-item'
import { CardFilters } from '@/features/cards/components/card-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    search?: string
    country?: string
    city?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const { search, country, city } = await searchParams
  const supabase = await createClient()

  // Get current user to detect location for "intelligent" feed
  const { data: { user } } = await supabase.auth.getUser()
  let userProfile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('location_city, country').eq('id', user.id).single()
    userProfile = data
  }

  // Build query
  let query = supabase
    .from('card_posts')
    .select('*, profiles(full_name, location_city)')

  // Apply filters if present
  if (search) query = query.ilike('player_name', `%${search}%`)
  if (country) query = query.ilike('country', `%${country}%`)
  if (city) query = query.ilike('location_city', `%${city}%`)

  // Intelligent Sorting Logic:
  // 1. If user has location, show those from their city/country first.
  // 2. Otherwise, show newest first.
  // For now, we'll implement a clean ordering by creation date, 
  // but if filters aren't present and user has location, we show a special section.

  const { data: cards, error } = await query
    .order('created_at', { ascending: false })
    .limit(40)

  const hasActiveFilters = search || country || city

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Compact for better feed focus */}
      {!hasActiveFilters && (
        <section className="relative py-12 md:py-20 px-4 border-b bg-linear-to-b from-primary/5 via-background to-background overflow-hidden">
          <div className="container mx-auto text-center space-y-6 relative z-10">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground max-w-4xl mx-auto leading-[0.9]">
              Cambia tus repetidas <br />
              <span className="text-primary underline decoration-primary/20">fácil y cerca.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium">
              Conectamos coleccionistas del Mundial 2026 para que completes tu álbum sin gastar de más.
            </p>
          </div>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        </section>
      )}

      {/* Main Marketplace Area */}
      <main className="container mx-auto px-4 py-8">
        <CardFilters />

        {/* Status Header */}
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
            <p className="text-muted-foreground font-bold">Ocurrió un error al conectar con el estadio. Reintenta.</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
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
