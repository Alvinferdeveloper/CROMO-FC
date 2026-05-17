import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// ── RATE LIMITER CONFIG ──
let ratelimit: Ratelimit | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, "60 s"),
      analytics: true,
      prefix: "@upstash/ratelimit",
    })
  }
} catch (error) {
  console.error("Error initializing Ratelimit:", error)
}

export async function updateSession(request: NextRequest) {
  // 1. Rate Limiting Check (Optional if configured)
  if (ratelimit) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? "127.0.0.1"
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)

      if (!success) {
        return new NextResponse("Has excedido el límite de peticiones. Por favor intenta de nuevo en un minuto.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        })
      }
    } catch (error) {
      console.error("Rate limiting failed, bypassing:", error)
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. SECURITY HEADERS
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDevelopment = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDevelopment ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.supabase.co images.unsplash.com picsum.photos lh3.googleusercontent.com *.basemaps.cartocdn.com *.tile.openstreetmap.org *.openstreetmap.org;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  supabaseResponse.headers.set('Content-Security-Policy', cspHeader)
  supabaseResponse.headers.set('X-DNS-Prefetch-Control', 'on')
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  supabaseResponse.headers.set('X-Frame-Options', 'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff')
  supabaseResponse.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy', 'camera=self, microphone=(), geolocation=self')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          // Re-apply headers to the new response
          supabaseResponse.headers.set('Content-Security-Policy', cspHeader)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup')

  if (!user && !isAuthPage && !request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/auth') && request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this matcher to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
