'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MiniMapViewProps {
  lat: number
  lng: number
  imageUrl: string | null
  playerName: string
  teamName: string
}

const createMiniCardIcon = (imageUrl: string | null) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="group relative">
        <div class="w-12 h-16 bg-white p-0.5 rounded-lg shadow-xl border-2 border-white overflow-hidden transform -rotate-6 transition-all duration-300 ring-1 ring-black/5">
          ${imageUrl
        ? `<img src="${imageUrl}" class="w-full h-full object-cover rounded-md" />`
        : `<div class="w-full h-full bg-muted flex items-center justify-center text-[6px] font-bold text-muted-foreground uppercase">Sin foto</div>`
      }
        </div>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-b border-r border-black/10"></div>
      </div>
    `,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
  })
}

export default function MiniMapView({ lat, lng, imageUrl, playerName, teamName }: MiniMapViewProps) {
  const position: [number, number] = [lat, lng]

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden z-0">
      <MapContainer
        center={position}
        zoom={8}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={createMiniCardIcon(imageUrl)}>
          <Popup className="custom-popup">
            <div className="space-y-1">
              <h3 className="font-bold leading-none text-xs">{playerName}</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-bold">{teamName}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
