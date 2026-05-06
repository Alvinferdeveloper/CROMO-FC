import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { logout } from '@/features/auth/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { PlusCircle, User, LogOut } from 'lucide-react'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight text-primary">
              PaniniTrade
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Explorar
            </Link>
            <Link
              href="/map"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Mapa
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/upload-card">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Subir Cromo
                </Link>
              </Button>
              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <form action={logout}>
                  <Button variant="ghost" size="icon" type="submit" title="Cerrar sesión">
                    <LogOut className="h-5 w-5 text-destructive" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Regístrate</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
