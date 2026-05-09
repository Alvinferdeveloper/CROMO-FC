'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (country) params.set('country', country)
    else params.delete('country')
    if (city) params.set('city', city)
    else params.delete('city')
    startTransition(() => { router.push(`/?${params.toString()}`) })
  }

  const hasLocationFilters = searchParams.get('country') || searchParams.get('city')
  const hasSearch = searchParams.get('search')

  return (
    <div className="w-full max-w-5xl mx-auto mb-2 space-y-3">
      {/* Toggle row */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-muted-foreground text-sm font-semibold transition-all hover:border-primary/50 hover:text-foreground hover:bg-accent',
            isOpen && 'border-primary text-foreground bg-accent'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrar por ubicación
          {hasLocationFilters && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          )}
        </button>

        {(hasSearch || hasLocationFilters) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setCountry(''); setCity(''); router.push('/') }}
            className="text-xs text-muted-foreground hover:text-destructive gap-1"
          >
            <X className="h-3 w-3" /> Limpiar todo
          </Button>
        )}
      </div>

      {/* Expandable filters */}
      <div className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 pt-2 pb-2 px-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="País..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ciudad o zona..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <Button onClick={applyFilters} disabled={isPending} size="sm" className="h-11 rounded-xl px-6 font-bold">
            {isPending ? '...' : 'Aplicar'}
          </Button>
        </div>
      </div>

      {/* Active chips */}
      {(hasSearch || hasLocationFilters) && (
        <div className="flex flex-wrap gap-2">
          {hasSearch && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              🔍 &quot;{searchParams.get('search')}&quot;
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => {
                const p = new URLSearchParams(searchParams.toString())
                p.delete('search')
                router.push(`/?${p.toString()}`)
              }} />
            </span>
          )}
          {searchParams.get('country') && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              📍 {searchParams.get('country')}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => {
                setCountry('')
                const p = new URLSearchParams(searchParams.toString())
                p.delete('country')
                router.push(`/?${p.toString()}`)
              }} />
            </span>
          )}
          {searchParams.get('city') && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              🏙️ {searchParams.get('city')}
              <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => {
                setCity('')
                const p = new URLSearchParams(searchParams.toString())
                p.delete('city')
                router.push(`/?${p.toString()}`)
              }} />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
