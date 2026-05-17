const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";

export const siteConfig = {
  name: "Cromo FC",
  description: "La comunidad de intercambio de cromos más activa. Completa tu álbum de 2026 de forma fácil y segura.",
  url: baseUrl,
  ogImage: `${baseUrl}/api/og`,
  links: {
    twitter: "#",
    github: "#",
    instagram: "#",
    discord: "https://discord.gg/JFFpg4xFpu",
  },
  keywords: [
    "panini",
    "trade",
    "intercambio de cromos",
    "mundial 2026",
    "completar álbum",
    "coleccionables",
  ],
};
