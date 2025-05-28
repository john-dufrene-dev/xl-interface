import type { Metadata } from "next"
import AnniversaireAutomation from "@/components/automation/anniversaire"

export const metadata: Metadata = {
  title: "Automation Anniversaire | Dashboard E-commerce",
  description: "Gestion des scénarios d'emails d'anniversaire pour vos clients",
}

export default function AnniversairePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Anniversaire</h2>
      </div>
      <AnniversaireAutomation />
    </div>
  )
}
