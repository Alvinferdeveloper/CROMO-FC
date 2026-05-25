# 🃏 Cromo FC 2026 — Completa tu Álbum

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-emerald?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Cromo FC** es la plataforma social definitiva diseñada para transformar la experiencia de coleccionar cromos del Mundial 2026. Conectamos la pasión del intercambio físico con la eficiencia del mundo digital, creando una comunidad global de coleccionistas reales.

---

## Propósito del Proyecto

Llenar un álbum es un reto personal, pero completarlo es un **logro colectivo**. Cromo FC nació al observar el caos de los grupos de redes sociales, donde miles de mensajes de intercambio se pierden en el feed. 

Nuestra misión es eliminar esa barrera invisible, permitiendo que los coleccionistas se encuentren, conecten y completen sus colecciones de forma segura, visual y local.

---

##  Características Principales

### 🗺️ Mercado Geolocalizado
Encuentra coleccionistas a la vuelta de tu esquina. Nuestra integración con mapas te permite ver qué cromos están disponibles en tu ciudad o zona, facilitando los intercambios cara a cara.

> ![Screenshot: Mapa de Coleccionistas](/public/doc/collectors.png)

### 🃏 Mazo de Deseos Inteligente (Wishlist)
No pierdas el tiempo buscando. Marca los cromos que te faltan y la plataforma te notificará automáticamente cuando alguien cercano suba una de tus cartas deseadas mediante nuestro sistema de **Fuzzy Matching**.

> ![Screenshot: Gestión de Wishlist](/public/doc/wishlist.png)

### 📸 Gestión de Inventario Visual
Sube tus repetidos en segundos. Un panel de control intuitivo y profesional donde puedes gestionar qué tienes disponible, marcar lo intercambiado y lucir tus cromos de **Oro, Plata y Bronce**.

> ![Screenshot: Mis Cromos](/public/doc/inventory.png)

### 🔗 Conectividad Directa
Una vez que encuentras un "Match", conecta al instante vía WhatsApp internacional o Instagram. Sin intermediarios, sin complicaciones.

---

## 🛠️ Stack Tecnológico

El proyecto está construido bajo los más altos estándares de desarrollo moderno:

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router) con **TypeScript**.
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL con RLS).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/).
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) para una experiencia fluida y orgánica.
- **Seguridad:** [Upstash Redis](https://upstash.com/) para Rate Limiting y protección DoS.
- **Imágenes:** Generación dinámica de metadatos Open Graph con `@vercel/og`.

---

## 📦 Instalación Local

Si deseas contribuir o probar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/panini-trade.git
   cd panini-trade
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` con tus llaves de Supabase y Upstash:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   UPSTASH_REDIS_REST_URL=tu_url
   UPSTASH_REDIS_REST_TOKEN=tu_token
   ```

4. **Correr el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🤝 Comunidad

Cromo FC es más que una herramienta; es un espacio seguro para coleccionistas. Te invitamos a leer nuestras [Reglas de Intercambio](/rules) y nuestra [Política de Privacidad](/privacy) dentro de la app.

Hecho con ❤️ para la comunidad futbolera del Mundial 2026.

---

*Nota: Cromo FC es un proyecto independiente y no está afiliado oficialmente con la FIFA ni con Panini S.p.A.*
