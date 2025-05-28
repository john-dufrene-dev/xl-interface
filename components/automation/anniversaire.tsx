"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Power, BarChart4, ArrowLeft, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { AnniversaireForm } from "@/components/automation/anniversaire-form"
import { AnniversaireStats } from "@/components/automation/anniversaire-stats"
import { FilterBar } from "@/components/filter-bar"
import { MailPreview } from "@/components/automation/mail-preview"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { AnniversaireStep } from "@/types/anniversaire-step" // Declare AnniversaireStep here

// Types pour les scénarios d'anniversaire
type Scenario = {
  id: string
  nom: string
  siteId: string
  siteName: string
  titreMail?: string
  sujetMail?: string
  texteApercu?: string
  contenuMailHaut?: string
  contenuMailBas?: string
  imageUrl?: string
  bannerLink?: string // Lien de la bannière
  utmSource?: string // utm_source
  utmMedium?: string // utm_medium
  utmCampaign?: string // utm_campaign
  utmTerm?: string // utm_term
  utmContent?: string // utm_content
  buttonLink?: string // Lien du bouton
  buttonUtmSource?: string // utm_source spécifique au bouton
  buttonUtmMedium?: string // utm_medium spécifique au bouton
  buttonUtmCampaign?: string // utm_campaign spécifique au bouton
  buttonUtmTerm?: string // utm_term spécifique au bouton
  buttonUtmContent?: string // utm_content spécifique au bouton
  texteButton?: string
  criteres: {
    offreSpeciale: string
    dureeValidite: number
    bonReductionActif?: boolean
    montantReduction?: number
    typeReduction?: "pourcentage" | "montant"
  }
  actif: boolean
  dateCreation: string
  statistiques: {
    totalClients: number
    emailsEnvoyes: number
    offresUtilisees: number
    tauxConversion: number
    caGenere: number
  }
}

// Fonction pour obtenir la date actuelle au format ISO
const getCurrentDate = () => new Date().toISOString()

