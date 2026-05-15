'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

/**
 * Marks the onboarding as completed for the current user.
 */
export async function completeOnboarding() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/')
  return { success: true }
}
