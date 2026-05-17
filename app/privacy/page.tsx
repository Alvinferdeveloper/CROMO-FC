import { siteConfig } from "@/lib/config";
import { Lock, EyeOff, Server, FileText } from "lucide-react";

export const metadata = {
  title: "Privacidad",
  description: `Política de privacidad y manejo de datos de ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Privacidad y Datos
          </h1>
          <p className="text-muted-foreground text-lg">
            En {siteConfig.name}, nos tomamos muy en serio la seguridad de tu información. Aquí te explicamos qué datos recolectamos y cómo los protegemos.
          </p>
        </div>

        <div className="space-y-12">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <Lock className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight text-foreground">¿Qué datos recolectamos?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Para que puedas intercambiar cromos, necesitamos información básica como tu nombre, correo electrónico y ubicación (ciudad). Esta información es necesaria para que otros coleccionistas puedan encontrarte y contactarte.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <EyeOff className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight text-foreground">Visibilidad de Datos</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tu correo electrónico nunca es visible públicamente. Solo los métodos de contacto que tú decidas compartir (como WhatsApp o Instagram) serán visibles para otros usuarios registrados que deseen realizar un intercambio.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <Server className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight text-foreground">Ubicación Precisa</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Cuando compartes tu ubicación exacta en un cromo, esta solo se utiliza para mostrar el cromo en el mapa y calcular distancias. No rastreamos tu ubicación en tiempo real ni compartimos tu dirección exacta.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <FileText className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight text-foreground">Tus Derechos</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tienes derecho a acceder, corregir o eliminar tus datos en cualquier momento desde tu perfil. Si decides darte de baja, eliminaremos toda tu información personal de nuestros servidores de forma permanente.
            </p>
          </section>

          <div className="pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              Última actualización: 15 de mayo de 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