// Fonction pour obtenir une date récente (il y a quelques jours)
const getRecentDate = (daysAgo = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Données d'exemple avec des dates récentes et tous les nouveaux champs
const scenariosExempleInitial: Scenario[] = [
  {
    id: "1",
    nom: "Anniversaire clients premium",
    siteId: "1",
    siteName: "Site principal",
    titreMail: "Joyeux Anniversaire de la part de Site Principal",
    sujetMail: "🎂 Joyeux Anniversaire ! Un cadeau vous attend",
    texteApercu: "Pour célébrer votre anniversaire, nous vous offrons une réduction exceptionnelle !",
    contenuMailHaut:
      "Cher(e) client(e), toute l'équipe de Site Principal vous souhaite un merveilleux anniversaire ! Pour célébrer cette journée spéciale avec vous, nous avons le plaisir de vous offrir un cadeau.",
    contenuMailBas:
      "Cette offre est valable pendant 7 jours. N'hésitez pas à nous contacter si vous avez des questions. Nous vous souhaitons une excellente journée d'anniversaire !",
    imageUrl: "https://placehold.co/600x200/4f46e5/ffffff?text=Joyeux+Anniversaire",
    bannerLink: "https://www.siteprincipal.com/promo-anniversaire",
    utmSource: "email",
    utmMedium: "banner",
    utmCampaign: "birthday",
    utmTerm: "premium",
    utmContent: "banner_image",
    buttonLink: "https://www.siteprincipal.com/offre-anniversaire",
    buttonUtmSource: "email",
    buttonUtmMedium: "button",
    buttonUtmCampaign: "birthday",
    buttonUtmTerm: "premium",
    buttonUtmContent: "cta_button",
    texteButton: "Profiter de mon cadeau",
    criteres: {
      offreSpeciale: "20% de réduction sur tout le site",
      dureeValidite: 7,
      bonReductionActif: true,
      montantReduction: 20,
      typeReduction: "pourcentage",
    },
    actif: true,
    dateCreation: getCurrentDate(), // Date actuelle
    statistiques: {
      totalClients: 450,
      emailsEnvoyes: 320,
      offresUtilisees: 78,
      tauxConversion: 24.4,
      caGenere: 12450,
    },
  },
  {
    id: "2",
    nom: "Anniversaire clients standard",
    siteId: "2",
    siteName: "Site secondaire",
    titreMail: "Bon Anniversaire de la part de Site Secondaire",
    sujetMail: "🎉 Bon Anniversaire ! Voici votre cadeau",
    texteApercu: "Nous vous offrons une réduction spéciale pour votre anniversaire !",
    contenuMailHaut:
      "Cher(e) client(e), nous sommes ravis de célébrer votre anniversaire avec vous ! Pour cette occasion spéciale, nous vous offrons un cadeau.",
    contenuMailBas:
      "Cette offre est valable pendant 5 jours. N'hésitez pas à nous contacter si vous avez des questions. Nous vous souhaitons un excellent anniversaire !",
    imageUrl: "https://placehold.co/600x200/10b981/ffffff?text=Bon+Anniversaire",
    bannerLink: "https://www.sitesecondaire.com/promo-anniversaire",
    utmSource: "email",
    utmMedium: "banner",
    utmCampaign: "birthday",
    utmTerm: "standard",
    utmContent: "banner_image",
    buttonLink: "https://www.sitesecondaire.com/offre-anniversaire",
    buttonUtmSource: "email",
    buttonUtmMedium: "button",
    buttonUtmCampaign: "birthday",
    buttonUtmTerm: "standard",
    buttonUtmContent: "cta_button",
    texteButton: "Découvrir mon cadeau",
    criteres: {
      offreSpeciale: "10% de réduction sur tout le site",
      dureeValidite: 5,
      bonReductionActif: false,
      montantReduction: 10,
      typeReduction: "montant",
    },
    actif: false,
    dateCreation: getRecentDate(2),
    statistiques: {
      totalClients: 850,
      emailsEnvoyes: 720,
      offresUtilisees: 180,
      tauxConversion: 25.0,
      caGenere: 8500,
    },
  },
]

// Déclaration des colonnes pour le tableau des scénarios
const columns = [
  {
    id: "nom",
    accessorKey: "nom",
    header: "Nom du scénario",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.nom}</div>
        <div className="text-sm text-muted-foreground">Site: {row.original.siteName}</div>
      </div>
    ),
  },
  {
    id: "offreSpeciale",
    accessorKey: "criteres.offreSpeciale",
    header: "Offre",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {row.original.criteres.offreSpeciale}
      </span>
    ),
  },
  {
    id: "dateCreation",
    accessorKey: "dateCreation",
    header: "Date de création",
    cell: ({ row }) => {
      const date = new Date(row.original.dateCreation)
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    },
  },
  {
    id: "actif",
    accessorKey: "actif",
    header: "Statut",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.original.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.actif ? "Actif" : "Inactif"}
      </span>
    ),
  },
]

