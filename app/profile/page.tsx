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
    <div className="flex min-h-screen bg-background py-12 px-4">
      <ProfileForm initialData={profile} />
    </div>
  )
}
