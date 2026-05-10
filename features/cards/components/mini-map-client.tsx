'use client'

import dynamic from 'next/dynamic'

const MiniMapView = dynamic(() => import('./mini-map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-xl animate-pulse border border-border">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
})

interface MiniMapClientProps {
  lat: number
  lng: number
  imageUrl: string | null
  playerName: string
  teamName: string
}

export function MiniMapClient(props: MiniMapClientProps) {
  return <MiniMapView {...props} />
}
