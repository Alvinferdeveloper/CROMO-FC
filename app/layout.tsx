import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LayoutWrapper } from "@/components/shared/layout-wrapper";
import { Navbar } from "@/components/shared/navbar";
import { Providers } from "@/providers/query-provider";
import { OnboardingWrapper } from "@/components/shared/onboarding-wrapper";

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
          <OnboardingWrapper />
          <LayoutWrapper navbar={<Navbar />}>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
