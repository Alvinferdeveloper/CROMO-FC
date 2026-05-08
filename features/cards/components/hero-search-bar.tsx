'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'

export function HeroSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('search', search)
    else params.delete('search')
    startTransition(() => { router.push(`/?${params.toString()}`) })
  }

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-2.5">
      <div className="flex items-center w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-5 pr-1.5 py-1.5 shadow-2xl transition-all duration-200 focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/15">
        <Search className="shrink-0 w-5 h-5 text-white/60 mr-3" />
        <input
          type="text"
          placeholder="Buscar jugador, equipo o número de cromo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent border-none outline-none text-white font-medium text-base placeholder:text-white/40"
        />
        <button
          onClick={handleSearch}
          disabled={isPending}
          className="shrink-0 h-11 px-7 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/40 hover:-translate-y-px hover:shadow-emerald-500/55 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : 'Buscar'}
        </button>
      </div>
      <p className="text-xs text-white/40 font-medium">
        💡 Prueba con &quot;Messi&quot;, &quot;Argentina&quot; o &quot;#42&quot;
      </p>
    </div>
  )
}
