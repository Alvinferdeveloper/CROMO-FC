'use client'

import { useEffect, useState } from 'react'
import { CardFeed } from './card-feed'
import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SmartFeedContainerProps {
  initialCards: any[]
  search?: string
  userCity?: string
}

export function SmartFeedContainer({ initialCards, search, userCity }: SmartFeedContainerProps) {
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const handleGetLocation = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        }
      )
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
            {search ? 'Tu búsqueda' : 'Explorar Mercado'}
            {!search && (userCity || coords) && (
              <span className="text-xs font-black px-4 py-1.5 rounded-full bg-primary text-primary-foreground flex items-center gap-1.5 shadow-lg shadow-primary/20">
                <MapPin className="h-3 w-3" /> 
                {coords ? 'PRECISIÓN GPS ACTIVA' : `CERCA DE ${userCity?.toUpperCase()}`}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground font-bold mt-1 uppercase tracking-widest opacity-60">
            {coords ? 'Ordenado por distancia real' : 'Desliza para ver más cromos'}
          </p>
        </div>

        {!coords && (
          <Button 
            onClick={handleGetLocation} 
            disabled={isLocating}
            variant="outline"
            size="sm"
            className="rounded-full font-bold border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <Navigation className="mr-2 h-4 w-4" />
            {isLocating ? 'Ubicando...' : 'Mejorar precisión (GPS)'}
          </Button>
        )}
      </div>

      <CardFeed 
        initialCards={initialCards} 
        search={search}
        lat={coords?.lat}
        lng={coords?.lng}
        userCity={userCity}
      />
    </div>
  )
}
