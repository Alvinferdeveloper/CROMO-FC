import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { UploadCardModal } from '@/features/cards/components/upload-card-modal'
import { Button } from '@/components/ui/button'
import { PlusCircle, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MyCardsInfiniteFeed } from '@/features/cards/components/my-cards-infinite-feed'
import { Card } from '@/types/card'

export default async function MyCardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: initialCards } = await supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .range(0, 11)

  const today = (format as any)(new Date(), "EEEE, dd MMMM yyyy", { locale: es })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Header Section */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] mb-1">
                Gestión de Inventario
              </p>
              <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
                Mis Cromos
              </h1>
              <p className="text-zinc-500 text-sm mt-1 capitalize">{today}</p>
            </div>

            <div className="flex items-center gap-4 mt-2 md:mt-12">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{initialCards?.length || 0} cromos activos</span>
              </div>
              <UploadCardModal
                trigger={
                  <Button className="h-11 px-6 rounded-full cursor-pointer  font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Subir Cromo
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Feed Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {initialCards && initialCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            <MyCardsInfiniteFeed initialCards={initialCards as Card[]} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/20">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
              <PlusCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Empieza tu colección</h3>
            <p className="text-zinc-500 max-w-sm mt-2 mb-8">
              No tienes cromos activos en este momento. Sube tu primer cromo para empezar a intercambiar con otros coleccionistas.
            </p>
            <UploadCardModal
              trigger={
                <Button size="lg" className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105">
                  Publicar mi primer cromo
                </Button>
              }
            />
          </div>
        )}
      </main>
    </div>
  )
}