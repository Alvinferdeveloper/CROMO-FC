import { Search, MapPin, Sparkles, ArrowRight, User as UserIcon, CheckCircle2 } from "lucide-react"

export interface OnboardingStep {
  label: string
  title: string
  desc: string
  accent: string
  imageText: string
  visual: React.ReactNode
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    label: "BIENVENIDO",
    title: "Tu camino al álbum completo",
    desc: "Únete a la red más grande de coleccionistas. Aquí, cada cromo repetido es una oportunidad de completar tu historia.",
    accent: "from-emerald-500/20 to-emerald-500/5",
    imageText: "COMPLETA",
    visual: (
      <div className="relative w-32 h-44 bg-white dark:bg-zinc-800 border-2 border-emerald-500/30 rounded-2xl shadow-2xl transform rotate-3 flex flex-col overflow-hidden">
        <div className="h-1/2 bg-emerald-500/10 w-full" />
        <div className="flex-1 p-3 space-y-2">
          <div className="w-3/4 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full" />
          <div className="w-1/2 h-2 bg-slate-100 dark:bg-zinc-700/50 rounded-full" />
        </div>
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-[scan_3s_ease-in-out_infinite]" />
      </div>
    )
  },
  {
    label: "DESCUBRE",
    title: "Busca con inteligencia",
    desc: "Filtra por número, país o equipo. Encuentra exactamente lo que te falta en segundos, sin complicaciones.",
    accent: "from-blue-500/20 to-blue-500/5",
    imageText: "BUSCA",
    visual: (
      <div className="relative h-40 w-40 flex items-center justify-center">
        <div className="absolute w-full h-full border border-blue-500/20 rounded-full animate-[radar_4s_linear_infinite]" />
        <div className="absolute w-2/3 h-2/3 border border-blue-500/30 rounded-full animate-[radar_4s_linear_infinite_1s]" />
        <div className="relative w-14 h-20 bg-white dark:bg-zinc-800 border-2 border-blue-500/30 rounded-xl shadow-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    )
  },
  {
    label: "CERCANÍA",
    title: "Cambios a la vuelta",
    desc: "Priorizamos a los coleccionistas de tu barrio. El intercambio ideal está más cerca de lo que imaginas.",
    accent: "from-rose-500/20 to-rose-500/5",
    imageText: "MAPA",
    visual: (
      <div className="relative h-40 w-40 flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-rose-500/5 rounded-full animate-pulse" />
        <div className="relative z-10 w-16 h-16 bg-white dark:bg-zinc-800 rounded-full shadow-2xl flex items-center justify-center border-2 border-rose-500/20">
          <MapPin className="w-8 h-8 text-rose-500" />
        </div>
        <div className="absolute bottom-0 w-24 h-4 bg-black/5 blur-xl rounded-full" />
      </div>
    )
  },
  {
    label: "CONECTA",
    title: "Trato directo y real",
    desc: "Sin intermediarios. Coordina por WhatsApp o Instagram y haz el cambio en persona de forma segura.",
    accent: "from-emerald-500/20 to-emerald-500/5",
    imageText: "CHAT",
    visual: (
      <div className="relative h-44 w-44 flex items-center justify-center">
        <div className="absolute w-24 h-32 bg-white dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 rounded-xl shadow-lg -translate-x-8 -rotate-12 animate-[swap-left_4s_ease-in-out_infinite]" />
        <div className="absolute w-24 h-32 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl shadow-xl translate-x-8 rotate-12 z-10 animate-[swap-right_4s_ease-in-out_infinite]" />
        <div className="absolute z-20 bg-white dark:bg-zinc-900 rounded-full p-2 shadow-xl border border-slate-100 dark:border-zinc-800">
          <ArrowRight className="w-5 h-5 text-emerald-500" />
        </div>
      </div>
    )
  },
  {
    label: "IDENTIDAD",
    title: "Tu carta de presentación",
    desc: "Completa tu perfil para que otros coleccionistas confíen en ti. Una buena reputación es clave para mejores intercambios.",
    accent: "from-slate-500/20 to-slate-500/5",
    imageText: "PERFIL",
    visual: (
      <div className="relative h-44 w-44 flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-slate-500/5 rounded-full animate-pulse" />
        <div className="relative z-10 w-24 h-32 bg-white dark:bg-zinc-800 border-2 border-slate-900/10 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col items-center p-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-700 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div className="w-full space-y-2">
            <div className="w-full h-2 bg-slate-100 dark:bg-zinc-700 rounded-full" />
            <div className="w-2/3 h-2 bg-slate-50 dark:bg-zinc-700/50 rounded-full" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 z-20 w-10 h-10 bg-emerald-500 rounded-full shadow-lg flex items-center justify-center border-4 border-white dark:border-zinc-900">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
      </div>
    )
  }
]
