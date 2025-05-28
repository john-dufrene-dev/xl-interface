"use client"

import { ExportButton } from "@/components/export-button"
import AnalyseCA from "@/components/statistiques/analyse-ca"

export default function AnalyseCAPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse des ventes</h1>
          <p className="text-muted-foreground">
            Explorez les performances de vos ventes, CA Total HT, panier moyen HT et livraisons
          </p>
        </div>
        <ExportButton />
      </div>

      <AnalyseCA />
    </div>
  )
}