export default function AnniversaireAutomation() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("liste")
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)
  const [scenarios, setScenarios] = useState<Scenario[]>(scenariosExempleInitial)
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>(scenariosExempleInitial)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scenarioToDelete, setScenarioToDelete] = useState<Scenario | null>(null)
  const [selectedScenarioForDetail, setSelectedScenarioForDetail] = useState<Scenario | null>(null)
  const [mailPreviewOpen, setMailPreviewOpen] = useState(false)
  const [previewMail, setPreviewMail] = useState<{
    titreMail?: string
    sujet?: string
    texteApercu?: string
    imageUrl?: string
    bannerLink?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
    buttonLink?: string
    buttonUtmSource?: string
    buttonUtmMedium?: string
    buttonUtmCampaign?: string
    buttonUtmTerm?: string
    buttonUtmContent?: string
    contenuHaut?: string
    contenuBas?: string
    texteButton?: string
  }>({})
  const [selectedStepForPreview, setSelectedStepForPreview] = useState<AnniversaireStep | null>(null)

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...scenarios]

    // Filtre par site
    if (selectedSite) {
      filtered = filtered.filter((scenario) => scenario.siteId === selectedSite)
    }

    // Filtre par date
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter((scenario) => {
        const creationDate = new Date(scenario.dateCreation)
        return creationDate >= dateRange.from && creationDate <= dateRange.to
      })
    }

    setFilteredScenarios(filtered)
  }, [scenarios, selectedSite, dateRange])

  const handleCreateScenario = () => {
    setEditingScenario(null)
    setActiveTab("creation")
  }

  const handleEditScenario = (scenario: Scenario) => {
    setEditingScenario(scenario)
    setActiveTab("creation")
  }

  const handleToggleActive = (scenario: Scenario) => {
    const updatedScenarios = scenarios.map((s) => (s.id === scenario.id ? { ...s, actif: !s.actif } : s))
    setScenarios(updatedScenarios)

    toast({
      title: scenario.actif ? "Scénario désactivé" : "Scénario activé",
      description: `Le scénario "${scenario.nom}" a été ${scenario.actif ? "désactivé" : "activé"} avec succès.`,
      duration: 3000,
    })
  }

  const handleDeleteClick = (scenario: Scenario) => {
    setScenarioToDelete(scenario)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (scenarioToDelete) {
      const updatedScenarios = scenarios.filter((s) => s.id !== scenarioToDelete.id)
      setScenarios(updatedScenarios)

      toast({
        title: "Scénario supprimé",
        description: `Le scénario "${scenarioToDelete.nom}" a été supprimé avec succès.`,
        duration: 3000,
      })
    }
    setDeleteDialogOpen(false)
    setScenarioToDelete(null)
  }

  const handleViewScenarioDetail = (scenario: Scenario) => {
    setSelectedScenarioForDetail(scenario)
    setActiveTab("detail")
  }

  const handleSubmitScenario = (scenario: Scenario) => {
    let updatedScenarios

    if (editingScenario) {
      // Mise à jour d'un scénario existant
      updatedScenarios = scenarios.map((s) => (s.id === scenario.id ? scenario : s))
      toast({
        title: "Scénario mis à jour",
        description: `Le scénario "${scenario.nom}" a été mis à jour avec succès.`,
        duration: 3000,
      })
    } else {
      // Création d'un nouveau scénario
      const newScenario = {
        ...scenario,
        id: `${Date.now()}`,
        dateCreation: new Date().toISOString(),
        statistiques: {
          totalClients: 0,
          emailsEnvoyes: 0,
          offresUtilisees: 0,
          tauxConversion: 0,
          caGenere: 0,
        },
      }
      updatedScenarios = [...scenarios, newScenario]
      toast({
        title: "Scénario créé",
        description: `Le scénario "${scenario.nom}" a été créé avec succès.`,
        duration: 3000,
      })
    }

    setScenarios(updatedScenarios)
    setActiveTab("liste")
  }

  const handleResetFilters = () => {
    setSelectedSite("")
    setDateRange(undefined)
  }

  const handlePreviewScenarioMail = (scenario: Scenario) => {
    setPreviewMail({
      titreMail: scenario.titreMail,
      sujet: scenario.sujetMail,
      texteApercu: scenario.texteApercu,
      imageUrl: scenario.imageUrl,
      bannerLink: scenario.bannerLink,
      utmSource: scenario.utmSource,
      utmMedium: scenario.utmMedium,
      utmCampaign: scenario.utmCampaign,
      utmTerm: scenario.utmTerm,
      utmContent: scenario.utmContent,
      buttonLink: scenario.buttonLink,
      buttonUtmSource: scenario.buttonUtmSource,
      buttonUtmMedium: scenario.buttonUtmMedium,
      buttonUtmCampaign: scenario.buttonUtmCampaign,
      buttonUtmTerm: scenario.buttonUtmTerm,
      buttonUtmContent: scenario.buttonUtmContent,
      contenuHaut: scenario.contenuMailHaut,
      contenuBas: scenario.contenuMailBas,
      texteButton: scenario.texteButton,
    })
    setSelectedStepForPreview(null)
    setMailPreviewOpen(true)
  }

  const handlePreviewStepMail = (step: AnniversaireStep) => {
    setPreviewMail({
      titreMail: step.titreMail,
      sujet: step.sujet,
      texteApercu: step.texteApercu,
      imageUrl: step.imageUrl,
      bannerLink: step.bannerLink,
      utmSource: step.utmSource,
      utmMedium: step.utmMedium,
      utmCampaign: step.utmCampaign,
      utmTerm: step.utmTerm,
      utmContent: step.utmContent,
      buttonLink: step.buttonLink,
      buttonUtmSource: step.buttonUtmSource,
      buttonUtmMedium: step.buttonUtmMedium,
      buttonUtmCampaign: step.buttonUtmCampaign,
      buttonUtmTerm: step.buttonUtmTerm,
      buttonUtmContent: step.buttonUtmContent,
      contenuHaut: step.contenuHaut || step.contenu,
      contenuBas: step.contenuBas,
      texteButton: step.texteButton,
    })
    setSelectedStepForPreview(step)
    setMailPreviewOpen(true)
  }

  // Colonnes pour le tableau des scénarios avec actions fonctionnelles
  const columnsWithActions = [
    ...columns,
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Visualiser le mail"
            onClick={() => handlePreviewScenarioMail(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Détail" onClick={() => handleViewScenarioDetail(row.original)}>
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Statistiques" onClick={() => setActiveTab("statistiques")}>
            <BarChart4 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={row.original.actif ? "Désactiver" : "Activer"}
            onClick={() => handleToggleActive(row.original)}
          >
            <Power className={`h-4 w-4 ${row.original.actif ? "text-green-500" : "text-red-500"}`} />
          </Button>
          <Button variant="ghost" size="icon" title="Modifier" onClick={() => handleEditScenario(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Supprimer" onClick={() => handleDeleteClick(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="liste">Liste des scénarios</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
            <TabsTrigger value="detail">Détail</TabsTrigger>
          </TabsList>
          {activeTab === "liste" && (
            <Button onClick={handleCreateScenario}>
              <Plus className="mr-2 h-4 w-4" /> Nouveau scénario
            </Button>
          )}
        </div>

        <TabsContent value="liste" className="space-y-4">
          <FilterBar
            onDateChange={setDateRange}
            onSiteChange={setSelectedSite}
            onReset={handleResetFilters}
            dateValue={dateRange}
            siteValue={selectedSite}
            showDateFilter={false}
          />

          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle>Scénarios d'anniversaire</CardTitle>
                <CardDescription>Gérez vos scénarios d'emails d'anniversaire pour vos clients</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("detail")}>
                <Info className="mr-2 h-4 w-4" />
                Détail
              </Button>
            </CardHeader>
            <CardContent>
              {filteredScenarios.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Aucun scénario ne correspond aux critères de filtrage.</p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={columnsWithActions}
                  data={filteredScenarios}
                  searchKey="nom"
                  searchPlaceholder="Rechercher un scénario..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creation">
          <div className="mb-4">
            <Button variant="outline" onClick={() => setActiveTab("liste")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </div>
          <AnniversaireForm
            scenario={editingScenario}
            onCancel={() => setActiveTab("liste")}
            onSubmit={handleSubmitScenario}
          />
        </TabsContent>
        <TabsContent value="statistiques">
          <AnniversaireStats />
        </TabsContent>
        <TabsContent value="detail" className="space-y-4">
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => {
                setActiveTab("liste")
                setSelectedScenarioForDetail(null)
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedScenarioForDetail
                  ? `Détails du scénario: ${selectedScenarioForDetail.nom}`
                  : "Comprendre les scénarios d'anniversaire"}
              </CardTitle>
              <CardDescription>
                {selectedScenarioForDetail
                  ? `Informations détaillées sur le scénario d'anniversaire pour ${selectedScenarioForDetail.siteName}`
                  : "Explication détaillée du fonctionnement des scénarios d'emails d'anniversaire"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedScenarioForDetail ? (
                <div className="space-y-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base font-medium">Informations de base</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nom du scénario</p>
                          <p className="font-medium">{selectedScenarioForDetail.nom}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Site concerné</p>
                          <p className="font-medium">{selectedScenarioForDetail.siteName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date de création</p>
                          <p className="font-medium">
                            {new Date(selectedScenarioForDetail.dateCreation).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Statut</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedScenarioForDetail.actif
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedScenarioForDetail.actif ? "Actif" : "Inactif"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3 flex flex-row justify-between items-center">
                      <CardTitle className="text-base font-medium">Configuration du mail principal</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewScenarioMail(selectedScenarioForDetail)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualiser le mail
                      </Button>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-1 gap-4 border rounded-md p-4 bg-muted/20">
                        {selectedScenarioForDetail.sujetMail && (
                          <div>
                            <p className="text-sm text-muted-foreground">Objet du mail</p>
                            <p className="font-medium">{selectedScenarioForDetail.sujetMail}</p>
                          </div>
                        )}
                        {selectedScenarioForDetail.texteApercu && (
                          <div>
                            <p className="text-sm text-muted-foreground">Texte d'aperçu</p>
                            <p className="font-medium">{selectedScenarioForDetail.texteApercu}</p>
                          </div>
                        )}
                        {selectedScenarioForDetail.titreMail && (
                          <div>
                            <p className="text-sm text-muted-foreground">Titre du mail</p>
                            <p className="font-medium">{selectedScenarioForDetail.titreMail}</p>
                          </div>
                        )}
                        {selectedScenarioForDetail.imageUrl && (
                          <div>
                            <p className="text-sm text-muted-foreground">Image du mail</p>
                            <div className="mt-2 border rounded-md p-2">
                              <img
                                src={selectedScenarioForDetail.imageUrl || "/placeholder.svg"}
                                alt="Image du mail"
                                className="max-w-full h-auto"
                              />
                            </div>
                          </div>
                        )}
                        {selectedScenarioForDetail.contenuMailHaut && (
                          <div>
                            <p className="text-sm text-muted-foreground">Contenu du mail (partie haute)</p>
                            <p className="text-sm border rounded-md p-3 bg-white">
                              {selectedScenarioForDetail.contenuMailHaut}
                            </p>
                          </div>
                        )}
                        {selectedScenarioForDetail.contenuMailBas && (
                          <div>
                            <p className="text-sm text-muted-foreground">Contenu du mail (partie basse)</p>
                            <p className="text-sm border rounded-md p-3 bg-white">
                              {selectedScenarioForDetail.contenuMailBas}
                            </p>
                          </div>
                        )}
                        {selectedScenarioForDetail.texteButton && (
                          <div>
                            <p className="text-sm text-muted-foreground">Texte du bouton</p>
                            <p className="font-medium">{selectedScenarioForDetail.texteButton}</p>
                          </div>
                        )}
                        {selectedScenarioForDetail.bannerLink && (
                          <div>
                            <p className="text-sm text-muted-foreground">Lien de la bannière</p>
                            <p className="font-medium break-all">{selectedScenarioForDetail.bannerLink}</p>
                          </div>
                        )}
                        {selectedScenarioForDetail.buttonLink && (
                          <div>
                            <p className="text-sm text-muted-foreground">Lien du bouton</p>
                            <p className="font-medium break-all">{selectedScenarioForDetail.buttonLink}</p>
                          </div>
                        )}
                        {(selectedScenarioForDetail.utmSource ||
                          selectedScenarioForDetail.utmMedium ||
                          selectedScenarioForDetail.utmCampaign ||
                          selectedScenarioForDetail.utmTerm ||
                          selectedScenarioForDetail.utmContent) && (
                          <div>
                            <p className="text-sm text-muted-foreground">Paramètres UTM de la bannière</p>
                            <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                              {selectedScenarioForDetail.utmSource && (
                                <div>
                                  <span className="font-medium">Source:</span> {selectedScenarioForDetail.utmSource}
                                </div>
                              )}
                              {selectedScenarioForDetail.utmMedium && (
                                <div>
                                  <span className="font-medium">Medium:</span> {selectedScenarioForDetail.utmMedium}
                                </div>
                              )}
                              {selectedScenarioForDetail.utmCampaign && (
                                <div>
                                  <span className="font-medium">Campaign:</span> {selectedScenarioForDetail.utmCampaign}
                                </div>
                              )}
                              {selectedScenarioForDetail.utmTerm && (
                                <div>
                                  <span className="font-medium">Term:</span> {selectedScenarioForDetail.utmTerm}
                                </div>
                              )}
                              {selectedScenarioForDetail.utmContent && (
                                <div>
                                  <span className="font-medium">Content:</span> {selectedScenarioForDetail.utmContent}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {(selectedScenarioForDetail.buttonUtmSource ||
                          selectedScenarioForDetail.buttonUtmMedium ||
                          selectedScenarioForDetail.buttonUtmCampaign ||
                          selectedScenarioForDetail.buttonUtmTerm ||
                          selectedScenarioForDetail.buttonUtmContent) && (
                          <div>
                            <p className="text-sm text-muted-foreground">Paramètres UTM du bouton</p>
                            <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                              {selectedScenarioForDetail.buttonUtmSource && (
                                <div>
                                  <span className="font-medium">Source:</span>{" "}
                                  {selectedScenarioForDetail.buttonUtmSource}
                                </div>
                              )}
                              {selectedScenarioForDetail.buttonUtmMedium && (
                                <div>
                                  <span className="font-medium">Medium:</span>{" "}
                                  {selectedScenarioForDetail.buttonUtmMedium}
                                </div>
                              )}
                              {selectedScenarioForDetail.buttonUtmCampaign && (
                                <div>
                                  <span className="font-medium">Campaign:</span>{" "}
                                  {selectedScenarioForDetail.buttonUtmCampaign}
                                </div>
                              )}
                              {selectedScenarioForDetail.buttonUtmTerm && (
                                <div>
                                  <span className="font-medium">Term:</span> {selectedScenarioForDetail.buttonUtmTerm}
                                </div>
                              )}
                              {selectedScenarioForDetail.buttonUtmContent && (
                                <div>
                                  <span className="font-medium">Content:</span>{" "}
                                  {selectedScenarioForDetail.buttonUtmContent}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base font-medium">Critères d'inscription</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="p-4 bg-muted/20 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Offre spéciale</p>
                          <p className="font-medium">{selectedScenarioForDetail.criteres.offreSpeciale}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Durée de validité</p>
                          <p className="font-medium">{selectedScenarioForDetail.criteres.dureeValidite} jour(s)</p>
                        </div>
                      </div>
                      {selectedScenarioForDetail.criteres.bonReductionActif !== undefined && (
                        <div className="p-4 bg-muted/20 rounded-md mt-4">
                          <p className="mb-2">
                            <span className="font-medium">Bon de réduction: </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                selectedScenarioForDetail.criteres.bonReductionActif
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {selectedScenarioForDetail.criteres.bonReductionActif ? "Activé" : "Désactivé"}
                            </span>
                          </p>
                          {selectedScenarioForDetail.criteres.bonReductionActif && (
                            <div className="mt-2">
                              <p>
                                <span className="font-medium">Réduction: </span>
                                {selectedScenarioForDetail.criteres.montantReduction}{" "}
                                {selectedScenarioForDetail.criteres.typeReduction === "pourcentage" ? "%" : "€"}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base font-medium">Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total clients</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.totalClients}</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Emails envoyés</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.emailsEnvoyes}</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Offres utilisées</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.offresUtilisees}</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Taux de conversion</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.tauxConversion}%</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">CA généré</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.caGenere}€</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Qu'est-ce qu'un scénario d'anniversaire ?</h3>
                  <p>
                    Un scénario d'anniversaire est une séquence automatisée d'emails envoyés aux clients à l'occasion de
                    leur anniversaire. L'objectif est de créer un lien émotionnel avec le client en lui souhaitant un
                    joyeux anniversaire et de l'encourager à effectuer un achat grâce à une offre spéciale.
                  </p>

                  <h3 className="text-lg font-medium">Structure d'un mail d'anniversaire</h3>
                  <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                    <p>Chaque mail d'anniversaire est composé des éléments suivants :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Objet du mail</strong> : L'objet qui apparaît dans la boîte de réception du client (ex:
                        "🎂 Joyeux Anniversaire ! Un cadeau vous attend")
                      </li>
                      <li>
                        <strong>Texte d'aperçu</strong> : Le texte qui apparaît comme prévisualisation dans certains
                        clients mail (ex: "Pour célébrer votre anniversaire, nous vous offrons...")
                      </li>
                      <li>
                        <strong>Titre du mail</strong> : Le titre qui apparaît dans l'en-tête du mail (ex: "Joyeux
                        Anniversaire de la part de notre équipe")
                      </li>
                      <li>
                        <strong>Image du mail</strong> : Une bannière ou image festive qui apparaît en haut du mail
                      </li>
                      <li>
                        <strong>Contenu du mail (partie haute)</strong> : Le message d'anniversaire et la présentation
                        de l'offre
                      </li>
                      <li>
                        <strong>Contenu du mail (partie basse)</strong> : Les détails de l'offre et les conditions
                        d'utilisation
                      </li>
                      <li>
                        <strong>Texte du bouton</strong> : Le texte du bouton d'action (ex: "Profiter de mon cadeau")
                      </li>
                      <li>
                        <strong>Liens et paramètres UTM</strong> : Les liens de la bannière et du bouton, ainsi que les
                        paramètres de suivi UTM pour analyser les performances
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-medium">Comment fonctionne un scénario d'anniversaire ?</h3>
                  <p>
                    Le scénario d'anniversaire permet d'envoyer automatiquement un email personnalisé le jour de
                    l'anniversaire du client, avec une offre spéciale pour l'occasion.
                  </p>

                  <h3 className="text-lg font-medium">Critères d'inscription</h3>
                  <p>
                    Les critères d'inscription déterminent l'offre que recevront les clients pour leur anniversaire.
                    Vous pouvez définir :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>L'offre spéciale proposée (réduction, cadeau, etc.)</li>
                    <li>La durée de validité de l'offre</li>
                  </ul>

                  <h3 className="text-lg font-medium">Statistiques</h3>
                  <p>Pour chaque scénario, vous pouvez consulter des statistiques détaillées :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nombre total de clients concernés</li>
                    <li>Nombre d'emails envoyés</li>
                    <li>Nombre d'offres utilisées</li>
                    <li>Taux de conversion</li>
                    <li>Chiffre d'affaires généré</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce scénario ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le scénario "{scenarioToDelete?.nom}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MailPreview open={mailPreviewOpen} onOpenChange={setMailPreviewOpen} mail={previewMail} />
    </>
  )
}
