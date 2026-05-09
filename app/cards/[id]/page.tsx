import { createClient } from '@/lib/supabase-server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowLeftRight, MessageCircle, GalleryHorizontal, ArrowLeft, ShieldCheck, User } from 'lucide-react'
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

  console.log(card)

  const contactMethods = (card.profiles?.contact_methods as any) || {}
  const whatsapp = contactMethods.whatsapp
  const instagram = contactMethods.instagram
  const hasAvatar = !!card.profiles?.avatar_url

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-24 pt-6">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">

        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10 dark:shadow-black/40 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group">
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/30 dark:via-white/5 dark:to-white/10 opacity-50 z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-100" />

              {card.image_url ? (
                <Image
                  src={card.image_url}
                  alt={`Cromo de ${card.player_name}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-slate-200 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 z-0">
                  <span className="text-7xl opacity-40 drop-shadow-sm">🃏</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Sin foto</span>
                </div>
              )}

              {/* Number badge*/}
              <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-black/80 backdrop-blur-md text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest border border-slate-200/50 dark:border-white/10 shadow-lg">
                #{card.card_number || 'S/N'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-8">

            {/* Player and Location */}
            <div className="space-y-4">
              <div className="inline-flex px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold uppercase tracking-widest">
                {card.team_name}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                {card.player_name}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 font-semibold text-lg">
                <MapPin className="h-5 w-5 text-emerald-500" strokeWidth={2.5} />
                <span>{card.location_city}{card.country ? `, ${card.country}` : ''}</span>
              </div>
            </div>

            {/* Trade Desired */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-inner">
              <div className="flex items-center gap-3 font-bold text-emerald-800 dark:text-emerald-400 mb-3 text-lg">
                <ArrowLeftRight className="h-6 w-6" strokeWidth={2.5} />
                <h2>Busca a cambio:</h2>
              </div>
              <p className="text-xl sm:text-2xl text-emerald-950 dark:text-emerald-50 font-medium leading-relaxed">
                {card.desired_trade ? (
                  `"${card.desired_trade}"`
                ) : (
                  <span className="italic opacity-70 text-lg">Cualquier oferta justa es bienvenida.</span>
                )}
              </p>
            </div>

            <hr className="border-slate-200 dark:border-zinc-800" />

            {/* Contact Info */}
            <div className="space-y-6">

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                    {hasAvatar ? (
                      <Image src={card.profiles.avatar_url!} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-semibold uppercase tracking-wider mb-0.5">
                      Publicado por
                    </p>
                    <p className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5">
                      {card.profiles?.full_name || 'Coleccionista'}
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whatsapp ? (
                  <Button asChild size="lg" className="rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-lg shadow-[#25D366]/25 h-14 text-base font-bold transition-all hover:-translate-y-0.5 w-full">
                    <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contactar por WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-14 w-full bg-slate-100 dark:bg-zinc-900 text-slate-400 border-dashed">
                    WhatsApp no disponible
                  </Button>
                )}

                {instagram ? (
                  <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-slate-200 dark:border-zinc-800 h-14 text-base font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-white hover:-translate-y-0.5 transition-all w-full">
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <GalleryHorizontal className="mr-2 h-5 w-5 text-[#E1306C]" />
                      Mensaje en Instagram
                    </a>
                  </Button>
                ) : (
                  <Button disabled size="lg" variant="outline" className="rounded-xl h-14 w-full bg-slate-100 dark:bg-zinc-900 text-slate-400 border-dashed">
                    Instagram no disponible
                  </Button>
                )}
              </div>

              <p className="text-sm text-center text-slate-500 dark:text-zinc-500 font-medium bg-slate-100 dark:bg-zinc-900 py-3 px-4 rounded-xl">
                💡 <span className="italic">Al contactar, menciona que viste el cromo en PaniniTrade 2026.</span>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}