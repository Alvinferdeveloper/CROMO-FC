import Link from 'next/link'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col mt-16 items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <FileQuestion className="h-24 w-24 text-primary relative z-10 animate-bounce" />
      </div>

      <h1 className="text-4xl font-black tracking-tighter mb-4 text-foreground">
        404 - ¡Cromo extraviado!
      </h1>

      <p className="text-muted-foreground max-w-md mb-10 text-lg leading-relaxed">
        Parece que la página que buscas no existe o ha sido intercambiada.
        No te preocupes, ¡todavía puedes completar tu álbum!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-2xl font-bold px-8 active:scale-95 transition-transform">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold px-8 border-border active:scale-95 transition-transform">
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Explorar Mercado
          </Link>
        </Button>
      </div>
    </div>
  )
}
