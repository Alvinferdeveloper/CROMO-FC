import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/navbar";
import { Providers } from "@/providers/query-provider";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaniniTrade 2026 - Completa tu álbum",
  description: "La comunidad de intercambio de cromos del mundial más activa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full antialiased",
        montserrat.className
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-8 mt-12 text-center text-sm text-muted-foreground bg-muted/30">
            <div className="container mx-auto px-4">
              <p className="font-semibold text-primary mb-2">PaniniTrade 2026</p>
              <p>© 2026. Hecho para coleccionistas reales.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
