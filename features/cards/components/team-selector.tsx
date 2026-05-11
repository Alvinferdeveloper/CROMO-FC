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
            "w-full h-12 justify-between rounded-xl bg-muted border-transparent hover:bg-accent hover:border-border font-semibold active:scale-[0.97] transition-[transform,background-color,border-color] duration-200",
            error && "border-red-500 hover:border-red-500",
            !value && "text-muted-foreground"
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          <div className="flex items-center gap-3">
            <Shield className={cn("h-4 w-4", value ? "text-primary" : "text-muted-foreground")} />
            {value || "Seleccionar equipo..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border border-border shadow-2xl bg-popover overflow-hidden">
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
                  className="h-11 cursor-pointer font-medium"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
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
