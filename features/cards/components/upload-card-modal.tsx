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
        <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="">
            <UploadCardForm onSuccess={() => setOpen(false)} />
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}