import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { siteConfig } from '@/lib/config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${siteConfig.url}${next}`)
    }
  }
  return NextResponse.redirect(`${siteConfig.url}/login?error=auth-code-error`)
}
