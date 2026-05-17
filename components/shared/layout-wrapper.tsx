'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export function LayoutWrapper({ children, navbar }: { children: React.ReactNode, navbar: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = pathname === '/login' || pathname === '/signup'

  return (
    <>
      {!isAuth && navbar}
      <main className="flex-1">{children}</main>
      {!isAuth && (
        <footer className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 py-16 mt-4">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Brand Section */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-slate-900 to-emerald-600 dark:from-white dark:to-emerald-400">
                    {siteConfig.name.toUpperCase()} <span className="text-emerald-500 italic">2026</span>
                  </h3>
                  <div className="h-1 w-12 bg-emerald-500/30 rounded-full" />
                </div>
                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-sm leading-relaxed">
                  La plataforma definitiva para completar tu álbum. Conecta, intercambia y vive la pasión del coleccionismo <span className="text-slate-900 dark:text-white font-bold italic">sin límites</span>.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Plataforma</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-zinc-300">
                  <li><Link href="/explore" className="hover:text-emerald-500 transition-colors">Explorar</Link></li>
                  <li><Link href="/map" className="hover:text-emerald-500 transition-colors">Mapa</Link></li>
                  <li><Link href="/my-cards" className="hover:text-emerald-500 transition-colors">Mis Cromos</Link></li>
                </ul>
              </div>

              {/* Community */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Comunidad</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-zinc-300">
                  <li><Link href="/rules" className="hover:text-emerald-500 transition-colors">Reglas de Intercambio</Link></li>
                  <li><Link href="/support" className="hover:text-emerald-500 transition-colors">Soporte</Link></li>
                  <li><Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacidad</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                © 2026. Hecho para <span className="text-slate-900 dark:text-white italic">coleccionistas reales</span>.
              </p>
              <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Twitter</a>
                <a href={siteConfig.links.instagram || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Instagram</a>
                <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  )
}
