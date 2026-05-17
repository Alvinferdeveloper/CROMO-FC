import { siteConfig } from "@/lib/config";
import { MessageCircle, Mail, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Soporte",
  description: `Centro de ayuda y contacto de ${siteConfig.name}.`,
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container max-w-4xl mx-auto px-6">
        <div className="space-y-4 mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Centro de Ayuda
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ¿Tienes problemas con un intercambio o una duda técnica? Estamos aquí para ayudarte a completar tu colección.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-emerald-500/50 transition-colors">
            <Mail className="h-10 w-10 text-emerald-500" />
            <h2 className="text-xl font-bold italic uppercase tracking-tight">Correo Electrónico</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Escríbenos para temas legales, reportes graves o soporte técnico avanzado.
            </p>
            <p className="font-bold text-foreground">alvinfer67@gmail.com</p>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-4 hover:border-emerald-500/50 transition-colors">
            <MessageCircle className="h-10 w-10 text-emerald-500" />
            <h2 className="text-xl font-bold italic uppercase tracking-tight">Comunidad Discord</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La forma más rápida de obtener ayuda de otros coleccionistas y moderadores.
            </p>
            <Button asChild className="w-full rounded-xl font-bold gap-2">
              <a href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer">
                Unirse al Discord <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="h-6 w-6 text-emerald-500" />
            <h2 className="text-2xl font-black italic uppercase tracking-tight">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Es gratis usar la plataforma?",
                a: "Sí, el intercambio de cromos es y siempre será gratuito para nuestra comunidad."
              },
              {
                q: "¿Cómo reporto a un usuario?",
                a: "Puedes reportar a un usuario desde su perfil o enviándonos un correo con capturas de pantalla de la situación."
              },
              {
                q: "¿Qué hago si alguien no se presentó al intercambio?",
                a: "Te recomendamos calificar al usuario (próximamente) y reportar el incidente si hubo mala fe."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-muted/50 border border-border">
                <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
