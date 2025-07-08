"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, BarChart4, ArrowLeft, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import NewsletterForm from "./newsletter-form"

import { FilterBar } from "@/components/filter-bar"
import type { DateRange } from "react-day-picker"
import { MailPreview } from "@/components/automation/mail-preview"
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts"
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

// Types
export type NewsletterTemplate = "simple" | "promotionnel" | "informatif"

export interface Newsletter {
  id: string
  name: string
  siteId: string
  subject: string
  preheader: string
  titreMail: string
  texteApercu: string
  imageUrl: string
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
  texteButton: string
  contenuMailHaut: string
  contenuMailBas: string
  criteria: {
    subscribed: boolean
  }
  reduction: {
    actif: boolean
    montant: number
    type: "%" | "€"
    duree: number
  }
  referenceNewsletterId?: string
  createdAt: string
  lastSent: string | null
  nextSend: string | null
  stats: {
    sent: number
    opened: number
    clicked: number
    unsubscribed: number
  }
  actif: boolean
}

// Données d'exemple
const exampleNewsletters: Newsletter[] = [
  {
    id: "1",
    name: "Newsletter mensuelle",
    siteId: "1",
    subject: "Découvrez nos nouveautés du mois",
    preheader: "Les dernières tendances et promotions exclusives",
    titreMail: "Découvrez nos nouveautés du mois",
    texteApercu: "Les dernières tendances et promotions exclusives",
    imageUrl: "https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Site+Principal",
    bannerLink: "https://example.com/banner-link",
    utmSource: "newsletter",
    utmMedium: "email",
    utmCampaign: "janvier2023",
    utmTerm: "newsletter",
    utmContent: "newsletter-janvier2023",
    buttonLink: "https://example.com/newsletter-janvier2023",
    buttonUtmSource: "newsletter",
    buttonUtmMedium: "email",
    buttonUtmCampaign: "janvier2023",
    buttonUtmTerm: "newsletter",
    buttonUtmContent: "newsletter-janvier2023",
    texteButton: "En savoir plus",
    contenuMailHaut: "<p>Contenu de la newsletter mensuelle</p>",
    contenuMailBas: "<p>Contenu de la newsletter mensuelle</p>",
    criteria: {
      subscribed: true
    },
    reduction: {
      actif: true,
      montant: 50,
      type: "%",
      duree: 30
    },
    referenceNewsletterId: "2",
    createdAt: "2023-01-15T10:00:00Z",
    lastSent: "2023-04-01T09:00:00Z",
    nextSend: "2023-05-01T09:00:00Z",
    stats: {
      sent: 1250,
      opened: 680,
      clicked: 320,
      unsubscribed: 5,
    },
    actif: true
  },
  {
    id: "2",
    name: "Promotions spéciales",
    siteId: "2",
    subject: "Offres exclusives pour nos clients fidèles",
    preheader: "Jusqu'à 50% de réduction sur une sélection d'articles",
    titreMail: "Offres exclusives pour nos clients fidèles",
    texteApercu: "Jusqu'à 50% de réduction sur une sélection d'articles",
    imageUrl: "https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Site+Principal",
    bannerLink: "https://example.com/promotion-banner-link",
    utmSource: "promotion",
    utmMedium: "email",
    utmCampaign: "fevrier2023",
    utmTerm: "promotion",
    utmContent: "promotion-fevrier2023",
    buttonLink: "https://example.com/promotion-fevrier2023",
    buttonUtmSource: "promotion",
    buttonUtmMedium: "email",
    buttonUtmCampaign: "fevrier2023",
    buttonUtmTerm: "promotion",
    buttonUtmContent: "promotion-fevrier2023",
    texteButton: "En savoir plus",
    contenuMailHaut: "<p>Contenu de la newsletter promotionnelle</p>",
    contenuMailBas: "<p>Contenu de la newsletter promotionnelle</p>",
    criteria: {
      subscribed: true
    },
    reduction: {
      actif: true,
      montant: 50,
      type: "%",
      duree: 30
    },
    referenceNewsletterId: "1",
    createdAt: "2023-02-20T14:30:00Z",
    lastSent: "2023-04-15T10:00:00Z",
    nextSend: "2023-05-15T10:00:00Z",
    stats: {
      sent: 980,
      opened: 540,
      clicked: 290,
      unsubscribed: 3,
    },
    actif: true
  },
  {
    id: "3",
    name: "Actualités du secteur",
    siteId: "3",
    subject: "Les dernières tendances du marché",
    preheader: "Restez informé des évolutions de votre secteur",
    titreMail: "Les dernières tendances du marché",
    texteApercu: "Restez informé des évolutions de votre secteur",
    imageUrl: "https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Site+Principal",
    bannerLink: "https://example.com/market-banner-link",
    utmSource: "market",
    utmMedium: "email",
    utmCampaign: "mars2023",
    utmTerm: "market",
    utmContent: "market-mars2023",
    buttonLink: "https://example.com/market-mars2023",
    buttonUtmSource: "market",
    buttonUtmMedium: "email",
    buttonUtmCampaign: "mars2023",
    buttonUtmTerm: "market",
    buttonUtmContent: "market-mars2023",
    texteButton: "En savoir plus",
    contenuMailHaut: "<p>Contenu de la newsletter informative</p>",
    contenuMailBas: "<p>Contenu de la newsletter informative</p>",
    criteria: {
      subscribed: true
    },
    reduction: {
      actif: false,
      montant: 0,
      type: "%",
      duree: 0
    },
    referenceNewsletterId: "1",
    createdAt: "2023-03-10T09:15:00Z",
    lastSent: null,
    nextSend: null,
    stats: {
      sent: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
    },
    actif: true
  },
]

