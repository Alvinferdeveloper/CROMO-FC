'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Sparkles } from "lucide-react"
import { UploadCardForm } from "./upload-card-form"
import { useState } from "react"

interface UploadCardModalProps {
  trigger?: React.ReactNode
}

export function UploadCardModal({ trigger }: UploadCardModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* ── TRIGGER ── */}
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-full h-12 px-6 font-black text-sm sm:text-base gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/25 border-2 border-emerald-400/30 hover:scale-105 transition-all duration-300">
            <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
            PUBLICAR CROMO
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:w-[90vw] lg:max-w-6xl p-0 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-2xl shadow-2xl shadow-black/20 overflow-hidden outline-none">
        <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 max-h-[90vh] overflow-y-auto p-6 sm:p-10 lg:p-16 custom-scrollbar">
          <DialogHeader className="mb-10 flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/30">
              Nuevo Intercambio
            </div>

            <DialogTitle className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Publica tu repetida
            </DialogTitle>

            <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 font-medium max-w-2xl mt-1">
              Sube la foto, añade los detalles clave y prepárate para recibir ofertas de otros coleccionistas.
            </p>
          </DialogHeader>

          <div className="pb-4">
            <UploadCardForm onSuccess={() => setOpen(false)} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}