"use client"
import { useState } from "react"
import AnalyseEvolutiveProduits from "@/components/statistiques/analyse-evolutive-produits"
import { ExportButton } from "@/components/export-button"

export default function AnalyseProduitsPage() {
  const [selectedSite, setSelectedSite] = useState("1")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse évolutive des produits</h1>
          <p className="text-muted-foreground">Suivez les modifications de stock et de prix de vos produits</p>
        </div>
        <ExportButton />
      </div>

      <AnalyseEvolutiveProduits initialSite={selectedSite} onSiteChange={setSelectedSite} />
    </div>
  )
}
