"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowUpDown, AlertTriangle } from "lucide-react"
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

      <DataTable
        columns={columns}
        data={filteredData}
        searchKey="key_word"
        searchPlaceholder="Rechercher un mot-clé..."
      />
    </div>
  )
}
