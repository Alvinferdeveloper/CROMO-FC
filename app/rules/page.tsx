import { siteConfig } from "@/lib/config";
import { ShieldCheck, Scale, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Reglas de Intercambio",
  description: `Guía y normas para un intercambio seguro en ${siteConfig.name}.`,
};

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Reglas de Intercambio
          </h1>
          <p className="text-muted-foreground text-lg">
            Queremos que completar tu álbum sea una experiencia divertida y segura. Sigue estas normas para garantizar un intercambio exitoso.
          </p>
        </div>

        <div className="grid gap-8">
          <section className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight">Seguridad Primero</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Siempre realiza los intercambios en lugares públicos y concurridos. Si eres menor de edad, asiste siempre acompañado por un adulto.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <Scale className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight">Trato Justo</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              El valor de un cromo es subjetivo, pero recomendamos intercambios de rarezas similares (Normal por Normal, Oro por Oro) a menos que ambas partes acuerden lo contrario.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <CheckCircle className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight">Estado del Cromo</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Sé honesto sobre el estado físico de tus cromos. Las fotos deben ser reales y mostrar claramente cualquier detalle o imperfección.
            </p>
          </section>

          <section className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold italic uppercase tracking-tight">Prohibiciones</h2>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Prohibido el comportamiento abusivo o acoso hacia otros coleccionistas.</li>
              <li>No publicar contenido no relacionado con el coleccionismo de cromos.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
