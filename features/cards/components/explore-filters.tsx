'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, SlidersHorizontal, Globe, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TEAMS } from '../hooks/use-teams'
import { TeamSelector } from './team-selector'

const QUICK_TEAMS = ['Argentina', 'México', 'Estados Unidos', 'Brasil', 'España']
const RARITIES = ['Normal', 'Bronce', 'Plata', 'Oro']

export function ExploreFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [rarity, setRarity] = useState(searchParams.get('rarity') || '')

  const applyFilters = (overrides: { search?: string, country?: string, city?: string, rarity?: string } = {}) => {
    const params = new URLSearchParams(searchParams.toString())

    const finalSearch = 'search' in overrides ? overrides.search : search
    const finalCountry = 'country' in overrides ? overrides.country : country
    const finalCity = 'city' in overrides ? overrides.city : city
    const finalRarity = 'rarity' in overrides ? overrides.rarity : rarity

    if (finalSearch) params.set('search', finalSearch)
    else params.delete('search')

    if (finalCountry) params.set('country', finalCountry)
    else params.delete('country')

    if (finalCity) params.set('city', finalCity)
    else params.delete('city')

    if (finalRarity) params.set('rarity', finalRarity)
    else params.delete('rarity')

    router.push(`/explore?${params.toString()}`)
  }

  const handleRarityChange = (r: string) => {
    const nextRarity = rarity === r ? '' : r
    setRarity(nextRarity)
    applyFilters({ rarity: nextRarity })
  }

  const handleTeamClick = (team: string) => {
    const nextSearch = search === team ? '' : team
    setSearch(nextSearch)
    applyFilters({ search: nextSearch })
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
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ubicación</p>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Selección</p>
          <Shield className="h-3 w-3 text-muted-foreground/40" />
        </div>

        {/* Full Team Selector */}
        <div className="relative z-20">
          <TeamSelector
            value={search}
            onChange={(name) => handleTeamClick(name)}
          />
        </div>

        {/* Quick Selections */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {QUICK_TEAMS.map((team, i) => {
            const teamData = TEAMS.find(t => t.name === team)
            const isSelected = search === team

            return (
              <button
                key={team}
                onClick={() => handleTeamClick(team)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold active:scale-[0.96] transition-all duration-200
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5'
                    : 'border-border bg-card hover:border-primary/40 hover:text-primary hover:bg-primary/5 text-muted-foreground'
                  }
                `}
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                {teamData && (
                  <img
                    src={`https://flagcdn.com/w20/${teamData.iso}.png`}
                    alt=""
                    className={cn("w-3.5 h-auto rounded-[1px]", !isSelected && "grayscale opacity-70")}
                  />
                )}
                {team}
              </button>
            )
          })}
        </div>
      </div>

      {/* Rarity Filter */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Rareza</p>
        <div className="space-y-2">
          {RARITIES.map((r) => (
            <label key={r} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input
                type="checkbox"
                checked={rarity === r}
                onChange={() => handleRarityChange(r)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary cursor-pointer"
              />
              <span className={`text-sm font-semibold transition-colors duration-150 ${rarity === r ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {r}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Button
          onClick={() => applyFilters()}
          className="w-full h-11 rounded-xl text-sm font-bold active:scale-[0.97] shadow-lg shadow-primary/10 transition-all duration-150"
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          Aplicar filtros
        </Button>

        <button
          onClick={() => { setSearch(''); setCountry(''); setCity(''); setRarity(''); router.push('/explore') }}
          className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors duration-150 text-center"
        >
          Limpiar todos
        </button>
      </div>
    </div>
  )
}
