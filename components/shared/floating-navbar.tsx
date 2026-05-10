'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, User, LogOut, Home, Map, Layers, Menu, X } from 'lucide-react'
import { UploadCardModal } from '@/features/cards/components/upload-card-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logout } from '@/features/auth/actions/auth-actions'
import { cn } from '@/lib/utils'

interface FloatingNavbarProps {
  user: any
}

export function FloatingNavbar({ user }: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-5000 flex justify-center p-4 sm:p-6 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-500 border shadow-2xl",
          isScrolled
            ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-slate-200 dark:border-zinc-800 scale-95"
            : "bg-white dark:bg-zinc-900 border-transparent scale-100"
        )}
      >
        {/* ── BRAND / LOGO ── */}
        <Link href="/" className="flex items-center px-3 gap-2 group">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
            <span className="font-black text-xs">PT</span>
          </div>
          <span className="hidden sm:inline-block font-black text-sm tracking-tighter text-slate-900 dark:text-white uppercase">
            PaniniTrade
          </span>
        </Link>

        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1 hidden md:block" />

        {/* ── DESKTOP NAVIGATION ── */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/explore" icon={<Home className="w-4 h-4" />} label="Explorar" />
          <NavLink href="/map" icon={<Map className="w-4 h-4" />} label="Mapa" />
          {user && <NavLink href="/my-cards" icon={<Layers className="w-4 h-4" />} label="Mis Cromos" />}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-zinc-800 mx-1" />

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <UploadCardModal
                trigger={
                  <Button variant="ghost" size="sm" className="rounded-full font-bold gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10">
                    <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                    <span className="hidden lg:inline">Publicar</span>
                  </Button>
                }
              />

              <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800">
                <Link href="/profile">
                  <User className="h-4 w-4 text-slate-600 dark:text-zinc-400" />
                </Link>
              </Button>

              <form action={logout}>
                <Button variant="ghost" size="icon" type="submit" className="rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 group">
                  <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-1 px-1">
              <Button asChild variant="ghost" size="sm" className="rounded-full font-bold text-xs">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full font-black text-xs bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <Link href="/signup">Unirse</Link>
              </Button>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-20 left-4 right-4 bg-white dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 shadow-2xl p-4 pointer-events-auto md:hidden overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2">
              <MobileNavLink href="/explore" icon={<Home className="w-5 h-4" />} label="Explorar" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/map" icon={<Map className="w-5 h-4" />} label="Mapa" onClick={() => setIsMobileMenuOpen(false)} />
              {user && <MobileNavLink href="/my-cards" icon={<Layers className="w-5 h-4" />} label="Mis Cromos" onClick={() => setIsMobileMenuOpen(false)} />}
              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
              <MobileNavLink href="/profile" icon={<User className="w-5 h-4" />} label="Mi Perfil" onClick={() => setIsMobileMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 transition-all"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

function MobileNavLink({ href, icon, label, onClick }: { href: string, icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
    >
      <span className="text-emerald-500">{icon}</span>
      {label}
    </Link>
  )
}
