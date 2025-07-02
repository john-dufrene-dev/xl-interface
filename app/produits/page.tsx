"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { Eye, ArrowUpDown, Tag, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { FilterBar } from "@/components/filter-bar"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/export-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
type Produit = {
  id: string
  id_product: string
  id_site: string
  name: string
  description: string | null
  url: string | null
  image: string | null
  sku: string | null
  reference: string | null
  price: number
  price_excl_tax: number
  tax_value: number
  is_discounted: boolean
  promo_price: number
  date_promo_from: string | null
  date_promo_to: string | null
  created_at: string
  category_default: string | null
  status: string
}

// Données de démonstration
const produits: Produit[] = [
  {
    id: "1",
    id_product: "PROD123",
    id_site: "1",
    name: "Smartphone XYZ",
    description: "Un smartphone haut de gamme avec des fonctionnalités avancées",
    url: "/produits/smartphone-xyz",
    image: "/placeholder.svg",
    sku: "SKU123",
    reference: "REF-S123",
    price: 999.99,
    price_excl_tax: 833.33,
    tax_value: 20.0,
    is_discounted: true,
    promo_price: 899.99,
    date_promo_from: "2023-05-01T00:00:00",
    date_promo_to: "2023-05-31T23:59:59",
    created_at: "2023-01-15T10:30:00",
    category_default: "Électronique",
    status: "Actif",
  },
  {
    id: "2",
    id_product: "PROD456",
    id_site: "1",
    name: "Coque de protection",
    description: "Coque de protection pour smartphone XYZ",
    url: "/produits/coque-protection",
    image: "/placeholder.svg",
    sku: "SKU456",
    reference: "REF-C456",
    price: 29.99,
    price_excl_tax: 24.99,
    tax_value: 20.0,
    is_discounted: false,
    promo_price: 0,
    date_promo_from: null,
    date_promo_to: null,
    created_at: "2023-02-20T14:20:00",
    category_default: "Accessoires",
    status: "Actif",
  },
  {
    id: "3",
    id_product: "PROD789",
    id_site: "2",
    name: "Écouteurs sans fil",
    description: "Écouteurs sans fil avec réduction de bruit",
    url: "/produits/ecouteurs-sans-fil",
    image: "/placeholder.svg",
    sku: "SKU789",
    reference: "REF-E789",
    price: 149.99,
    price_excl_tax: 124.99,
    tax_value: 20.0,
    is_discounted: true,
    promo_price: 129.99,
    date_promo_from: "2023-05-10T00:00:00",
    date_promo_to: "2023-06-10T23:59:59",
    created_at: "2023-03-13T09:15:00",
    category_default: "Audio",
    status: "Actif",
  },
  {
    id: "4",
    id_product: "PROD012",
    id_site: "3",
    name: "Chargeur rapide",
    description: "Chargeur rapide compatible avec tous les smartphones",
    url: "/produits/chargeur-rapide",
    image: "/placeholder.svg",
    sku: "SKU012",
    reference: "REF-C012",
    price: 49.99,
    price_excl_tax: 41.66,
    tax_value: 20.0,
    is_discounted: false,
    promo_price: 0,
    date_promo_from: null,
    date_promo_to: null,
    created_at: "2023-04-12T16:45:00",
    category_default: "Accessoires",
    status: "Actif",
  },
  {
    id: "5",
    id_product: "PROD345",
    id_site: "1",
    name: "Tablette tactile",
    description: "Tablette tactile haute performance",
    url: "/produits/tablette-tactile",
    image: "/placeholder.svg",
    sku: "SKU345",
    reference: "REF-T345",
    price: 599.99,
    price_excl_tax: 499.99,
    tax_value: 20.0,
    is_discounted: false,
    promo_price: 0,
    date_promo_from: null,
    date_promo_to: null,
    created_at: "2023-05-11T11:10:00",
    category_default: "Électronique",
    status: "Actif",
  },
]

