'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit3 } from "lucide-react"
import { EditCardForm } from "./edit-card-form"
import { useState } from "react"

interface EditCardModalProps {
  card: any
}

export function EditCardModal({ card }: EditCardModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 shrink-0 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
          title="Editar cromo"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:w-[90vw] lg:max-w-6xl p-0 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-2xl shadow-2xl shadow-black/20 overflow-hidden outline-none">
        <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-blue-500/10 via-blue-500/5 to-transparent pointer-events-none z-0" />

        <div className="relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <EditCardForm card={card} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
