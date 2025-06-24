"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpDown, Search, X } from "lucide-react"
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
    let matchesGlobal = true

    if (selectedSite) {
      matchesSite = recherche.id_site === selectedSite
    }
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = recherche.key_word.toLowerCase().includes(search)
    }
    return matchesSite && matchesGlobal
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

      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Rechercher un mot-clé..."
      />
    </div>
  )
}
