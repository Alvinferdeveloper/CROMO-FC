'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'

export function ExploreSearchHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLocating, setIsLocating] = useState(false)
  const [query, setQuery] = useState(searchParams.get('search') || '')

  const debouncedQuery = useDebounce(query, 500)

  // ── AUTO SEARCH EFFECT ──
  useEffect(() => {
    const currentSearch = searchParams.get('search') || ''

    if (debouncedQuery !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString())
      if (debouncedQuery) params.set('search', debouncedQuery)
      else params.delete('search')

      startTransition(() => {
        router.push(`/explore?${params.toString()}`, { scroll: false })
      })
    }
  }, [debouncedQuery])

  const handleNearby = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('lat', position.coords.latitude.toString())
        params.set('lng', position.coords.longitude.toString())

        startTransition(() => {
          router.push(`/explore?${params.toString()}`)
          setIsLocating(false)
        })
      }, () => {
        alert('No pudimos obtener tu ubicación.')
        setIsLocating(false)
      })
    }
  }

  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1 relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-200" style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por jugador, equipo o número..."
          className="w-full h-11 pl-10 pr-28 rounded-xl border border-border bg-card text-sm font-medium outline-none transition-[box-shadow,border-color] duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/40"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          <Button
            disabled={isPending}
            size="sm"
            className="h-8 rounded-lg px-4 text-xs font-semibold active:scale-[0.97] transition-transform duration-150"
            style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Busqueda'}
          </Button>
        </div>
      </div>

      <Button
        onClick={handleNearby}
        disabled={isLocating}
        variant="outline"
        className="h-11 px-5 rounded-xl font-semibold gap-2 text-sm border-border hover:border-primary/30 hover:bg-primary/5 active:scale-[0.97] transition-[transform,border-color,background-color] duration-200"
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4 text-primary" />}
        Cerca de mí
      </Button>
    </div>
  )
}
