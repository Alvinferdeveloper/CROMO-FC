import { createClient } from '@/lib/supabase-server'
import { ProfileForm } from '@/features/profile/components/profile-form'
import { redirect } from 'next/navigation'

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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <ProfileForm initialData={profile} />
    </div>
  )
}
