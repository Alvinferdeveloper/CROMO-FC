'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Runtime Error:', error)
  }, [error])

  return (
    <div className="flex flex-col mt-16 items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full" />
        <AlertCircle className="h-24 w-24 text-destructive relative z-10" />
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-4 text-foreground">
        ¡Vaya! Algo salió mal
      </h1>

      <p className="text-muted-foreground max-w-md mb-10 text-lg leading-relaxed">
        Ha ocurrido un error inesperado en la comunidad.
        Estamos trabajando para arreglarlo lo antes posible.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          size="lg"
          className="rounded-2xl font-bold px-8 active:scale-95 transition-transform"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Intentar de nuevo
        </Button>

        <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold px-8 border-border active:scale-95 transition-transform">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Ir al Inicio
          </Link>
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-12 p-4 bg-muted rounded-xl text-xs text-left overflow-auto max-w-full border border-border">
          {error.message}
        </pre>
      )}
    </div>
  )
}
