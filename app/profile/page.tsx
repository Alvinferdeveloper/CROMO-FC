import { createClient } from '@/lib/supabase-server'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url
  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Coleccionista'
  const today = format(new Date(), "EEEE, dd MMMM yyyy", { locale: es } as any)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bienvenido, {fullName.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium capitalize">
            {today}
          </p>
        </div>

        {/* Dashboard Card Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
          
          {/* Cover Area */}
          <div className="h-40 w-full bg-linear-to-r from-blue-100 via-white to-amber-50 dark:from-blue-900/20 dark:via-zinc-900 dark:to-amber-900/20 relative">
             <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>

          <div className="px-8 pb-12">
            {/* Avatar & Basic Info Overlay */}
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 mb-12 relative z-10">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 shadow-xl overflow-hidden relative group">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100 dark:bg-zinc-800">
                    👤
                  </div>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {fullName}
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Form Area */}
            <ProfileForm initialData={{ ...profile, avatar_url: avatarUrl, full_name: fullName, email: user.email }} />
          </div>
        </div>
      </div>
    </div>
  )
}
