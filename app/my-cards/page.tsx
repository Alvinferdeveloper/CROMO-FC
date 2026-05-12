import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { UploadCardModal } from '@/features/cards/components/upload-card-modal'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MyCardsInfiniteFeed } from '@/features/cards/components/my-cards-infinite-feed'
import { Card } from '@/types/card'

export default async function MyCardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Initial fetch using same logic as infinite feed
  const { data: initialCards } = await supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(0, 11) // First 12 items

  const today = (format as any)(new Date(), "EEEE, dd MMMM yyyy", { locale: es })

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Cromos</h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium capitalize">
              {today}
            </p>
          </div>
          <UploadCardModal
            trigger={
              <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 gap-2 transition-all active:scale-95 cursor-pointer">
                <PlusCircle className="h-5 w-5" />
                Subir nuevo cromo
              </Button>
            }
          />
        </div>

        {/* Dashboard Feed Area */}
        {initialCards && initialCards.length > 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
            <div className="p-8">
              <MyCardsInfiniteFeed initialCards={initialCards as Card[]} />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-zinc-800 p-20 text-center">
            <span className="text-6xl mb-6 block">🃏</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No has subido nada aún</h3>
            <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto font-medium">
              Empieza a publicar tus repetidas para que otros coleccionistas puedan encontrarte e intercambiar.
            </p>
            <UploadCardModal
              trigger={
                <Button size="lg" className="h-14 px-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-zinc-900 font-bold shadow-xl active:scale-95 transition-all cursor-pointer">
                  Publicar mi primer cromo
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
