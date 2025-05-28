"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpDown, Tag, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { ExportButton } from "@/components/export-button"

// Types
type HistoriqueProduit = {
  id: string
  id_history: string
  id_product: string
  product_name: string
  field: string
  old_value: string
  new_value: string
  date_detected: string
  id_site: string
}

// Données de démonstration
const historiqueProduits: HistoriqueProduit[] = [
  {
    id: "1",
    id_history: "1",
    id_product: "1092",
    product_name: "Smartphone XYZ",
    field: "quantity",
    old_value: "15",
    new_value: "11",
    date_detected: "2023-05-15T10:30:00",
    id_site: "1",
  },
  {
    id: "2",
    id_history: "2",
    id_product: "2106",
    product_name: "Coque de protection",
    field: "quantity",
    old_value: "44",
    new_value: "41",
    date_detected: "2023-05-14T14:20:00",
    id_site: "1",
  },
  {
    id: "3",
    id_history: "3",
    id_product: "2137",
    product_name: "Écouteurs sans fil",
    field: "quantity",
    old_value: "7",
    new_value: "2",
    date_detected: "2023-05-13T09:15:00",
    id_site: "2",
  },
  {
    id: "4",
    id_history: "4",
    id_product: "2191",
    product_name: "Chargeur rapide",
    field: "quantity",
    old_value: "9",
    new_value: "6",
    date_detected: "2023-05-12T16:45:00",
    id_site: "3",
  },
  {
    id: "5",
    id_history: "5",
    id_product: "2326",
    product_name: "Tablette tactile",
    field: "quantity",
    old_value: "157",
    new_value: "153",
    date_detected: "2023-05-11T11:10:00",
    id_site: "1",
  },
  {
    id: "6",
    id_history: "7",
    id_product: "2362",
    product_name: "Montre connectée",
    field: "price",
    old_value: "7.230000",
    new_value: "7.480000",
    date_detected: "2023-05-10T13:25:00",
    id_site: "2",
  },
  {
    id: "7",
    id_history: "11",
    id_product: "2455",
    product_name: "Enceinte Bluetooth",
    field: "price",
    old_value: "10.690000",
    new_value: "10.770000",
    date_detected: "2023-05-09T15:40:00",
    id_site: "1",
  },
  {
    id: "8",
    id_history: "14",
    id_product: "2470",
    product_name: "Casque audio",
    field: "quantity",
    old_value: "1",
    new_value: "40",
    date_detected: "2023-05-08T10:05:00",
    id_site: "3",
  },
  {
    id: "9",
    id_history: "15",
    id_product: "2480",
    product_name: "Batterie externe",
    field: "quantity",
    old_value: "11",
    new_value: "56",
    date_detected: "2023-05-07T09:30:00",
    id_site: "4",
  },
  {
    id: "10",
    id_history: "17",
    id_product: "2504",
    product_name: "Clavier sans fil",
    field: "quantity",
    old_value: "21",
    new_value: "36",
    date_detected: "2023-05-06T14:15:00",
    id_site: "2",
  },
]

export default function HistoriqueProduitsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)
    setDateRange({ from: sevenDaysAgo, to: today })
    setSelectedSite("")
  }

  // Initialiser avec les 7 derniers jours au chargement
  useEffect(() => {
    if (!dateRange) {
      resetFilters()
    }
  }, [])

  // Fonction pour formater les valeurs de prix
  const formatPrice = (value: string) => {
    const price = Number.parseFloat(value)
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "product_name",
      header: "Produit",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("product_name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "field",
      header: "Champ modifié",
      cell: ({ row }) => {
        const field = row.getValue("field") as string
        return field === "quantity" ? "Quantité" : field === "price" ? "Prix" : field
      },
    },
    {
      accessorKey: "old_value",
      header: "Ancienne valeur",
      cell: ({ row }) => {
        const field = row.original.field
        const value = row.getValue("old_value") as string
        return field === "price" ? formatPrice(value) : value
      },
    },
    {
      accessorKey: "new_value",
      header: "Nouvelle valeur",
      cell: ({ row }) => {
        const field = row.original.field
        const oldValue = Number.parseFloat(row.original.old_value)
        const newValue = Number.parseFloat(row.original.new_value)
        const value = row.getValue("new_value") as string

        const isIncrease = newValue > oldValue
        const icon = isIncrease ? (
          <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="ml-2 h-4 w-4 text-red-500" />
        )

        return (
          <div className="flex items-center">
            <span>{field === "price" ? formatPrice(value) : value}</span>
            {icon}
          </div>
        )
      },
    },
    {
      accessorKey: "date_detected",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("date_detected")), "dd/MM/yyyy HH:mm", { locale: fr })
      },
    },
    {
      accessorKey: "id_site",
      header: "Site",
      cell: ({ row }) => {
        const siteId = row.getValue("id_site")
        return <div>{`Site ${siteId}`}</div>
      },
    },
  ]

  // Filtrer les données en fonction des filtres sélectionnés
  const filteredData = historiqueProduits.filter((historique) => {
    let matchesSite = true

    // Dans un cas réel, vous filtreriez par date ici
    // Pour cet exemple, on ne filtre pas par date pour montrer toutes les données

    if (selectedSite) {
      matchesSite = historique.id_site === selectedSite
    }

    return matchesSite
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique produits</h1>
          <p className="text-muted-foreground">Suivez les modifications apportées à vos produits</p>
        </div>
        <ExportButton />
      </div>

      <FilterBar
        dateValue={dateRange}
        siteValue={selectedSite}
        onDateChange={setDateRange}
        onSiteChange={setSelectedSite}
        onReset={resetFilters}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        searchKey="product_name"
        searchPlaceholder="Rechercher un produit..."
      />
    </div>
  )
}
