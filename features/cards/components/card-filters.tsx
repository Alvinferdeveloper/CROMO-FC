'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Search, MapPin, X, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CardFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (search) params.set('search', search)
    else params.delete('search')
    
    if (country) params.set('country', country)
    else params.delete('country')
    
    if (city) params.set('city', city)
    else params.delete('city')

    startTransition(() => {
      router.push(`/?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSearch('')
    setCountry('')
    setCity('')
    router.push('/')
  }

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar jugador o equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-12 pl-10 pr-4 rounded-2xl border bg-card shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        <Button 
          variant={isOpen ? "secondary" : "outline"} 
          className="h-12 w-12 rounded-2xl p-0 md:w-auto md:px-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">Filtros</span>
        </Button>
        <Button onClick={handleSearch} disabled={isPending} className="h-12 rounded-2xl px-6 font-bold shadow-lg shadow-primary/20">
          {isPending ? '...' : 'Buscar'}
        </Button>
      </div>

      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
      )}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="País..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ciudad o zona..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border bg-card outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {(searchParams.get('search') || searchParams.get('country') || searchParams.get('city')) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {searchParams.get('search') && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              &quot;{searchParams.get('search')}&quot; <X className="h-3 w-3 cursor-pointer" onClick={() => {setSearch(''); router.push('/')}} />
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive">
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
