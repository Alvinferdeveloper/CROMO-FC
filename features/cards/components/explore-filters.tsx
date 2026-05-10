'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, MapPin, SlidersHorizontal, Globe } from 'lucide-react'

const TEAMS = ['Argentina', 'México', 'EE.UU.', 'Canadá', 'España']
const RARITIES = ['Legendarios', 'Brillantes', 'Normales']

export function ExploreFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('search', search)
    else params.delete('search')
    if (country) params.set('country', country)
    else params.delete('country')
    if (city) params.set('city', city)
    else params.delete('city')
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filtros
        </h3>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Ubicación</p>
        <div className="space-y-2.5">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Cualquier país" 
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-card text-sm outline-none transition-[box-shadow,border-color] duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/40"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
            <input 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cualquier ciudad" 
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-card text-sm outline-none transition-[box-shadow,border-color] duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/40"
              style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
            />
          </div>
        </div>
      </div>

      {/* Team Filter */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Selección</p>
        <div className="flex flex-wrap gap-1.5">
          {TEAMS.map((team, i) => (
            <button 
              key={team}
              onClick={() => {setSearch(team); applyFilters()}}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:border-primary/40 hover:text-primary hover:bg-primary/5 active:scale-[0.96] transition-[transform,border-color,color,background-color] duration-200"
              style={{ 
                transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
                animationDelay: `${i * 40}ms`
              }}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">Rareza</p>
        <div className="space-y-2">
          {RARITIES.map((rarity) => (
            <label key={rarity} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary" 
              />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                {rarity}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Button 
          onClick={applyFilters} 
          className="w-full h-10 rounded-xl text-sm font-semibold active:scale-[0.97] transition-transform duration-150"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          Aplicar filtros
        </Button>
        
        <button
          onClick={() => {setSearch(''); setCountry(''); setCity(''); router.push('/explore')}}
          className="w-full py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 text-center"
        >
          Limpiar todos
        </button>
      </div>
    </div>
  )
}
