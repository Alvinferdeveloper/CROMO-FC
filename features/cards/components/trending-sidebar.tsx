'use client'

import { Button } from '@/components/ui/button'
import { Flame, Trophy, TrendingUp, Users, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const TRENDING_CARDS = [
  { id: '1', name: 'Lionel Messi', team: 'Argentina', type: 'Normal', image: '/images/messi.jpg', change: '+12%' },
  { id: '2', name: 'Cristiano Ronaldo', team: 'Portugal', type: 'Oro', image: '/images/cristiano.jpg', change: '+8%' },
  { id: '3', name: 'Kylian Mbappé', team: 'Francia', type: 'Bronce', image: '/images/mbappe.jpg', change: '+15%' },
  { id: '4', name: 'Lamine Yamal', team: 'España', type: 'Plata', image: '/images/lamine.jpg', change: '+24%' },
]

export function TrendingSidebar() {
  return (
    <aside className="hidden xl:flex flex-col pr-2 gap-6 w-80 shrink-0 select-none">
      {/* ── LIVE ACTIVITY BLOCK ── */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/30" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
              Live Network
            </span>
          </div>

          <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tabular-nums">
            {new Date().getHours()}:00 UTC
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2">

          {/* Left */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Active
              </span>
            </div>

            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
              1,428
            </p>

            <p className="mt-1 text-[10px] font-medium text-emerald-500">
              +12.4%
            </p>
          </div>

          {/* Right */}
          <div className="border-l border-zinc-100 dark:border-zinc-800 px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Trades
              </span>
            </div>

            <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
              482
            </p>

            <p className="mt-1 text-[10px] font-medium text-blue-500">
              +4.8%
            </p>
          </div>
        </div>

        {/* Subtle glow */}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 dark:ring-white/10" />

        {/* Soft gradient */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-blue-500/2" />
      </div>

      {/* ── MOST WANTED SECTION ── */}
      <div className="space-y-5 px-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            Tendencias Semanales
          </h3>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {TRENDING_CARDS.map((card, idx) => (
              <TrendingItem key={card.id} card={card} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          className="w-full group cursor-pointer h-12 rounded-lg border  bg-primary hover:bg-primary/80 hover:border-emerald-500/20 transition-all duration-300 active:scale-[0.98]"
        >
          <span className="text-xs font-black uppercase text-white tracking-widest transition-colors">
            Explorar Ranking
          </span>
          <ArrowUpRight className="ml-2 w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </Button>
      </div>

      {/* ── TIP CARD ── */}
      <div className="mx-2 p-5 rounded-md bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-150" />
        <p className="text-[11px] font-bold leading-relaxed text-emerald-500/80 italic">
          "Activar tu ubicación aumenta las posibilidades de intercambio en un 80%."
        </p>
      </div>
    </aside>
  )
}

function TrendingItem({ card, index }: { card: typeof TRENDING_CARDS[0], index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.1
      }}
      whileHover={{ x: 4 }}
      className="group flex items-center gap-4 p-2 rounded-lg hover:bg-primary/20 border border-transparent hover:border-white/5 transition-all duration-300 cursor-pointer active:scale-[0.98]"
    >
      <div className="relative h-16 w-12 shrink-0 rounded-md overflow-hidden shadow-2xl border border-white/10 group-hover:rotate-2 transition-transform duration-500">
        <Image
          src={card.image}
          alt={card.name}
          fill
          sizes="48px"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Subtle shine overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-black tracking-tight truncate uppercase">{card.name}</p>
          <span className="text-[10px] font-black text-emerald-400 tabular-nums bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
            {card.change}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">{card.team}</p>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <p className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            card.type === 'Normal' ? 'text-zinc-400' :
              card.type === 'Oro' ? 'text-amber-400' :
                card.type === 'Plata' ? 'text-slate-300' : 'text-amber-700'
          )}>
            {card.type}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
