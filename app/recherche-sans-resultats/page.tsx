"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpDown, AlertTriangle, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"

// Types
type RechercheSansResultat = {
  id: string
  id_query: string
  key_word: string
  date_add: string
  id_site: string
  search_count: number
}

// Données de démonstration
const recherchesSansResultats: RechercheSansResultat[] = [
  {
    id: "1",
    id_query: "2001",
    key_word: "iphone 15 pro max",
    date_add: "2023-05-15T10:30:00",
    id_site: "1",
    search_count: 12,
  },
  {
    id: "2",
    id_query: "2002",
    key_word: "écouteurs sony wf-1000xm5",
    date_add: "2023-05-14T14:20:00",
    id_site: "1",
    search_count: 8,
  },
  {
    id: "3",
    id_query: "2003",
    key_word: "chargeur macbook pro usb-c",
    date_add: "2023-05-13T09:15:00",
    id_site: "2",
    search_count: 5,
  },
  {
    id: "4",
    id_query: "2004",
    key_word: "coque samsung s23 ultra",
    date_add: "2023-05-12T16:45:00",
    id_site: "3",
    search_count: 7,
  },
  {
    id: "5",
    id_query: "2005",
    key_word: "ipad pro m2",
    date_add: "2023-05-11T11:10:00",
    id_site: "1",
    search_count: 9,
  },
  {
    id: "6",
    id_query: "2006",
    key_word: "dell xps 13 plus",
    date_add: "2023-05-10T13:25:00",
    id_site: "2",
    search_count: 4,
  },
  {
    id: "7",
    id_query: "2007",
    key_word: "apple watch ultra 2",
    date_add: "2023-05-09T15:40:00",
    id_site: "1",
    search_count: 11,
  },
  {
    id: "8",
    id_query: "2008",
    key_word: "bose soundlink flex",
    date_add: "2023-05-08T10:05:00",
    id_site: "3",
    search_count: 3,
  },
  {
    id: "9",
    id_query: "2009",
    key_word: "sony wh-1000xm5",
    date_add: "2023-05-07T09:30:00",
    id_site: "4",
    search_count: 6,
  },
  {
    id: "10",
    id_query: "2010",
    key_word: "anker powercore 26800",
    date_add: "2023-05-06T14:15:00",
    id_site: "2",
    search_count: 5,
  },
]

export default function RechercheSansResultatsPage() {
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
    setGlobalSearch("")
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
      cell: ({ row }) => (
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
          <span className="font-medium">{row.getValue("key_word")}</span>
        </div>
      ),
    },
    {
      accessorKey: "search_count",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre de recherches
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.getValue("search_count") as number
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
            Dernière recherche
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
  const filteredData = recherchesSansResultats.filter((recherche) => {
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
          <h1 className="text-3xl font-bold tracking-tight">Recherche sans résultats</h1>
          <p className="text-muted-foreground">Identifiez les recherches qui n'ont pas donné de résultats</p>
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
