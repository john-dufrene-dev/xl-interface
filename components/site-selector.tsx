"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

const sites = [
  { value: "1", label: "Site 1" },
  { value: "2", label: "Site 2" },
  { value: "3", label: "Site 3" },
  { value: "4", label: "Site 4" },
]

interface SiteSelectorProps {
  onChange: (value: string) => void
  value: string
}

export function SiteSelector({ onChange, value }: SiteSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div
          className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          onClick={() => setOpen(!open)}
          role="combobox"
          aria-expanded={open}
        >
          <span>
            {value && value !== "all" ? sites.find((site) => site.value === value)?.label : "Sélectionner un site"}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un site..." className="text-xs" />
          <CommandList>
            <CommandEmpty>Aucun site trouvé.</CommandEmpty>
            <CommandGroup>
              {sites.map((site) => (
                <CommandItem
                  key={site.value}
                  value={site.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <Check className={cn("mr-1 h-3.5 w-3.5", value === site.value ? "opacity-100" : "opacity-0")} />
                  {site.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
