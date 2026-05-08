import { MapPin } from 'lucide-react'

interface MarketplaceHeaderProps {
  count: number
  hasActiveFilters: boolean
  userCity?: string | null
}

export function MarketplaceHeader({ count, hasActiveFilters, userCity }: MarketplaceHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-foreground">
          {hasActiveFilters ? 'Resultados' : 'Explorar cromos'}
          {!hasActiveFilters && userCity && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <MapPin className="h-2.5 w-2.5" />
              {userCity}
            </span>
          )}
        </h2>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {count > 0 ? `${count} cromos disponibles` : 'Sin resultados'}
        </p>
      </div>
    </div>
  )
}
