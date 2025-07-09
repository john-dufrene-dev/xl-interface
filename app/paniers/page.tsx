"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, ArrowUpDown, Search, X, Package } from "lucide-react"
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
  id_order?: string // Added for new button
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
    id_order: "ORD123", // Added for new button
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
    id_order: "ORD456", // Added for new button
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
  const [globalSearch, setGlobalSearch] = useState("")

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
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 h-7 w-full flex justify-end">
            <span className="w-full text-right">Montant</span>
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
        return <div className="text-right font-medium w-full">{formatted}</div>
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
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="sm" onClick={() => viewDetails(row.original.id)} className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Détails
            </Button>
            {row.original.id_order && (
              <Button variant="ghost" size="sm" onClick={() => router.push(`/commandes/${row.original.id_order}`)} className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Voir la commande
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  // Modifier la fonction de filtrage pour ne pas filtrer par date dans les données de démonstration
  // Filtrer les données en fonction des filtres sélectionnés
  const filteredData = paniers.filter((panier) => {
    let matchesSite = true
    let matchesGlobal = true

    if (selectedSite) {
      matchesSite = panier.id_site === selectedSite
    }
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = (
        panier.id_cart.toLowerCase().includes(search) ||
        panier.contact_name.toLowerCase().includes(search) ||
        panier.id.toLowerCase().includes(search)
      )
    }
    return matchesSite && matchesGlobal
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

      <div className="flex justify-start">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="global-search-input"
            type="text"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            placeholder="Rechercher un mot-clé..."
            className="w-full h-9 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md pl-10 pr-8 text-sm focus:ring-0 focus:outline-none shadow-none hover:border-gray-300 transition-all"
          />
          {globalSearch && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                setGlobalSearch("");
                setTimeout(() => {
                  document.getElementById("global-search-input")?.focus();
                }, 0);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none cursor-pointer"
              style={{ lineHeight: 0 }}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} searchPlaceholder="Rechercher un mot-clé..." />
    </div>
  )
}
