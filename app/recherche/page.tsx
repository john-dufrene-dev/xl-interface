"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"

// Types
type Recherche = {
  id: string
  id_query: string
  key_word: string
  date_add: string
  id_site: string
  results_count: number
}

// Données de démonstration
const recherches: Recherche[] = [
  {
    id: "1",
    id_query: "1001",
    key_word: "smartphone",
    date_add: "2023-05-15T10:30:00",
    id_site: "1",
    results_count: 24,
  },
  {
    id: "2",
    id_query: "1002",
    key_word: "écouteurs sans fil",
    date_add: "2023-05-14T14:20:00",
    id_site: "1",
    results_count: 12,
  },
  {
    id: "3",
    id_query: "1003",
    key_word: "chargeur rapide",
    date_add: "2023-05-13T09:15:00",
    id_site: "2",
    results_count: 8,
  },
  {
    id: "4",
    id_query: "1004",
    key_word: "coque protection",
    date_add: "2023-05-12T16:45:00",
    id_site: "3",
    results_count: 32,
  },
  {
    id: "5",
    id_query: "1005",
    key_word: "tablette",
    date_add: "2023-05-11T11:10:00",
    id_site: "1",
    results_count: 15,
  },
  {
    id: "6",
    id_query: "1006",
    key_word: "ordinateur portable",
    date_add: "2023-05-10T13:25:00",
    id_site: "2",
    results_count: 18,
  },
  {
    id: "7",
    id_query: "1007",
    key_word: "montre connectée",
    date_add: "2023-05-09T15:40:00",
    id_site: "1",
    results_count: 9,
  },
  {
    id: "8",
    id_query: "1008",
    key_word: "enceinte bluetooth",
    date_add: "2023-05-08T10:05:00",
    id_site: "3",
    results_count: 14,
  },
  {
    id: "9",
    id_query: "1009",
    key_word: "casque audio",
    date_add: "2023-05-07T09:30:00",
    id_site: "4",
    results_count: 21,
  },
  {
    id: "10",
    id_query: "1010",
    key_word: "batterie externe",
    date_add: "2023-05-06T14:15:00",
    id_site: "2",
    results_count: 11,
  },
]

export default function RecherchePage() {
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

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "key_word",
      header: "Mot-clé",
      cell: ({ row }) => <div className="font-medium">{row.getValue("key_word")}</div>,
    },
    {
      accessorKey: "results_count",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Résultats
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.getValue("results_count") as number
        return (
          <Badge variant="outline" className="ml-2">
            {count}
          </Badge>
        )
      },
    },
    {
      accessorKey: "date_add",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("date_add")), "dd/MM/yyyy HH:mm", { locale: fr })
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
  const filteredData = recherches.filter((recherche) => {
    let matchesSite = true

    // Dans un cas réel, vous filtreriez par date ici
    // Pour cet exemple, on ne filtre pas par date pour montrer toutes les données

    if (selectedSite) {
      matchesSite = recherche.id_site === selectedSite
    }

    return matchesSite
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recherche</h1>
          <p className="text-muted-foreground">Gérez les recherches effectuées par vos clients</p>
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
        searchKey="key_word"
        searchPlaceholder="Rechercher un mot-clé..."
      />
    </div>
  )
}
