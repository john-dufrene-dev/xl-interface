import type { Metadata } from "next"
import RelancePaniers from "@/components/automation/relance-paniers"

export const metadata: Metadata = {
  title: "Relance Paniers | Dashboard E-commerce",
  description: "Gestion des scénarios de relance de paniers abandonnés",
}

export default function RelancePaniersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Relance Paniers</h2>
      </div>
      <RelancePaniers />
    </div>
  )
}
