"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface ExportButtonProps {
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
}

export function ExportButton({ className, variant = "outline", size = "default", onClick }: ExportButtonProps) {
  const handleExport = () => {
    // Dans une implémentation réelle, cette fonction exporterait les données au format CSV
    console.log("Exporting data to CSV...")
    if (onClick) onClick()
  }

  return (
    <Button variant={variant} size={size} onClick={handleExport} className={className}>
      <FileDown className="mr-2 h-4 w-4" />
      Exporter CSV
    </Button>
  )
}
