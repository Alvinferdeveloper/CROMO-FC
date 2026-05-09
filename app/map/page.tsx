import { MapClient } from '@/features/map/components/map-client'

export const metadata = {
  title: 'Mapa de Coleccionistas - PaniniTrade 2026',
  description: 'Encuentra cromos disponibles cerca de tu ubicación',
}

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MapClient />
    </div>
  )
}
