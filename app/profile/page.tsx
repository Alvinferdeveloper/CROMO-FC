import { createClient } from '@/lib/supabase-server'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { AvatarUpload } from '@/features/profile/components/avatar-upload'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url
  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Coleccionista'
  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: es })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header minimalista */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-white">Perfil</h1>
          <p className="text-zinc-500 mt-1">Gestiona tu información personal y preferencias.</p>
        </div>

        <div className="space-y-6">
          {/* Tarjeta de Identidad */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <AvatarUpload userId={user.id} initialUrl={avatarUrl} />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">{fullName}</h2>
              <p className="text-sm text-zinc-500 font-medium">{user.email}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                Coleccionista Activo
              </div>
            </div>
          </section>

          {/* Formulario con Separación Clara */}
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8">
            <div className="mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white">Información Personal</h3>
              <p className="text-sm text-zinc-500">Actualiza tus datos públicos.</p>
            </div>

            <ProfileForm
              initialData={{
                ...profile,
                avatar_url: avatarUrl,
                full_name: fullName,
                email: user.email
              }}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
