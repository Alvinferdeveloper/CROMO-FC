'use client'

import { Montserrat } from "next/font/google";
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const montserrat = Montserrat({
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es" className={montserrat.className}>
      <body className="bg-background text-foreground antialiased min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 mt-16">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Error Crítico del Sistema
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Lo sentimos, ha ocurrido un error estructural. Estamos intentando recuperar la conexión con la base de datos de cromos.
            </p>
          </div>

          <Button
            onClick={() => reset()}
            size="lg"
            className="w-full rounded-2xl font-bold active:scale-95 transition-transform"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Reiniciar Aplicación
          </Button>

          {process.env.NODE_ENV === 'development' && (
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Debug Info</p>
              <pre className="p-3 bg-muted rounded-lg text-[10px] overflow-auto border border-border">
                {error.message}
              </pre>
            </div>
          )}
        </div>
      </body>
    </html>
  )
}
