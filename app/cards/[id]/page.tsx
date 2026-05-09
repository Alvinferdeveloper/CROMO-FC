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
  const hasAvatar = !!card.profiles?.avatar_url

  const publishDate = new Date(card.created_at)
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric'
  }).format(publishDate)

  return (
    <div className="min-h-screen bg-slate-50 mt-14 dark:bg-zinc-950 pb-24 pt-6">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">

        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al feed
        </Link>

        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

          {/* ── Left column: Image of the card ── */}
          <div className="w-full md:w-2/5 flex justify-center md:justify-start shrink-0">
            <div className="relative aspect-3/4 w-full max-w-[340px] overflow-hidden rounded-3xl shadow-2xl shadow-black/15 dark:shadow-black/40 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group">

              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/30 dark:via-white/5 dark:to-white/10 opacity-50 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />

              {card.image_url ? (
                <Image
                  src={card.image_url}
                  alt={`Cromo de ${card.player_name}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-200 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 z-0">
                  <span className="text-6xl opacity-40 drop-shadow-sm">🃏</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Sin foto</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: Info and actions ── */}
          <div className="w-full md:w-3/5 flex flex-col gap-6">

            {/* Title and availability */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="inline-flex px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                  Equipo: {card.team_name}
                </div>

                {/* Availability Badge */}
                {card.is_available ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-xs font-semibold text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Disponible
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 text-xs font-semibold text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    Intercambiado
                  </div>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-zinc-300 dark:to-zinc-500 pb-1">
                {card.player_name}
              </h1>
            </div>

            {/* Card specifications grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 border-y border-slate-200 dark:border-zinc-800">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5" /> Número
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  {card.card_number ? `#${card.card_number}` : 'Sin numerar'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Book className="w-3.5 h-3.5" /> Álbum
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  {card.album_name || 'Mundial 2026'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" /> Ubicación
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">
                  {card.location_city}, {card.country}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Publicado
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Collector's notes (If the user wrote something extra) */}
            {card.description && (
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <AlignLeft className="w-4 h-4" /> Notas del coleccionista
                </span>
                <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed italic bg-white dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                  "{card.description}"
                </p>
              </div>
            )}

            {/* Trade box (The offer) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-inner">
              <div className="flex items-center gap-3 font-bold text-emerald-800 dark:text-emerald-400 mb-2 text-base">
                <ArrowLeftRight className="h-5 w-5" strokeWidth={2.5} />
                <h2>Busca a cambio:</h2>
              </div>
              <p className="text-lg sm:text-xl text-emerald-950 dark:text-emerald-50 font-medium leading-relaxed">
                {card.desired_trade ? (
                  `"${card.desired_trade}"`
                ) : (
                  <span className="italic opacity-70 text-base">Cualquier oferta justa es bienvenida.</span>
                )}
              </p>
            </div>

            {/* Seller zone and contact */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                    {hasAvatar ? (
                      <Image src={card.profiles.avatar_url!} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mb-0.5">
                      Publicado por
                    </p>
                    <p className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                      {card.profiles?.full_name || 'Coleccionista'}
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whatsapp ? (
                  <Button asChild size="lg" className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-[#25D366]/25 h-12 text-sm font-bold transition-all hover:-translate-y-0.5 w-full">
                    <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-12 w-full bg-slate-100 dark:bg-zinc-900 text-slate-400 border-dashed text-sm">
                    WhatsApp no disponible
                  </Button>
                )}

                {instagram ? (
                  <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-slate-200 dark:border-zinc-800 h-12 text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-white hover:-translate-y-0.5 transition-all w-full">
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon className="mr-2 h-4 w-4 text-[#E1306C]" />
                      Mensaje en Instagram
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-12 w-full bg-slate-100 dark:bg-zinc-900 text-slate-400 border-dashed text-sm">
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