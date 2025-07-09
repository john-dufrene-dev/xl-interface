"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, ArrowUpDown, Mail, Phone, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
type Client = {
  id: string
  id_contact: string
  company: string | null
  firstname: string
  lastname: string
  email: string
  newsletter: boolean
  optin: boolean
  created_at: string
  id_site: string
  phonenumber: string
  address: string
  zip: string
  city: string
  country: string
}

// Données de démonstration
const clients: Client[] = [
  {
    id: "1",
    id_contact: "CONT456",
    company: "Entreprise ABC",
    firstname: "Jean",
    lastname: "Dupont",
    email: "jean.dupont@example.com",
    newsletter: true,
    optin: true,
    created_at: "2023-05-15T10:30:00",
    id_site: "1",
    phonenumber: "01 23 45 67 89",
    address: "123 Rue de Paris",
    zip: "75001",
    city: "Paris",
    country: "France",
  },
  {
    id: "2",
    id_contact: "CONT789",
    company: null,
    firstname: "Marie",
    lastname: "Martin",
    email: "marie.martin@example.com",
    newsletter: false,
    optin: true,
    created_at: "2023-05-14T14:20:00",
    id_site: "1",
    phonenumber: "01 98 76 54 32",
    address: "456 Avenue des Champs",
    zip: "75008",
    city: "Paris",
    country: "France",
  },
  {
    id: "3",
    id_contact: "CONT101",
    company: "SARL Durand",
    firstname: "Pierre",
    lastname: "Durand",
    email: "pierre.durand@example.com",
    newsletter: true,
    optin: false,
    created_at: "2023-05-13T09:15:00",
    id_site: "2",
    phonenumber: "04 56 78 90 12",
    address: "789 Boulevard Central",
    zip: "69001",
    city: "Lyon",
    country: "France",
  },
  {
    id: "4",
    id_contact: "CONT202",
    company: null,
    firstname: "Sophie",
    lastname: "Petit",
    email: "sophie.petit@example.com",
    newsletter: false,
    optin: false,
    created_at: "2023-05-12T16:45:00",
    id_site: "3",
    phonenumber: "05 43 21 09 87",
    address: "321 Rue du Commerce",
    zip: "33000",
    city: "Bordeaux",
    country: "France",
  },
  {
    id: "5",
    id_contact: "CONT303",
    company: "Entreprise Bernard",
    firstname: "Thomas",
    lastname: "Bernard",
    email: "thomas.bernard@example.com",
    newsletter: true,
    optin: true,
    created_at: "2023-05-11T11:10:00",
    id_site: "1",
    phonenumber: "03 65 43 21 09",
    address: "654 Avenue Principale",
    zip: "59000",
    city: "Lille",
    country: "France",
  },
  {
    id: "6",
    id_contact: "CONT404",
    company: null,
    firstname: "Claire",
    lastname: "Moreau",
    email: "claire.moreau@example.com",
    newsletter: false,
    optin: true,
    created_at: "2023-05-10T13:25:00",
    id_site: "2",
    phonenumber: "",
    address: "987 Rue de la Paix",
    zip: "13001",
    city: "Marseille",
    country: "France",
  },
  {
    id: "7",
    id_contact: "CONT505",
    company: null,
    firstname: "Lucas",
    lastname: "Dubois",
    email: "",
    newsletter: false,
    optin: false,
    created_at: "2023-05-09T08:45:00",
    id_site: "1",
    phonenumber: "",
    address: "",
    zip: "",
    city: "",
    country: "France",
  },
]

export default function ClientsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [globalSearch, setGlobalSearch] = useState("")
  const [selectedNewsletter, setSelectedNewsletter] = useState("")

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

  // Fonction pour voir les détails d'un client
  const viewDetails = (id: string) => {
    router.push(`/clients/${id}`)
  }

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "fullname",
      header: "Nom",
      cell: ({ row }) => {
        const firstname = row.original.firstname
        const lastname = row.original.lastname
        return (
          <div className="font-medium">
            {firstname} {lastname}
          </div>
        )
      },
    },
    {
      accessorKey: "company",
      header: "Société",
      cell: ({ row }) => {
        const company = row.original.company
        return company ? (
          <span>{company}</span>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.original.email
        return (
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {email ? (
              <span>{email}</span>
            ) : (
              <span className="text-muted-foreground italic">—</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "phonenumber",
      header: "Téléphone",
      cell: ({ row }) => {
        const phoneNumber = row.original.phonenumber
        return (
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {phoneNumber ? (
              <span>{phoneNumber}</span>
            ) : (
              <span className="text-muted-foreground italic">—</span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }) => {
        const city = row.original.city
        return city ? (
          <span>{city}</span>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <div className="text-right w-full flex justify-end items-center">
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="px-0 h-7">
              Date d'inscription
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="text-right w-full">
            {format(new Date(row.getValue("created_at")), "dd/MM/yyyy", { locale: fr })}
          </div>
        )
      },
    },
    {
      accessorKey: "newsletter",
      header: () => (
        <Select
          value={selectedNewsletter || "all"}
          onValueChange={v => setSelectedNewsletter(v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-28 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300">
            <SelectValue placeholder="Newsletter" className="text-xs" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="inscrit">Inscrits</SelectItem>
            <SelectItem value="non">Non inscrits</SelectItem>
          </SelectContent>
        </Select>
      ),
      cell: ({ row }) => {
        return row.getValue("newsletter") ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded font-medium">
            Inscrit
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded font-medium">
            Non inscrit
          </Badge>
        )
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

  // Filtrer les données en fonction des filtres sélectionnés
  const filteredData = clients.filter((client) => {
    let matchesSite = true
    let matchesGlobal = true
    let matchesNewsletter = true

    if (selectedSite) {
      matchesSite = client.id_site === selectedSite
    }
    if (selectedNewsletter) {
      matchesNewsletter = selectedNewsletter === "inscrit" ? client.newsletter : !client.newsletter
    }
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = (
        client.firstname.toLowerCase().includes(search) ||
        client.lastname.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        (client.company ? client.company.toLowerCase().includes(search) : false)
      )
    }
    return matchesSite && matchesNewsletter && matchesGlobal
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez votre base de clients</p>
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

      <div className="flex gap-4 items-center mb-2">
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
