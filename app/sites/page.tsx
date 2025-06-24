"use client"

import { useState } from "react"
import { Eye, Pencil, Trash2, Plus, ArrowUpDown, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { useRouter } from "next/navigation"
import { ExportButton } from "@/components/export-button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SiteForm } from "@/components/sites/site-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Types
type Site = {
  id: string
  name: string
  url: string
  api_key: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

// Données de démonstration
const sites: Site[] = [
  {
    id: "1",
    name: "Site 1",
    url: "https://www.monsite-ecommerce.fr",
    api_key: "api_key_123456",
    status: "active",
    created_at: "2023-01-15T10:30:00",
    updated_at: "2023-05-01T09:15:00",
  },
  {
    id: "2",
    name: "Site 2",
    url: "https://boutique.monsite-ecommerce.fr",
    api_key: "api_key_789012",
    status: "active",
    created_at: "2023-02-20T14:20:00",
    updated_at: "2023-04-15T11:30:00",
  },
  {
    id: "3",
    name: "Site 3",
    url: "https://www.monsite-ecommerce.com",
    api_key: "api_key_345678",
    status: "inactive",
    created_at: "2023-03-10T09:45:00",
    updated_at: "2023-05-05T16:20:00",
  },
  {
    id: "4",
    name: "Site 4",
    url: "https://test.monsite-ecommerce.fr",
    api_key: "api_key_901234",
    status: "inactive",
    created_at: "2023-04-05T11:15:00",
    updated_at: "2023-04-05T11:15:00",
  },
]

export default function SitesPage() {
  const router = useRouter()
  const [sitesList, setSitesList] = useState<Site[]>(sites)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null)
  const [globalSearch, setGlobalSearch] = useState("")

  // Fonction pour voir les détails d'un site
  const viewDetails = (id: string) => {
    router.push(`/sites/${id}`)
  }

  // Fonction pour éditer un site
  const editSite = (id: string) => {
    router.push(`/sites/${id}`)
  }

  // Fonction pour supprimer un site
  const deleteSite = (site: Site) => {
    setSiteToDelete(site)
    setIsDeleteDialogOpen(true)
  }

  // Fonction pour confirmer la suppression
  const confirmDelete = () => {
    if (siteToDelete) {
      // Dans un cas réel, vous feriez un appel API ici
      setSitesList(sitesList.filter((site) => site.id !== siteToDelete.id))
      setIsDeleteDialogOpen(false)
      setSiteToDelete(null)
    }
  }

  // Fonction pour ajouter un nouveau site
  const addSite = (formData: Omit<Site, "id" | "created_at" | "updated_at">) => {
    // Dans un cas réel, vous feriez un appel API ici
    const newSite: Site = {
      id: (sitesList.length + 1).toString(),
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setSitesList([...sitesList, newSite])
    setIsAddDialogOpen(false)
  }

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      default:
        return "Inactif"
    }
  }

  // Définition des colonnes
  const columns = [
    {
      accessorKey: "name",
      header: "Nom du site",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: ({ row }) => (
        <a
          href={row.getValue("url")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.getValue("url")}
        </a>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <Badge className={getStatusColor(status)}>{getStatusLabel(status)}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date de création
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "dd/MM/yyyy", { locale: fr })
      },
    },
    {
      accessorKey: "updated_at",
      header: "Dernière mise à jour",
      cell: ({ row }) => {
        return format(new Date(row.getValue("updated_at")), "dd/MM/yyyy", { locale: fr })
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const site = row.original as Site
        return (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => viewDetails(site.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => editSite(site.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteSite(site)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredData = sitesList.filter((site) => {
    let matchesGlobal = true
    if (globalSearch) {
      const search = globalSearch.toLowerCase()
      matchesGlobal = (
        site.name.toLowerCase().includes(search) ||
        site.url.toLowerCase().includes(search)
      )
    }
    return matchesGlobal
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">Gérez vos sites e-commerce</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un site
          </Button>
          <ExportButton />
        </div>
      </div>

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

      {/* Dialog pour ajouter un site */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau site</DialogTitle>
            <DialogDescription>Remplissez les informations pour créer un nouveau site.</DialogDescription>
          </DialogHeader>
          <SiteForm onSubmit={addSite} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog pour confirmer la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le site "{siteToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
