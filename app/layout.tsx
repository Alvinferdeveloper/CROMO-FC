import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/navbar";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        geistSans.variable,
        geistMono.variable,
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8 mt-12 text-center text-sm text-muted-foreground bg-muted/30">
          <div className="container mx-auto px-4">
            <p className="font-semibold text-primary mb-2">PaniniTrade 2026</p>
            <p>© 2026. Hecho para coleccionistas reales.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
