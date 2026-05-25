'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus, Trash2, Search, Star, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TeamSelector } from '@/features/cards/components/team-selector'
import { TEAMS } from '@/features/cards/hooks/use-teams'
import { addToWishlist, removeFromWishlist, getWishlist } from '../actions/wishlist-actions'
import { WishlistItem } from '../schemas/wishlist-schema'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function WishlistManager() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px'
  })

  // Form State
  const [playerName, setPlayerName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [rarity, setRarity] = useState<'Normal' | 'Bronce' | 'Plata' | 'Oro'>('Normal')

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    try {
      const { data, error } = await getWishlist(page, 12)
      
      if (error) {
        toast.error(error)
      } else if (data) {
        if (data.length === 0) {
          setHasMore(false)
        } else {
          setItems(prev => {
            // Filter out any duplicates by ID to be extra safe
            const newItems = data.filter(
              newItem => !prev.some(existing => existing.id === newItem.id)
            )
            return [...prev, ...newItems]
          })
          setPage(prev => prev + 1)
          setHasMore(data.length >= 12)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading, hasMore])

  // Initial load
  useEffect(() => {
    async function initialLoad() {
      setIsLoading(true)
      const { data, error } = await getWishlist(0, 12)
      if (error) {
        toast.error(error)
      } else if (data) {
        setItems(data)
        setPage(1)
        setHasMore(data.length >= 12)
      }
      setIsLoading(false)
    }
    initialLoad()
  }, [])

  // Infinite scroll load
  useEffect(() => {
    if (inView && hasMore && !isLoading && items.length >= 12) {
      loadMore()
    }
  }, [inView, hasMore, isLoading, items.length, loadMore])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName) return

    setIsAdding(true)
    const result = await addToWishlist({ playerName, teamName, rarity })

    if (result.success && result.data) {
      setItems(prev => [result.data as WishlistItem, ...prev])
      setPlayerName('')
      setTeamName('')
      toast.success('¡Añadido a tu Mazo de Deseos! ✨')
    } else {
      toast.error(result.error || 'Error al añadir')
    }
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    const previousItems = [...items]
    setItems(prev => prev.filter(item => item.id !== id))

    const result = await removeFromWishlist(id)
    if (!result.success) {
      setItems(previousItems)
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── ADD SECTION ── */}
      <div className="relative">
        <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xl" />
        <div className="relative p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h3 className="text-md font-bold uppercase tracking-tight text-primary">¿Qué cromo buscas?</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Añade faltantes para activar matches</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Nombre del jugador..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-blue-500/20 dark:border-zinc-800 outline-none transition-all font-semibold text-sm"
                />
              </div>
            </div>

            <div className="relative z-50">
              <TeamSelector
                value={teamName}
                onChange={setTeamName}
              />
            </div>

            <Button
              disabled={isAdding || !playerName}
              className="h-11 rounded-xl cursor-pointer font-black uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-[0.97] transition-all"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Añadir al mazo'}
            </Button>
          </form>
        </div>
      </div>

      {/* ── LIST SECTION ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tu Mazo de Deseos ({items.length})</h4>
        </div>

        {items.length === 0 && !isLoading ? (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-[2.5rem]">
            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-300">
              <Plus className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight">Tu lista está vacía</p>
            <p className="text-xs text-zinc-500 mt-1">Añade los cromos que te faltan para encontrarlos más rápido.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.02 }}
                  className="group relative p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-blue-500/40 dark:border-zinc-800  transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
                        {item.player_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.team_name && (
                          (() => {
                            const teamData = TEAMS.find(t => t.name === item.team_name)
                            return teamData ? (
                              <img
                                src={`https://flagcdn.com/w20/${teamData.iso}.png`}
                                alt=""
                                className="w-3.5 h-auto rounded-[1px] opacity-80"
                              />
                            ) : null
                          })()
                        )}
                        <span className="text-[10px] font-bold text-zinc-400 uppercase truncate">
                          {item.team_name || 'Cualquier equipo'}
                        </span>
                        {item.rarity && item.rarity !== 'Normal' && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-widest",
                              item.rarity === 'Oro' ? 'text-amber-500' :
                                item.rarity === 'Plata' ? 'text-slate-400' : 'text-amber-800'
                            )}>
                              {item.rarity}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 cursor-pointer group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Sentinel for Infinite Scroll */}
        <div ref={ref} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-zinc-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Cargando deseos...</span>
            </div>
          )}
          {!hasMore && items.length > 0 && (
            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Fin de tu mazo</p>
          )}
        </div>
      </div>

      {/* ── INFO FOOTER ── */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[11px] font-medium leading-relaxed text-blue-600 dark:text-blue-400">
          Tu Mazo de Deseos se usa para resaltar cromos en el mercado. Cuando alguien publique uno de estos jugadores, verás un distintivo especial de "MATCH".
        </p>
      </div>
    </div>
  )
}
