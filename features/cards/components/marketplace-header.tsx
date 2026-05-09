import { MapPin, Sparkles, ListFilter } from 'lucide-react'

interface MarketplaceHeaderProps {
  count: number
  hasActiveFilters: boolean
  userCity?: string | null
}

export function MarketplaceHeader({ count, hasActiveFilters, userCity }: MarketplaceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-col gap-1.5">

        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            {hasActiveFilters ? (
              <>
                <ListFilter className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                Resultados de búsqueda
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                Explorar cromos
              </>
            )}
          </h2>

          {!hasActiveFilters && userCity && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              Cerca de {userCity}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {count > 0 ? (
            <>
              Mostrando <span className="text-slate-700 dark:text-slate-200 font-bold">{count}</span> {count === 1 ? 'cromo disponible' : 'cromos disponibles'}
            </>
          ) : (
            'No se encontraron cromos con estos filtros.'
          )}
        </p>

      </div>
    </div>
  )
}