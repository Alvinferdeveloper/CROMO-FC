'use server'

import { createClient } from '@/lib/supabase-server'
import { loginSchema, signupSchema, type LoginValues, type SignupValues } from '../schemas/auth-schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getFriendlyErrorMessage } from '@/lib/error-handler'

export async function login(values: LoginValues) {
  const supabase = await createClient()

  const validatedFields = loginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Campos inválidos' }
  }

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

  if (error) {
    return { error: getFriendlyErrorMessage(error) }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(values: SignupValues) {
  const supabase = await createClient()

  const validatedFields = signupSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Campos inválidos' }
  }

  const { email, password, fullName } = validatedFields.data

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: getFriendlyErrorMessage(error) }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
