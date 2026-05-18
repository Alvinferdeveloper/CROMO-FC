import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  MapPin, ArrowLeftRight, MessageCircle,
  ArrowLeft, ShieldCheck, User, Calendar, Book,
  Hash, AlignLeft
} from 'lucide-react'
import InstagramIcon from '@/components/shared/icons/Instagram'
import Link from 'next/link'
import { MiniMapClient } from '@/features/cards/components/mini-map-client'
import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: card } = await supabase
    .from('card_posts')
    .select('player_name, team_name, image_url, description, rarity')
    .eq('id', id)
    .single()

  if (!card) return {}

  const title = `${card.player_name} (${card.team_name})`
  const description = card.description || `Intercambia el cromo de ${card.player_name} del equipo ${card.team_name} en ${siteConfig.name}.`

  // Construct dynamic OG image URL
  const ogUrl = new URL(`${siteConfig.url}/api/og`)
  ogUrl.searchParams.set('player', card.player_name)
  ogUrl.searchParams.set('team', card.team_name)
  if (card.image_url) ogUrl.searchParams.set('image', card.image_url)
  if (card.rarity) ogUrl.searchParams.set('rarity', card.rarity)

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogUrl.toString()],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [ogUrl.toString()],
    },
  }
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
  const hasAvatar = !!card.profiles?.avatar_url

  const publishDate = new Date(card.created_at)
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(publishDate)

  return (
    <div className="min-h-screen bg-background pb-24 pt-24">
      <div className="container max-w-5xl mx-auto px-6">

        <Link
          href="/"
          className="group inline-flex items-center gap-2 mb-10 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
          Volver al feed
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

          {/* ── Left column: Image of the card ── */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-start shrink-0">
            <div className="relative aspect-4/5 w-full max-w-[380px] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-20px_rgba(var(--primary),0.2)] bg-muted border border-border">
              {card.image_url ? (
                <Image
                  src={card.image_url}
                  alt={`Cromo de ${card.player_name}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-muted to-background z-0">
                  <span className="text-6xl opacity-30 drop-shadow-sm">🃏</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Sin foto</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: Info and actions ── */}
          <div className="w-full md:w-3/5 flex flex-col gap-8">

            {/* Title and availability */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
                  {card.team_name}
                </div>

                {/* Availability Badge */}
                {card.is_available ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-xs font-semibold text-foreground border border-border">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Disponible
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-xs font-semibold text-foreground border border-border">
                    <span className="h-2 w-2 rounded-full bg-destructive"></span>
                    Intercambiado
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
                {card.player_name}
              </h1>
            </div>

            {/* Card specifications grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-6 border-y border-border">
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="w-3.5 h-3.5" /> Número
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {card.card_number ? `#${card.card_number}` : 'Sin numerar'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Book className="w-3.5 h-3.5" /> Álbum
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {card.album_name || 'Mundial 2026'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> Ubicación
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {card.location_city}, {card.country}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" /> Publicado
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Location Map */}
            {card.location_lat && card.location_lng && (
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" /> Ubicación en el mapa
                </span>
                <div className="h-[320px] w-full rounded-2xl border border-border overflow-hidden shadow-sm">
                  <MiniMapClient
                    lat={card.location_lat}
                    lng={card.location_lng}
                    imageUrl={card.image_url}
                    playerName={card.player_name}
                    teamName={card.team_name}
                  />
                </div>
              </div>
            )}

            {/* Collector's notes */}
            {card.description && (
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <AlignLeft className="w-4 h-4 text-primary" /> Notas del coleccionista
                </span>
                <p className="text-muted-foreground text-sm leading-relaxed p-4 rounded-xl bg-accent/50 border border-border">
                  "{card.description}"
                </p>
              </div>
            )}

            {/* Trade box (The offer) */}
            <div className="p-6 rounded-2xl bg-card border-l-4 border-l-primary border border-border shadow-sm">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-2">
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2.5} />
                <h3>Busca a cambio</h3>
              </div>
              <p className="text-lg text-foreground font-semibold leading-relaxed">
                {card.desired_trade ? (
                  `"${card.desired_trade}"`
                ) : (
                  <span className="text-muted-foreground font-medium text-base">Cualquier oferta justa es bienvenida.</span>
                )}
              </p>
            </div>

            {/* Seller zone and contact */}
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {hasAvatar ? (
                    <Image src={card.profiles.avatar_url!} alt="Avatar" fill sizes="48px" className="object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] text-muted-foreground font-medium tracking-wide mb-0.5">
                    Publicado por
                  </p>
                  <p className="font-bold text-base text-foreground flex items-center gap-1.5">
                    {card.profiles?.full_name || 'Coleccionista'}
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whatsapp ? (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md shadow-[#25D366]/20 h-12 text-sm font-semibold active:scale-[0.97] transition-[transform,background-color] duration-200 w-full"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-12 w-full bg-muted/50 text-muted-foreground border-border text-sm font-medium">
                    WhatsApp no disponible
                  </Button>
                )}

                {instagram ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-xl border border-border h-12 text-sm font-semibold hover:bg-accent text-foreground active:scale-[0.97] transition-[transform,background-color] duration-200 w-full shadow-sm"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                  >
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon className="mr-2 h-4 w-4 text-[#E1306C]" />
                      Instagram
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-12 w-full bg-muted/50 text-muted-foreground border-border text-sm font-medium">
                    Instagram no disponible
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}