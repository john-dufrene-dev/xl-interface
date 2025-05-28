"use client"
import TopProduits from "@/components/statistiques/top-produits"
import { ExportButton } from "@/components/export-button"

export default function StatistiquesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analyse des produits</h1>
          <p className="text-muted-foreground">Explorez les performances de vos produits, catégories et marques</p>
        </div>
        <ExportButton />
      </div>

      <TopProduits />
    </div>
  )
}