export default function ProduitsPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [globalSearch, setGlobalSearch] = useState("")
  const [promotionFilter, setPromotionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setDateRange({ from: new Date("2000-01-01"), to: new Date("2100-01-01") })
    setSelectedSite("")
    setPromotionFilter("all")
    setStatusFilter("all")
    setGlobalSearch("")
  }

  // Initialiser avec les 7 derniers jours au chargement
  useEffect(() => {
    if (!dateRange) {
      resetFilters()
    }
  }, [])

  // Fonction pour voir les détails d'un produit
  const viewDetails = (id: string) => {
    router.push(`/produits/${id}`)
  }

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("image") as string
        return (
          <div className="h-10 w-10 rounded-md bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={row.original.name}
                className="h-full w-full object-cover rounded-md"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Tag className="h-5 w-5" />
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Nom",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => row.getValue("reference") || "-",
    },
    {
      accessorKey: "category_default",
      header: "Catégorie",
      cell: ({ row }) => row.getValue("category_default") || "-",
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Prix
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue("price"))
        const isDiscounted = row.original.is_discounted
        const promoPrice = Number.parseFloat(row.original.promo_price)

        return (
          <div className="text-right">
            {isDiscounted ? (
              <div>
                <span className="line-through text-muted-foreground mr-2">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)}
                </span>
                <span className="font-medium text-red-600">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(promoPrice)}
                </span>
              </div>
            ) : (
              <span className="font-medium">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price)}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "is_discounted",
      header: () => (
        <Select value={promotionFilter} onValueChange={setPromotionFilter}>
          <SelectTrigger className="w-24 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300">
            <SelectValue placeholder="Promotion" />
          </SelectTrigger>
          <SelectContent>
            {promoOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      cell: ({ row }: { row: any }) => {
        const isDiscounted = row.getValue("is_discounted")
        return isDiscounted ? (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Oui</Badge>
        ) : (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Non</Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-24 h-7 border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 rounded-md px-2 py-0 text-xs font-normal text-foreground focus:ring-0 focus:outline-none shadow-none hover:border-gray-300">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status")
        return (
          <span className={`px-2 py-1 rounded-full text-white text-xs font-bold ${status === "Actif" ? "bg-green-600" : "bg-red-600"}`}>{status === "Actif" ? "OUI" : "NON"}</span>
        )
      },
    },
    {
      accessorKey: "id_site",
      header: "Site",
      cell: ({ row }: { row: any }) => {
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
  const filteredData = produits.filter((produit) => {
    let matchesSiteGlobal = true
    let matchesDate = true
    let matchesPromotion = true
    let matchesStatus = true
    let matchesGlobal = true

    // Filtre site global (FilterBar)
    if (selectedSite) {
      matchesSiteGlobal = produit.id_site === selectedSite
    }
    // Filtre date (FilterBar)
    if (dateRange && dateRange.from && dateRange.to) {
      const created = new Date(produit.created_at)
      matchesDate = created >= dateRange.from && created <= dateRange.to
    } else {
      matchesDate = true;
    }
    // Filtre promotion colonne
    if (promotionFilter !== "all") {
      matchesPromotion = promotionFilter === "oui" ? produit.is_discounted : !produit.is_discounted
    }
    // Filtre statut colonne
    if (statusFilter !== "all") {
      matchesStatus = statusFilter === "oui" ? produit.status === "Actif" : produit.status !== "Actif"
    }
    // Recherche globale
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = (
        (produit.name && produit.name.toLowerCase().includes(search)) ||
        (produit.reference && produit.reference.toLowerCase().includes(search)) ||
        (produit.category_default && produit.category_default.toLowerCase().includes(search))
      )
    }
    return matchesSiteGlobal && matchesDate && matchesPromotion && matchesStatus && matchesGlobal
  })

  const statusOptions = [
    { value: "all", label: "Tous" },
    { value: "oui", label: "Oui" },
    { value: "non", label: "Non" },
  ]
  const promoOptions = [
    { value: "all", label: "Toutes" },
    { value: "oui", label: "Oui" },
    { value: "non", label: "Non" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
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
