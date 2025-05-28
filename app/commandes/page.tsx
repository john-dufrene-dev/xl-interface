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
  },
]

export default function CommandesPage() {
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

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => <div className="font-medium">{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "contact_name",
      header: "Client",
    },
    {
      accessorKey: "current_state",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("current_state") as string
        return <Badge className={`${getStatusColor(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      },
    },
    {
      accessorKey: "payment",
      header: "Paiement",
      cell: ({ row }) => {
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
  const filteredData = commandes.filter((commande) => {
    let matchesSite = true

    // Dans un cas réel, vous filtreriez par date ici
    // Pour cet exemple, on ne filtre pas par date pour montrer toutes les données

    if (selectedSite) {
      matchesSite = commande.id_site === selectedSite
    }

    return matchesSite
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

      <DataTable columns={columns} data={filteredData} searchPlaceholder="Rechercher..." />
    </div>
  )
}
