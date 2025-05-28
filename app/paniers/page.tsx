"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"

// Types
type Panier = {
  id: string
  id_cart: string
  id_contact: string
  amount: number
  total_products: number
  created_at: string
  updated_at: string
  id_site: string
  contact_name: string
  items_count: number
}

// Données de démonstration
const paniers: Panier[] = [
  {
    id: "1",
    id_cart: "CART123",
    id_contact: "CONT456",
    amount: 129.99,
    total_products: 129.99,
    created_at: "2023-05-15T10:30:00",
    updated_at: "2023-05-15T10:35:00",
    id_site: "1",
    contact_name: "Jean Dupont",
    items_count: 3,
  },
  {
    id: "2",
    id_cart: "CART124",
    id_contact: "CONT789",
    amount: 249.5,
    total_products: 249.5,
    created_at: "2023-05-14T14:20:00",
    updated_at: "2023-05-14T14:25:00",
    id_site: "1",
    contact_name: "Marie Martin",
    items_count: 5,
  },
  {
    id: "3",
    id_cart: "CART125",
    id_contact: "CONT101",
    amount: 75.0,
    total_products: 75.0,
    created_at: "2023-05-13T09:15:00",
    updated_at: "2023-05-13T09:20:00",
    id_site: "2",
    contact_name: "Pierre Durand",
    items_count: 2,
  },
  {
    id: "4",
    id_cart: "CART126",
    id_contact: "CONT202",
    amount: 349.99,
    total_products: 349.99,
    created_at: "2023-05-12T16:45:00",
    updated_at: "2023-05-12T16:50:00",
    id_site: "3",
    contact_name: "Sophie Petit",
    items_count: 4,
  },
  {
    id: "5",
    id_cart: "CART127",
    id_contact: "CONT303",
    amount: 199.95,
    total_products: 199.95,
    created_at: "2023-05-11T11:10:00",
    updated_at: "2023-05-11T11:15:00",
    id_site: "1",
    contact_name: "Thomas Bernard",
    items_count: 3,
  },
]

export default function PaniersPage() {
  const router = useRouter()
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

  // Fonction pour voir les détails d'un panier
  const viewDetails = (id: string) => {
    router.push(`/paniers/${id}`)
  }

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "id_cart",
      header: "Référence",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id_cart")}</div>,
    },
    {
      accessorKey: "contact_name",
      header: "Client",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Montant
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "items_count",
      header: "Articles",
      cell: ({ row }) => {
        return (
          <Badge variant="outline" className="ml-2">
            {row.getValue("items_count")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Date de création",
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "dd/MM/yyyy HH:mm", { locale: fr })
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
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="sm" onClick={() => viewDetails(row.original.id)} className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Détails
          </Button>
        )
      },
    },
  ]

  // Modifier la fonction de filtrage pour ne pas filtrer par date dans les données de démonstration
  // Filtrer les données en fonction des filtres sélectionnés
  const filteredData = paniers.filter((panier) => {
    let matchesSite = true

    // Dans un cas réel, vous filtreriez par date ici
    // Pour cet exemple, on ne filtre pas par date pour montrer toutes les données

    if (selectedSite) {
      matchesSite = panier.id_site === selectedSite
    }

    return matchesSite
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paniers</h1>
          <p className="text-muted-foreground">Gérez les paniers de vos clients</p>
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

      <DataTable columns={columns} data={filteredData} searchPlaceholder="Rechercher..." />
    </div>
  )
}
