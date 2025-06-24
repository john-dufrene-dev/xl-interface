"use client"

import { useState, useEffect, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, ArrowUpDown, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

// Types
type Commande = {
  id: string
  id_order: string
  reference: string
  id_contact: string
  id_cart: string
  current_state: string
  payment: string
  total_paid: number
  created_at: string
  id_site: string
  contact_name: string
  provenance: string
}

// Ajout des provenances possibles
const provenances = ["CA Itek", "Tik Tok", "Amazon", "Cdiscount"]

// Fonction utilitaire pour choisir une provenance aléatoire
function getRandomProvenance() {
  return provenances[Math.floor(Math.random() * provenances.length)]
}

// Données de démonstration
const commandes: Commande[] = [
  {
    id: "1",
    id_order: "ORD123456",
    reference: "REF-A123",
    id_contact: "CONT456",
    id_cart: "CART123",
    current_state: "payé",
    payment: "carte",
    total_paid: 129.99,
    created_at: "2023-05-15T10:30:00",
    id_site: "1",
    contact_name: "Jean Dupont",
    provenance: "CA Itek",
  },
  {
    id: "2",
    id_order: "ORD123457",
    reference: "REF-B456",
    id_contact: "CONT789",
    id_cart: "CART124",
    current_state: "expédié",
    payment: "paypal",
    total_paid: 249.5,
    created_at: "2023-05-14T14:20:00",
    id_site: "1",
    contact_name: "Marie Martin",
    provenance: "Tik Tok",
  },
  {
    id: "3",
    id_order: "ORD123458",
    reference: "REF-C789",
    id_contact: "CONT101",
    id_cart: "CART125",
    current_state: "livré",
    payment: "virement",
    total_paid: 75.0,
    created_at: "2023-05-13T09:15:00",
    id_site: "2",
    contact_name: "Pierre Durand",
    provenance: "Amazon",
  },
  {
    id: "4",
    id_order: "ORD123459",
    reference: "REF-D012",
    id_contact: "CONT202",
    id_cart: "CART126",
    current_state: "en attente",
    payment: "carte",
    total_paid: 349.99,
    created_at: "2023-05-12T16:45:00",
    id_site: "3",
    contact_name: "Sophie Petit",
    provenance: "Cdiscount",
  },
  {
    id: "5",
    id_order: "ORD123460",
    reference: "REF-E345",
    id_contact: "CONT303",
    id_cart: "CART127",
    current_state: "annulé",
    payment: "paypal",
    total_paid: 199.95,
    created_at: "2023-05-11T11:10:00",
    id_site: "1",
    contact_name: "Thomas Bernard",
    provenance: "CA Itek",
  },
]

export default function CommandesPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [selectedProvenance, setSelectedProvenance] = useState("")
  const [selectedStatut, setSelectedStatut] = useState("")
  const [selectedPaiement, setSelectedPaiement] = useState("")
  const [searchReference, setSearchReference] = useState("")
  const [searchClient, setSearchClient] = useState("")
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
    setSelectedProvenance("")
    setSelectedStatut("")
    setSelectedPaiement("")
    setSearchReference("")
    setSearchClient("")
    setGlobalSearch("")
  }

  // Initialiser avec les 7 derniers jours au chargement
  useEffect(() => {
    if (!dateRange) {
      resetFilters()
    }
  }, [])

  // Fonction pour voir les détails d'une commande
  const viewDetails = (id: string) => {
    router.push(`/commandes/${id}`)
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "payé":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "expédié":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "livré":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "en attente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "annulé":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Définition des valeurs possibles pour les filtres
  const statuts = ["payé", "expédié", "livré", "en attente", "annulé"]
  const paiements = ["carte", "paypal", "virement"]

  // Définition des colonnes
  const columns = useMemo(() => [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }: { row: any }) => <div className="font-medium">{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "contact_name",
      header: "Client",
      cell: ({ row }: { row: any }) => <div className="font-medium">{row.getValue("contact_name")}</div>,
    },
    {
      accessorKey: "current_state",
      header: () => (
        <Select
          value={selectedStatut || "all"}
          onValueChange={v => setSelectedStatut(v === "all" ? "" : v)}
        >
          <SelectTrigger
            className="w-24 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300"
            style={{ minWidth: 0, minHeight: 0 }}
          >
            <SelectValue placeholder="Statut" className="text-xs" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Tous</SelectItem>
            {statuts.map((statut) => (
              <SelectItem key={statut} value={statut}>{statut.charAt(0).toUpperCase() + statut.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("current_state") as string
        return <Badge className={`${getStatusColor(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      },
    },
    {
      accessorKey: "payment",
      header: () => (
        <Select
          value={selectedPaiement || "all"}
          onValueChange={v => setSelectedPaiement(v === "all" ? "" : v)}
        >
          <SelectTrigger
            className="w-24 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300"
            style={{ minWidth: 0, minHeight: 0 }}
          >
            <SelectValue placeholder="Paiement" className="text-xs" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Tous</SelectItem>
            {paiements.map((p) => (
              <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      cell: ({ row }: { row: any }) => {
        const payment = row.getValue("payment") as string
        return payment.charAt(0).toUpperCase() + payment.slice(1)
      },
    },
    {
      accessorKey: "total_paid",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Montant
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("total_paid"))
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
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
      accessorKey: "provenance",
      header: () => (
        <Select
          value={selectedProvenance || "all"}
          onValueChange={v => setSelectedProvenance(v === "all" ? "" : v)}
        >
          <SelectTrigger
            className="w-24 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300"
            style={{ minWidth: 0, minHeight: 0 }}
          >
            <SelectValue placeholder="Provenance" className="text-xs" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all">Toutes</SelectItem>
            {provenances.map((prov) => (
              <SelectItem key={prov} value={prov}>{prov}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 w-fit">
          {row.getValue("provenance")}
        </div>
      ),
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
  ], [searchReference, searchClient, selectedProvenance, selectedStatut, selectedPaiement]);

  // Filtrer les données en fonction des filtres sélectionnés
  const filteredData = commandes.filter((commande) => {
    let matchesSite = true
    let matchesProvenance = true
    let matchesStatut = true
    let matchesPaiement = true
    let matchesGlobal = true

    if (selectedSite) {
      matchesSite = commande.id_site === selectedSite
    }
    if (selectedProvenance) {
      matchesProvenance = commande.provenance === selectedProvenance
    }
    if (selectedStatut) {
      matchesStatut = commande.current_state === selectedStatut
    }
    if (selectedPaiement) {
      matchesPaiement = commande.payment === selectedPaiement
    }
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = commande.reference.toLowerCase().includes(search) || commande.contact_name.toLowerCase().includes(search)
    }
    return matchesSite && matchesProvenance && matchesStatut && matchesPaiement && matchesGlobal
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">Gérez les commandes de vos clients</p>
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
