'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-muted/20">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="font-bold text-muted-foreground tracking-tight">Preparando mapa...</p>
      </div>
    </div>
  )
})

export function MapClient({ userLocation }: { userLocation?: { lat: number, lng: number } | null }) {
  return <MapView userLocation={userLocation} />
}
