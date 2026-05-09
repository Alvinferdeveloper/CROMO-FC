import { createClient } from '@/lib/supabase-server'
import { FloatingNavbar } from './floating-navbar'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <FloatingNavbar user={user} />
}
