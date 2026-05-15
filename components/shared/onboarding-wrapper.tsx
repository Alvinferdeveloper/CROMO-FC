import { createClient } from '@/lib/supabase-server'
import { OnboardingModal } from '@/features/profile/components/onboarding-modal'
import { Profile } from '@/types/card'

export async function OnboardingWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <OnboardingModal user={user} profile={profile as Profile} />
}
