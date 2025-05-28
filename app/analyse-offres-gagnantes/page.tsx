"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { FilterBar } from "@/components/filter-bar"
import { AnalyseOffresGagnantes } from "@/components/statistiques/analyse-offres-gagnantes"
import { ExportButton } from "@/components/export-button"

export default function AnalyseOffresGagnantesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState<string>("all")

  const handleReset = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)
    setDateRange({ from: sevenDaysAgo, to: today })
    setSelectedSite("all")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse des offres gagnantes</h1>
          <p className="text-muted-foreground">
            Comparez les prix entre les différents sites et identifiez les meilleures offres
          </p>
        </div>
        <ExportButton />
      </div>

      <FilterBar
        onDateChange={setDateRange}
        onSiteChange={setSelectedSite}
        onReset={handleReset}
        dateValue={dateRange}
        siteValue={selectedSite}
      />

      <AnalyseOffresGagnantes dateRange={dateRange} site={selectedSite} />
    </div>
  )
}
