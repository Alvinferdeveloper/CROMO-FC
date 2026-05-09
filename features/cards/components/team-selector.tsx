'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Shield } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { WORLD_CUP_TEAMS } from "../hooks/use-teams"

interface TeamSelectorProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function TeamSelector({ value, onChange, error }: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full h-12 justify-between rounded-xl bg-slate-100 dark:bg-zinc-900 border-transparent hover:bg-slate-200 transition-all font-semibold",
            error && "border-red-500",
            !value && "text-slate-400"
          )}
        >
          <div className="flex items-center gap-3">
            <Shield className={cn("h-4 w-4", value ? "text-emerald-500" : "text-slate-400")} />
            {value || "Seleccionar equipo..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-slate-200 dark:border-zinc-800 shadow-2xl">
        <Command>
          <CommandInput placeholder="Buscar selección..." className="h-11" />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No se encontró la selección.</CommandEmpty>
            <CommandGroup>
              {WORLD_CUP_TEAMS.map((team) => (
                <CommandItem
                  key={team}
                  value={team}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : team)
                    setOpen(false)
                  }}
                  className="h-11 cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-emerald-500",
                      value === team ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {team}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