const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }: any) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-muted-foreground">Site: {row.original.siteId}</div>
      </div>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Créée le",
    cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString("fr-FR"),
  },
  {
    id: "audience",
    header: "Audience",
    cell: () => (
      <span>Tous les inscrits à la newsletter</span>
    ),
  },
]

export default function NewsletterComponent() {
  const [activeTab, setActiveTab] = useState("liste")
  const [newsletters, setNewsletters] = useState<Newsletter[]>(exampleNewsletters)
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>(exampleNewsletters)
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [newsletterToDelete, setNewsletterToDelete] = useState<Newsletter | null>(null)
  const [mailPreviewOpen, setMailPreviewOpen] = useState(false)
  const [mailPreviewData, setMailPreviewData] = useState<any>(null)

  // Filtres
  useEffect(() => {
    let filtered = [...newsletters]
    
    if (selectedSite && selectedSite !== "all") {
      filtered = filtered.filter(n => n.siteId === selectedSite)
    }
    
    setFilteredNewsletters(filtered)
  }, [newsletters, selectedSite])

  const handleSiteChange = (site: string) => {
    setSelectedSite(site)
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleResetFilters = () => {
    setSelectedSite("")
    setDateRange(undefined)
    setFilteredNewsletters(newsletters)
  }

  const handleCreateNewsletter = () => {
    setEditingNewsletter(null)
    setActiveTab("creation")
  }

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter)
    setActiveTab("creation")
  }

  const handleDeleteClick = (newsletter: Newsletter) => {
    setNewsletterToDelete(newsletter)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (newsletterToDelete) {
      setNewsletters(newsletters.filter((n) => n.id !== newsletterToDelete.id))
    }
    setDeleteDialogOpen(false)
    setNewsletterToDelete(null)
  }

  const handleSubmitNewsletter = (newsletter: Newsletter) => {
    let updatedNewsletters
    if (editingNewsletter) {
      updatedNewsletters = newsletters.map((n) => (n.id === newsletter.id ? newsletter : n))
    } else {
      const newNewsletter = {
        ...newsletter,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastSent: null,
        nextSend: null,
        stats: {
          sent: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
        },
      }
      updatedNewsletters = [...newsletters, newNewsletter]
    }
    setNewsletters(updatedNewsletters)
    setActiveTab("liste")
  }

  // Colonnes avec actions
  const columnsWithActions = [
    ...columns,
    {
      id: "statut",
      header: "Statut",
      cell: ({ row }: any) => (
        row.original.lastSent ? (
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">Envoyé</span>
        ) : (
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">À envoyer</span>
        )
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            title="Visualiser"
            onClick={() => {
              setMailPreviewData({
                titreMail: row.original.titreMail,
                sujet: row.original.subject,
                texteApercu: row.original.texteApercu,
                imageUrl: row.original.imageUrl,
                bannerLink: row.original.bannerLink,
                utmSource: row.original.utmSource,
                utmMedium: row.original.utmMedium,
                utmCampaign: row.original.utmCampaign,
                utmTerm: row.original.utmTerm,
                utmContent: row.original.utmContent,
                buttonLink: row.original.buttonLink,
                buttonUtmSource: row.original.buttonUtmSource,
                buttonUtmMedium: row.original.buttonUtmMedium,
                buttonUtmCampaign: row.original.buttonUtmCampaign,
                buttonUtmTerm: row.original.buttonUtmTerm,
                buttonUtmContent: row.original.buttonUtmContent,
                contenuHaut: row.original.contenuMailHaut,
                contenuBas: row.original.contenuMailBas,
                texteButton: row.original.texteButton,
              })
              setMailPreviewOpen(true)
            }}
          >
            <Eye className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" title="Statistiques" onClick={() => setActiveTab("statistiques")}>
            <BarChart4 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Modifier" onClick={() => handleEditNewsletter(row.original)}>
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList>
          <TabsTrigger value="liste">Liste des newsletters</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>
        {activeTab === "liste" && (
          <Button onClick={handleCreateNewsletter}>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle newsletter
          </Button>
        )}
      </div>

      <TabsContent value="liste" className="space-y-4">
        <FilterBar
          onDateChange={handleDateChange}
          onSiteChange={handleSiteChange}
          onReset={handleResetFilters}
          dateValue={undefined}
          siteValue={selectedSite}
          showDateFilter={false}
        />
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle>Newsletters</CardTitle>
              <CardDescription>Gérez vos campagnes de newsletters</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {filteredNewsletters.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Aucune newsletter ne correspond aux critères de filtrage.</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <DataTable
                columns={columnsWithActions}
                data={filteredNewsletters}
                searchKey="name"
                searchPlaceholder="Rechercher une newsletter..."
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="creation">
        <div className="mb-4">
          <Button variant="outline" onClick={() => setActiveTab("liste")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </div>
        <NewsletterForm
          newsletter={editingNewsletter}
          onCancel={() => setActiveTab("liste")}
          onSave={handleSubmitNewsletter}
        />
      </TabsContent>

      <TabsContent value="statistiques">
        <FilterBar
          onDateChange={handleDateChange}
          onSiteChange={handleSiteChange}
          onReset={handleResetFilters}
          dateValue={dateRange}
          siteValue={selectedSite}
        />

        {/* Cards d'indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Emails envoyés</CardTitle>
              <CardDescription className="text-xs">Total sur toutes les newsletters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {newsletters.reduce((acc, nl) => acc + nl.stats.sent, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Emails ouverts</CardTitle>
              <CardDescription className="text-xs">Total sur toutes les newsletters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {newsletters.reduce((acc, nl) => acc + nl.stats.opened, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Clics</CardTitle>
              <CardDescription className="text-xs">Total sur toutes les newsletters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {newsletters.reduce((acc, nl) => acc + nl.stats.clicked, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Taux d'ouverture</CardTitle>
              <CardDescription className="text-xs">Moyenne globale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(() => {
                  const totalSent = newsletters.reduce((acc, nl) => acc + nl.stats.sent, 0)
                  const totalOpened = newsletters.reduce((acc, nl) => acc + nl.stats.opened, 0)
                  return totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0"
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
                  <CardTitle>Performance par newsletter</CardTitle>
                  <CardDescription>Emails envoyés vs ouverts vs clics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={newsletters}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stats.sent" name="Envoyés" fill="#3b82f6" />
                    <Bar dataKey="stats.opened" name="Ouverts" fill="#10b981" />
                    <Bar dataKey="stats.clicked" name="Clics" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Taux d'engagement par newsletter</CardTitle>
                  <CardDescription>Performance des newsletters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={newsletters.map(nl => ({
                      ...nl,
                      openRate: nl.stats.sent > 0 ? (nl.stats.opened / nl.stats.sent) * 100 : 0,
                      clickRate: nl.stats.opened > 0 ? (nl.stats.clicked / nl.stats.opened) * 100 : 0
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Taux"]} />
                    <Legend />
                    <Bar dataKey="openRate" name="Taux d'ouverture" fill="#10b981" />
                    <Bar dataKey="clickRate" name="Taux de clic" fill="#f59e0b" />
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
                      { mois: "Jan", envoyes: 1250, ouverts: 680, clics: 320, tauxOuverture: 54.4 },
                      { mois: "Fév", envoyes: 1350, ouverts: 720, clics: 350, tauxOuverture: 53.3 },
                      { mois: "Mar", envoyes: 1450, ouverts: 780, clics: 380, tauxOuverture: 53.8 },
                      { mois: "Avr", envoyes: 1550, ouverts: 850, clics: 420, tauxOuverture: 54.8 },
                      { mois: "Mai", envoyes: 1650, ouverts: 920, clics: 460, tauxOuverture: 55.8 },
                      { mois: "Jun", envoyes: 1750, ouverts: 980, clics: 500, tauxOuverture: 56.0 },
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
                    <Line yAxisId="left" type="monotone" dataKey="envoyes" name="Envoyés" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="ouverts" name="Ouverts" stroke="#10b981" strokeWidth={2} />
                    <Line yAxisId="left" type="monotone" dataKey="clics" name="Clics" stroke="#f59e0b" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="tauxOuverture" name="Taux d'ouverture (%)" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Répartition des ouvertures</CardTitle>
                  <CardDescription>Part de chaque newsletter</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={newsletters.map(nl => ({
                        name: nl.name,
                        value: nl.stats.opened
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {newsletters.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Emails ouverts"]} />
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
                  <CardTitle>Performance des newsletters</CardTitle>
                  <CardDescription>Emails envoyés, ouverts et clics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium">Newsletter</TableHead>
                      <TableHead className="text-right bg-blue-50">Site</TableHead>
                      <TableHead className="text-right bg-blue-50">Envoyés</TableHead>
                      <TableHead className="text-right bg-blue-50">Ouverts</TableHead>
                      <TableHead className="text-right bg-blue-50">Clics</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsletters.map((nl) => (
                      <TableRow key={nl.name}>
                        <TableCell className="font-medium sticky left-0 bg-white z-10">{nl.name}</TableCell>
                        <TableCell className="text-right bg-blue-50">{nl.siteId}</TableCell>
                        <TableCell className="text-right bg-blue-50">{nl.stats.sent}</TableCell>
                        <TableCell className="text-right bg-blue-50">{nl.stats.opened}</TableCell>
                        <TableCell className="text-right bg-blue-50">{nl.stats.clicked}</TableCell>
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
                  <CardTitle>Taux d'engagement</CardTitle>
                  <CardDescription>Performance des newsletters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium">Newsletter</TableHead>
                      <TableHead className="text-right bg-blue-50">Site</TableHead>
                      <TableHead className="text-right bg-blue-50">Taux d'ouverture</TableHead>
                      <TableHead className="text-right bg-green-50">Taux de clic</TableHead>
                      <TableHead className="text-right bg-green-50">Désabonnements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newsletters.map((nl) => (
                      <TableRow key={nl.name}>
                        <TableCell className="font-medium">{nl.name}</TableCell>
                        <TableCell className="text-right bg-blue-50">{nl.siteId}</TableCell>
                        <TableCell className="text-right bg-blue-50">
                          {nl.stats.sent > 0 ? ((nl.stats.opened / nl.stats.sent) * 100).toFixed(1) : "0"}%
                        </TableCell>
                        <TableCell className="text-right bg-green-50">
                          {nl.stats.opened > 0 ? ((nl.stats.clicked / nl.stats.opened) * 100).toFixed(1) : "0"}%
                        </TableCell>
                        <TableCell className="text-right bg-green-50">{nl.stats.unsubscribed}</TableCell>
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
                <CardDescription>Vue d'ensemble de toutes les newsletters</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Newsletter</TableHead>
                    <TableHead className="text-right bg-blue-50">Site</TableHead>
                    <TableHead className="text-right bg-blue-50">Envoyés</TableHead>
                    <TableHead className="text-right bg-blue-50">Ouverts</TableHead>
                    <TableHead className="text-right bg-blue-50">Taux d'ouverture</TableHead>
                    <TableHead className="text-right bg-yellow-50">Clics</TableHead>
                    <TableHead className="text-right bg-yellow-50">Taux de clic</TableHead>
                    <TableHead className="text-right bg-green-50">Désabonnements</TableHead>
                    <TableHead className="text-right bg-green-50">Dernier envoi</TableHead>
                    <TableHead className="text-right bg-yellow-50">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((nl) => (
                    <TableRow key={nl.name}>
                      <TableCell className="font-medium sticky left-0 bg-white z-10">{nl.name}</TableCell>
                      <TableCell className="text-right bg-blue-50">{nl.siteId}</TableCell>
                      <TableCell className="text-right bg-blue-50">{nl.stats.sent}</TableCell>
                      <TableCell className="text-right bg-blue-50">{nl.stats.opened}</TableCell>
                      <TableCell className="text-right bg-blue-50">
                        {nl.stats.sent > 0 ? ((nl.stats.opened / nl.stats.sent) * 100).toFixed(1) : "0"}%
                      </TableCell>
                      <TableCell className="text-right bg-yellow-50">{nl.stats.clicked}</TableCell>
                      <TableCell className="text-right bg-yellow-50">
                        {nl.stats.opened > 0 ? ((nl.stats.clicked / nl.stats.opened) * 100).toFixed(1) : "0"}%
                      </TableCell>
                      <TableCell className="text-right bg-green-50">{nl.stats.unsubscribed}</TableCell>
                      <TableCell className="text-right bg-green-50">
                        {nl.lastSent ? new Date(nl.lastSent).toLocaleDateString("fr-FR") : "Jamais"}
                      </TableCell>
                      <TableCell className="text-right bg-yellow-50">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nl.actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {nl.actif ? "Actif" : "Inactif"}
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

      <MailPreview open={mailPreviewOpen} onOpenChange={setMailPreviewOpen} mail={mailPreviewData || {}} />
    </Tabs>
  )
}