import { createClient } from '@/lib/supabase-server'
import { CardItem } from '@/features/cards/components/card-item'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch cards with profile info
  const { data: cards, error } = await supabase
    .from('card_posts')
    .select('*, profiles(full_name, location_city)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 border-b bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="container mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground max-w-3xl mx-auto leading-[1.1]">
            Cambia tus repetidas y <span className="text-primary underline decoration-primary/30">completa el álbum</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            La red social de coleccionistas del Mundial 2026. Encuentra cromos cerca de ti y coordina intercambios en segundos.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-bold">
              <Link href="/upload-card">Empezar a cambiar</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
              <Search className="mr-2 h-4 w-4" />
              Explorar todo
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cromos Recientes</h2>
            <p className="text-sm text-muted-foreground">Lo último subido por la comunidad</p>
          </div>
          <Button variant="link" asChild>
            <Link href="/explore">Ver todos</Link>
          </Button>
        </div>

        {error ? (
          <div className="p-8 text-center bg-muted rounded-3xl border border-dashed">
            <p className="text-muted-foreground font-medium">No pudimos cargar los cromos. Inténtalo más tarde.</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted/30 rounded-3xl border-2 border-dashed border-border/50">
            <span className="text-5xl mb-4 block">🃏</span>
            <h3 className="text-xl font-bold mb-2">Aún no hay cromos</h3>
            <p className="text-muted-foreground mb-6">Sé el primero en publicar tu cromo para intercambiar.</p>
            <Button asChild>
              <Link href="/upload-card">Publicar Cromo</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
