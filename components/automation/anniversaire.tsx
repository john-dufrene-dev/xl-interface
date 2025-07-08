"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Power, BarChart4, ArrowLeft, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { AnniversaireForm } from "@/components/automation/anniversaire-form"

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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
          <FilterBar
            onDateChange={setDateRange}
            onSiteChange={setSelectedSite}
            onReset={handleResetFilters}
            dateValue={dateRange}
            siteValue={selectedSite}
          />

          {/* Cards d'indicateurs clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Clients concernés</CardTitle>
                <CardDescription className="text-xs">Total sur tous les scénarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scenarios.reduce((acc, sc) => acc + sc.statistiques.totalClients, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Emails envoyés</CardTitle>
                <CardDescription className="text-xs">Total sur tous les scénarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scenarios.reduce((acc, sc) => acc + sc.statistiques.emailsEnvoyes, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Offres utilisées</CardTitle>
                <CardDescription className="text-xs">Total sur tous les scénarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scenarios.reduce((acc, sc) => acc + sc.statistiques.offresUtilisees, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Taux de conversion</CardTitle>
                <CardDescription className="text-xs">Moyenne globale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(() => {
                    const totalEmails = scenarios.reduce((acc, sc) => acc + sc.statistiques.emailsEnvoyes, 0)
                    const totalOffres = scenarios.reduce((acc, sc) => acc + sc.statistiques.offresUtilisees, 0)
                    return totalEmails > 0 ? ((totalOffres / totalEmails) * 100).toFixed(1) : "0"
                  })()}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques principaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance par scénario</CardTitle>
                    <CardDescription>Emails envoyés vs offres utilisées</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarios}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nom" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="statistiques.emailsEnvoyes" name="Emails envoyés" fill="#3b82f6" />
                      <Bar dataKey="statistiques.offresUtilisees" name="Offres utilisées" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Taux de conversion par scénario</CardTitle>
                    <CardDescription>Performance des offres</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarios}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nom" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, "Taux de conversion"]} />
                      <Bar dataKey="statistiques.tauxConversion" name="Taux de conversion" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques de taux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Évolution des performances</CardTitle>
                    <CardDescription>Tendances sur 6 mois</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { mois: "Jan", emails: 120, offres: 30, taux: 25.0 },
                        { mois: "Fév", emails: 145, offres: 38, taux: 26.2 },
                        { mois: "Mar", emails: 165, offres: 42, taux: 25.5 },
                        { mois: "Avr", emails: 180, offres: 48, taux: 26.7 },
                        { mois: "Mai", emails: 190, offres: 52, taux: 27.4 },
                        { mois: "Jun", emails: 180, offres: 45, taux: 25.0 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="emails" name="Emails envoyés" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="offres" name="Offres utilisées" stroke="#10b981" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="taux" name="Taux de conversion (%)" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition des offres</CardTitle>
                    <CardDescription>Part de chaque scénario</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scenarios.map(sc => ({
                          name: sc.nom,
                          value: sc.statistiques.offresUtilisees
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scenarios.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Offres utilisées"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableaux thématiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance des scénarios</CardTitle>
                    <CardDescription>Emails et offres par scénario</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-gray-100 font-medium">Scénario</TableHead>
                        <TableHead className="text-right bg-blue-50">Site</TableHead>
                        <TableHead className="text-right bg-blue-50">Emails envoyés</TableHead>
                        <TableHead className="text-right bg-green-50">Offres utilisées</TableHead>
                        <TableHead className="text-right bg-green-50">Taux de conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenarios.map((sc) => (
                        <TableRow key={sc.nom}>
                          <TableCell className="font-medium">{sc.nom}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.siteName}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.statistiques.emailsEnvoyes}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.statistiques.offresUtilisees}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.statistiques.tauxConversion}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Impact financier</CardTitle>
                    <CardDescription>CA généré par scénario</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-gray-100 font-medium">Scénario</TableHead>
                        <TableHead className="text-right bg-blue-50">Site</TableHead>
                        <TableHead className="text-right bg-blue-50">Offres utilisées</TableHead>
                        <TableHead className="text-right bg-green-50">CA généré</TableHead>
                        <TableHead className="text-right bg-green-50">CA moyen/offre</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenarios.map((sc) => (
                        <TableRow key={sc.nom}>
                          <TableCell className="font-medium">{sc.nom}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.siteName}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.statistiques.offresUtilisees}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.statistiques.caGenere.toLocaleString()}€</TableCell>
                          <TableCell className="text-right bg-green-50">
                            {sc.statistiques.offresUtilisees > 0 
                              ? (sc.statistiques.caGenere / sc.statistiques.offresUtilisees).toFixed(0) 
                              : "0"}€
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tableau synthèse */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Synthèse complète</CardTitle>
                  <CardDescription>Vue d'ensemble de tous les scénarios</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Scénario</TableHead>
                      <TableHead className="text-right bg-blue-50">Site</TableHead>
                      <TableHead className="text-right bg-blue-50">Clients concernés</TableHead>
                      <TableHead className="text-right bg-blue-50">Emails envoyés</TableHead>
                      <TableHead className="text-right bg-blue-50">Offres utilisées</TableHead>
                      <TableHead className="text-right bg-blue-50">Taux de conversion</TableHead>
                      <TableHead className="text-right bg-green-50">CA généré</TableHead>
                      <TableHead className="text-right bg-green-50">CA moyen/offre</TableHead>
                      <TableHead className="text-right bg-yellow-50">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((sc) => (
                      <TableRow key={sc.nom}>
                        <TableCell className="font-medium sticky left-0 bg-white z-10">{sc.nom}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.siteName}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.statistiques.totalClients}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.statistiques.emailsEnvoyes}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.statistiques.offresUtilisees}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.statistiques.tauxConversion}%</TableCell>
                        <TableCell className="text-right bg-green-50">{sc.statistiques.caGenere.toLocaleString()}€</TableCell>
                        <TableCell className="text-right bg-green-50">
                          {sc.statistiques.offresUtilisees > 0 
                            ? (sc.statistiques.caGenere / sc.statistiques.offresUtilisees).toFixed(0) 
                            : "0"}€
                        </TableCell>
                        <TableCell className="text-right bg-yellow-50">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sc.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {sc.actif ? "Actif" : "Inactif"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
