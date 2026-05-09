import { createClient } from '@/lib/supabase-server'
import { MyCardItem } from '@/features/cards/components/my-card-item'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

import { UploadCardModal } from '@/features/cards/components/upload-card-modal'

export default async function MyCardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: cards } = await supabase
    .from('card_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Mis Cromos</h1>
            <p className="text-muted-foreground font-medium">Gestiona tu colección y tus intercambios</p>
          </div>
          <UploadCardModal
            trigger={
              <Button className="rounded-full h-12 px-6 font-bold shadow-lg shadow-primary/20 gap-2">
                <PlusCircle className="h-5 w-5" />
                Subir nuevo cromo
              </Button>
            }
          />
        </div>

        {cards && cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <MyCardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
            <span className="text-6xl mb-6 block">🃏</span>
            <h3 className="text-2xl font-black mb-2">No has subido nada</h3>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto font-medium">
              Empieza a publicar tus repetidas para que otros coleccionistas puedan encontrarte.
            </p>
            <UploadCardModal
              trigger={
                <Button size="lg" className="rounded-full px-10 h-14 text-lg font-bold">
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
