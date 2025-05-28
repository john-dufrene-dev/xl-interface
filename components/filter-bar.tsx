"use client"
import { useState, useEffect, useRef } from "react"
import type { DateRange } from "react-day-picker"
import { SiteSelector } from "@/components/site-selector"
import { Button } from "@/components/ui/button"
import { FilterX, Calendar, CalendarRange } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { PeriodSelector } from "@/components/period-selector"

interface FilterBarProps {
  onDateChange: (date: DateRange | undefined) => void
  onSiteChange: (site: string) => void
  onReset: () => void
  dateValue: DateRange | undefined
  siteValue: string
  showDateFilter?: boolean // Nouvelle prop
}

export function FilterBar({
  onDateChange,
  onSiteChange,
  onReset,
  dateValue,
  siteValue,
  showDateFilter = true, // Par défaut, on affiche les filtres de date
}: FilterBarProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last-7-days")
  const [datePickerMode, setDatePickerMode] = useState<"period" | "custom">("period")
  const [isFixed, setIsFixed] = useState(false)
  const filterBarRef = useRef<HTMLDivElement>(null)
  const [filterBarHeight, setFilterBarHeight] = useState(0)

  // Initialiser avec la période par défaut (7 derniers jours)
  useEffect(() => {
    if (!dateValue && datePickerMode === "period") {
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)
      today.setHours(23, 59, 59, 999)
      onDateChange({ from: sevenDaysAgo, to: today })
    }
  }, [])

  useEffect(() => {
    if (filterBarRef.current) {
      setFilterBarHeight(filterBarRef.current.offsetHeight)
    }

    const handleScroll = () => {
      if (filterBarRef.current) {
        const rect = filterBarRef.current.getBoundingClientRect()
        if (rect.top <= 0 && !isFixed) {
          setIsFixed(true)
        } else if (rect.top > 0 && isFixed) {
          setIsFixed(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isFixed])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDateChange(range)
    if (range) {
      setDatePickerMode("custom")
    }
  }

  const handleReset = () => {
    setDatePickerMode("period")
    setSelectedPeriod("last-7-days")
    onReset()
  }

  const filterBarContent = (
    <div className="flex flex-wrap items-center gap-2 px-4">
      {showDateFilter && (
        <>
          <Tabs
            value={datePickerMode}
            onValueChange={(value) => setDatePickerMode(value as "period" | "custom")}
            className="flex-shrink-0"
          >
            <TabsList className="h-9">
              <TabsTrigger value="period" className="text-xs px-2 py-1.5">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                Périodes prédéfinies
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs px-2 py-1.5">
                <CalendarRange className="mr-1 h-3.5 w-3.5" />
                Période personnalisée
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {datePickerMode === "period" ? (
            <PeriodSelector
              value={selectedPeriod}
              onChange={(range) => {
                onDateChange(range)
                if (range) {
                  handlePeriodChange(selectedPeriod)
                }
              }}
            />
          ) : (
            <DateRangePicker value={dateValue} onChange={handleDateRangeChange} />
          )}
        </>
      )}

      <SiteSelector value={siteValue} onChange={onSiteChange} />

      <Button variant="ghost" size="sm" onClick={handleReset} className="h-9 px-2 text-xs">
        <FilterX className="mr-1 h-3.5 w-3.5" />
        Réinitialiser
      </Button>
    </div>
  )

  return (
    <>
      {isFixed && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-950 py-3 border-b shadow-md"
          style={{
            width: "100vw",
            margin: 0,
            padding: "12px 0",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {filterBarContent}
        </div>
      )}
      <div ref={filterBarRef} className="py-3 mb-6 w-full bg-white dark:bg-gray-950">
        {filterBarContent}
      </div>
      {isFixed && <div style={{ height: filterBarHeight, marginBottom: "1.5rem" }} />}
    </>
  )
}
