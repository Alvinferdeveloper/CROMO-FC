import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const PUBLIC_ROUTES = [
  '/',
  '/explore',
  '/cards/',
  '/map',
  '/rules',
  '/support',
  '/privacy',
  '/api/og',
  '/api/auth',
  '/auth'
]

const AUTH_ONLY_ROUTES = ['/login', '/signup']

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
  console.error("Error al inicializar Ratelimit:", error)
}

/**
 * Apply robust security headers to the response.
 */
function applySecurityHeaders(response: NextResponse, nonce: string) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDevelopment ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.supabase.co images.unsplash.com picsum.photos lh3.googleusercontent.com *.basemaps.cartocdn.com *.tile.openstreetmap.org *.openstreetmap.org flagcdn.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  const headers = response.headers
  headers.set('Content-Security-Policy', cspHeader)
  headers.set('X-DNS-Prefetch-Control', 'on')
  headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=self, microphone=(), geolocation=self')

  return response
}

/**
 * Determines the access type of the current route.
 */
function getRouteStatus(path: string) {
  const isPublic = PUBLIC_ROUTES.some(route => path === route || path.startsWith(route))
  const isAuthOnly = AUTH_ONLY_ROUTES.some(route => path.startsWith(route))
  return { isPublic, isAuthOnly }
}


export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

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
    } catch (e) {
      console.error("Error en Rate Limit:", e)
    }
  }

  // Create a base response with security headers
  let response = applySecurityHeaders(NextResponse.next({ request }), nonce)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = applySecurityHeaders(NextResponse.next({ request }), nonce)
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { isPublic, isAuthOnly } = getRouteStatus(path)

  if (!user && !isPublic && !isAuthOnly) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  if (user && isAuthOnly) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export async function proxy(request: NextRequest) {
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
