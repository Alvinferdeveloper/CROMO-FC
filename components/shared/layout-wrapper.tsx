'use client'

import { usePathname } from 'next/navigation'

export function LayoutWrapper({ children, navbar }: { children: React.ReactNode, navbar: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = pathname === '/login' || pathname === '/signup'

  return (
    <>
      {!isAuth && navbar}
      <main className="flex-1">{children}</main>
      {!isAuth && (
        <footer className="border-t py-8 mt-12 text-center text-sm text-muted-foreground bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="font-semibold text-primary mb-2">PaniniTrade 2026</p>
            <p>© 2026. Hecho para coleccionistas reales.</p>
          </div>
        </footer>
      )}
    </>
  )
}
