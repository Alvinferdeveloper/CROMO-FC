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
import { TEAMS } from "../hooks/use-teams"

interface TeamSelectorProps {
  value: string
  onChange: (value: string, code: string) => void
  error?: boolean
}

/**
 * High-quality Team Selector using professional SVG flags from FlagCDN.
 */
export function TeamSelector({ value, onChange, error }: TeamSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Find the selected team object to show its flag
  const selectedTeam = TEAMS.find(t => t.name === value)

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
            {selectedTeam ? (
              <img
                src={`https://flagcdn.com/w40/${selectedTeam.iso}.png`}
                alt={selectedTeam.name}
                className="w-5 h-auto rounded-sm shadow-sm"
              />
            ) : (
              <Shield className={cn("h-4 w-4", value ? "text-primary" : "text-muted-foreground")} />
            )}
            <span className="truncate">{value || "Seleccionar equipo..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl border border-border shadow-2xl bg-popover overflow-hidden z-10000">
        <Command>
          <CommandInput placeholder="Buscar selección..." className="h-11" />
          <CommandList className="max-h-[300px] custom-scrollbar">
            <CommandEmpty>No se encontró la selección.</CommandEmpty>
            <CommandGroup>
              {TEAMS.map((team) => (
                <CommandItem
                  key={team.name}
                  value={team.name}
                  onSelect={() => {
                    onChange(team.name, team.code)
                    setOpen(false)
                  }}
                  className="h-11 cursor-pointer font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w40/${team.iso}.png`}
                      alt={team.name}
                      className="w-5 h-auto rounded-sm shadow-sm"
                    />
                    <span>{team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground/60 tracking-widest uppercase">{team.code}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-primary",
                        value === team.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
