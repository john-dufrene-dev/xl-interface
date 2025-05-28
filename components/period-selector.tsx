"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subWeeks, subDays, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

const periods = [
  { value: "today", label: "Aujourd'hui" },
  { value: "yesterday", label: "Hier" },
  { value: "this-week", label: "Cette semaine (Depuis Dim)" },
  { value: "last-week", label: "La semaine dernière (Dim - Sam)" },
  { value: "last-7-days", label: "Les 7 derniers jours" },
  { value: "last-28-days", label: "Les 28 derniers jours" },
  { value: "last-30-days", label: "Les 30 derniers jours" },
  { value: "last-90-days", label: "Les 90 derniers jours" },
  { value: "last-12-months", label: "Les 12 derniers mois" },
]

interface PeriodSelectorProps {
  onChange: (dateRange: DateRange | undefined) => void
  value: string
}

export function PeriodSelector({ onChange, value }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false)

  const handlePeriodChange = (periodValue: string) => {
    const today = new Date()
    let from: Date | undefined
    let to: Date | undefined

    switch (periodValue) {
      case "today":
        from = startOfDay(today)
        to = endOfDay(today)
        break
      case "yesterday":
        from = startOfDay(subDays(today, 1))
        to = endOfDay(subDays(today, 1))
        break
      case "this-week":
        from = startOfWeek(today, { locale: fr })
        to = endOfDay(today)
        break
      case "last-week":
        from = startOfWeek(subWeeks(today, 1), { locale: fr })
        to = endOfWeek(subWeeks(today, 1), { locale: fr })
        break
      case "last-7-days":
        from = startOfDay(subDays(today, 6))
        to = endOfDay(today)
        break
      case "last-28-days":
        from = startOfDay(subDays(today, 27))
        to = endOfDay(today)
        break
      case "last-30-days":
        from = startOfDay(subDays(today, 29))
        to = endOfDay(today)
        break
      case "last-90-days":
        from = startOfDay(subDays(today, 89))
        to = endOfDay(today)
        break
      case "last-12-months":
        from = startOfDay(subMonths(today, 12))
        to = endOfDay(today)
        break
      default:
        from = undefined
        to = undefined
    }

    onChange(from && to ? { from, to } : undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-[180px] justify-between text-xs"
        >
          {value ? periods.find((period) => period.value === value)?.label : "Sélectionner une période"}
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une période..." className="text-xs" />
          <CommandList>
            <CommandEmpty>Aucune période trouvée.</CommandEmpty>
            <CommandGroup>
              {periods.map((period) => (
                <CommandItem
                  key={period.value}
                  value={period.value}
                  onSelect={(currentValue) => {
                    handlePeriodChange(currentValue)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <Check className={cn("mr-1 h-3.5 w-3.5", value === period.value ? "opacity-100" : "opacity-0")} />
                  {period.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
