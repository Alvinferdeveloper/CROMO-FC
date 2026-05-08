import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function MarketplaceEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-muted/60 flex items-center justify-center mb-5 text-4xl shadow-inner">
        🏟️
      </div>
      <h3 className="text-lg font-black mb-1.5">Sin resultados</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        Prueba con otros filtros o sé el primero en publicar un cromo en esta zona.
      </p>
      <Button asChild className="rounded-full px-8 h-10 text-sm font-bold">
        <Link href="/upload-card">Publicar cromo</Link>
      </Button>
    </div>
  )
}
