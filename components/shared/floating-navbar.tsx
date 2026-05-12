'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, User, LogOut, Home, Map, Layers, Menu, X } from 'lucide-react'
import { UploadCardModal } from '@/features/cards/components/upload-card-modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logout } from '@/features/auth/actions/auth-actions'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface FloatingNavbarProps {
  user: any
  avatarUrl?: string | null
}

export function FloatingNavbar({ user, avatarUrl }: FloatingNavbarProps) {
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
            ? "bg-background/80 backdrop-blur-xl border-border scale-95"
            : "bg-background border-transparent scale-100"
        )}
      >
        {/* ── BRAND / LOGO ── */}
        <Link href="/" className="flex items-center px-3 gap-2 group">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <span className="font-black text-xs">PT</span>
          </div>
          <span className="hidden sm:inline-block font-black text-sm tracking-tighter text-foreground uppercase">
            PaniniTrade
          </span>
        </Link>

        <div className="h-6 w-px bg-border mx-1 hidden md:block" />

        {/* ── DESKTOP NAVIGATION ── */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/explore" icon={<Home className="w-4 h-4" />} label="Explorar" />
          <NavLink href="/map" icon={<Map className="w-4 h-4" />} label="Mapa" />
          {user && <NavLink href="/my-cards" icon={<Layers className="w-4 h-4" />} label="Mis Cromos" />}
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        {/* ── ACTIONS ── */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <UploadCardModal
                trigger={
                  <Button variant="ghost" size="sm" className="rounded-full font-bold gap-2 text-primary hover:bg-primary/10">
                    <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                    <span className="hidden lg:inline">Publicar</span>
                  </Button>
                }
              />

              <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-accent overflow-hidden">
                <Link href="/profile">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Avatar" width={24} height={24} className="rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              </Button>

              <form action={logout}>
                <Button variant="ghost" size="icon" type="submit" className="rounded-full hover:bg-destructive/10 group">
                  <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-1 px-1">
              <Button asChild variant="ghost" size="sm" className="rounded-full font-bold text-xs">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full font-black text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
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
            className="absolute top-20 left-4 right-4 bg-background rounded-[2rem] border border-border shadow-2xl p-4 pointer-events-auto md:hidden overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2">
              <MobileNavLink href="/explore" icon={<Home className="w-5 h-4" />} label="Explorar" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink href="/map" icon={<Map className="w-5 h-4" />} label="Mapa" onClick={() => setIsMobileMenuOpen(false)} />
              {user && <MobileNavLink href="/my-cards" icon={<Layers className="w-5 h-4" />} label="Mis Cromos" onClick={() => setIsMobileMenuOpen(false)} />}
              <div className="h-px bg-border my-2" />
              <MobileNavLink 
                href="/profile" 
                icon={
                  avatarUrl ? (
                    <div className="relative w-5 h-5 rounded-full overflow-hidden border border-primary/20">
                      <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                    </div>
                  ) : (
                    <User className="w-5 h-4" />
                  )
                } 
                label="Mi Perfil" 
                onClick={() => setIsMobileMenuOpen(false)} 
              />
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
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
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
      className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-foreground hover:bg-accent transition-all active:scale-[0.98]"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </Link>
  )
}
