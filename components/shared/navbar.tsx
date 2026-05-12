import { createClient } from '@/lib/supabase-server'
import { FloatingNavbar } from './floating-navbar'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url

  return <FloatingNavbar user={user} avatarUrl={avatarUrl} />
}
