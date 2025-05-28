"use client"

import { ExportButton } from "@/components/export-button"
import AnalyseRecherche from "@/components/statistiques/analyse-recherche"

export default function AnalyseRecherchePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse de la recherche</h1>
          <p className="text-muted-foreground">
            Explorez les tendances de recherche et identifiez les opportunités d'amélioration
          </p>
        </div>
        <ExportButton />
      </div>

      <AnalyseRecherche />
    </div>
  )
}
