import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Repeat, MessageCircle, Inbox, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('card_posts')
    .select('*, profiles(*)')
    .eq('id', id)
    .single()

  if (error || !card) {
    notFound()
  }

  const contactMethods = (card.profiles?.contact_methods as any) || {}
  const whatsapp = contactMethods.whatsapp
  const instagram = contactMethods.instagram

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagen del Cromo */}
          <div className="relative aspect-[3/4] w-full max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl bg-muted border">
            {card.image_url ? (
              <Image
                src={card.image_url}
                alt={card.player_name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin foto disponible
              </div>
            )}
            <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl text-sm font-bold text-white uppercase tracking-widest border border-white/10">
              {card.card_number || 'S/N'}
            </div>
          </div>

          {/* Información y Acciones */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {card.team_name}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                {card.player_name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{card.location_city}, {card.country}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-secondary/50 border border-border/50 space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Repeat className="h-6 w-6 text-primary" />
                <h2>Lo que busca a cambio:</h2>
              </div>
              <p className="text-xl text-foreground italic leading-relaxed">
                &quot;{card.desired_trade || 'Cualquier oferta es bienvenida'}&quot;
              </p>
            </div>

            <div className="pt-6 border-t space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xl shadow-inner border overflow-hidden">
                  {card.profiles?.avatar_url ? (
                    <Image src={card.profiles.avatar_url} alt="Avatar" width={48} height={48} />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publicado por:</p>
                  <p className="font-bold text-lg">{card.profiles?.full_name || 'Coleccionista Anónimo'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {whatsapp ? (
                  <Button asChild size="lg" className="flex-1 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-green-500/20 h-14 text-lg">
                    <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-6 w-6 fill-current" />
                      WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="flex-1 rounded-full h-14 opacity-50">
                    WhatsApp no disponible
                  </Button>
                )}

                {instagram ? (
                  <Button asChild size="lg" variant="outline" className="flex-1 rounded-full border-2 h-14 text-lg hover:bg-zinc-50">
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Inbox className="mr-2 h-6 w-6" />
                      Instagram
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="flex-1 rounded-full h-14 opacity-50">
                    Instagram no disponible
                  </Button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground italic">
                Al contactar, menciona que viste el cromo en PaniniTrade 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
