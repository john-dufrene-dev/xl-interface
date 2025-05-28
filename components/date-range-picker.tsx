"use client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  onChange: (date: DateRange | undefined) => void
  value: DateRange | undefined
}

export function DateRangePicker({ className, value, onChange }: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("h-9 w-[240px] justify-start text-left text-xs", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd MMMM yyyy", { locale: fr })} -{" "}
                  {format(value.to, "dd MMMM yyyy", { locale: fr })}
                </>
              ) : (
                format(value.from, "dd MMMM yyyy", { locale: fr })
              )
            ) : (
              <span>Sélectionner une période</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
