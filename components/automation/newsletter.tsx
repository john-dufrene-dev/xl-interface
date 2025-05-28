"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, BarChart4, ArrowLeft, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import NewsletterForm from "./newsletter-form"
import NewsletterStats from "./newsletter-stats"
import { FilterBar } from "@/components/filter-bar"
import type { DateRange } from "react-day-picker"
import { MailPreview } from "@/components/automation/mail-preview"

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
  const [selectedNewsletterForDetail, setSelectedNewsletterForDetail] = useState<Newsletter | null>(null)
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

  const handleViewNewsletterDetail = (newsletter: Newsletter) => {
    setSelectedNewsletterForDetail(newsletter)
    setActiveTab("detail")
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
          <Button variant="ghost" size="icon" title="Détail" onClick={() => handleViewNewsletterDetail(row.original)}>
            <Info className="h-4 w-4" />
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
          <TabsTrigger value="detail">Détail</TabsTrigger>
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
            <Button variant="outline" size="sm" onClick={() => setActiveTab("detail")}>
              <Info className="mr-2 h-4 w-4" /> Détail
            </Button>
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
        <NewsletterStats newsletters={newsletters} />
      </TabsContent>

      <TabsContent value="detail" className="space-y-4">
        <div className="mb-4">
          <Button variant="outline" onClick={() => {
            setActiveTab("liste")
            setSelectedNewsletterForDetail(null)
          }}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedNewsletterForDetail
                ? `Détails de la newsletter : ${selectedNewsletterForDetail.name}`
                : "Comprendre les newsletters"}
            </CardTitle>
            <CardDescription>
              {selectedNewsletterForDetail
                ? `Informations détaillées sur la newsletter pour le site ${selectedNewsletterForDetail.siteId}`
                : "Explication détaillée du fonctionnement des newsletters"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedNewsletterForDetail ? (
              <div className="space-y-6">
                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/50 pb-3">
                    <CardTitle className="text-base font-medium">Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{selectedNewsletterForDetail.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Site</p>
                        <p className="font-medium">{selectedNewsletterForDetail.siteId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date de création</p>
                        <p className="font-medium">{new Date(selectedNewsletterForDetail.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/50 pb-3">
                    <CardTitle className="text-base font-medium">Contenu de la newsletter</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Objet</p>
                      <p className="font-medium">{selectedNewsletterForDetail.subject}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Pré-en-tête</p>
                      <p className="font-medium">{selectedNewsletterForDetail.preheader}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Titre du mail</p>
                      <p className="font-medium">{selectedNewsletterForDetail.titreMail}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Texte d'aperçu</p>
                      <p className="font-medium">{selectedNewsletterForDetail.texteApercu}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Image</p>
                      <div className="mt-1 border rounded-md p-2 max-w-xs">
                        <img src={selectedNewsletterForDetail.imageUrl} alt="Aperçu" className="max-w-full h-auto" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Lien de la bannière</p>
                      <p className="font-medium break-all">{selectedNewsletterForDetail.bannerLink}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Paramètres UTM</p>
                      <ul className="text-xs text-muted-foreground pl-4 list-disc">
                        <li>Source : {selectedNewsletterForDetail.utmSource}</li>
                        <li>Medium : {selectedNewsletterForDetail.utmMedium}</li>
                        <li>Campaign : {selectedNewsletterForDetail.utmCampaign}</li>
                        <li>Term : {selectedNewsletterForDetail.utmTerm}</li>
                        <li>Content : {selectedNewsletterForDetail.utmContent}</li>
                      </ul>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Contenu du mail (partie haute)</p>
                      <div className="prose prose-sm max-w-none border rounded p-3 bg-white" dangerouslySetInnerHTML={{ __html: selectedNewsletterForDetail.contenuMailHaut }} />
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Contenu du mail (partie basse)</p>
                      <div className="prose prose-sm max-w-none border rounded p-3 bg-white" dangerouslySetInnerHTML={{ __html: selectedNewsletterForDetail.contenuMailBas }} />
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Texte du bouton</p>
                      <p className="font-medium">{selectedNewsletterForDetail.texteButton}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Lien du bouton</p>
                      <p className="font-medium break-all">{selectedNewsletterForDetail.buttonLink}</p>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Paramètres UTM du bouton</p>
                      <ul className="text-xs text-muted-foreground pl-4 list-disc">
                        <li>Source : {selectedNewsletterForDetail.buttonUtmSource}</li>
                        <li>Medium : {selectedNewsletterForDetail.buttonUtmMedium}</li>
                        <li>Campaign : {selectedNewsletterForDetail.buttonUtmCampaign}</li>
                        <li>Term : {selectedNewsletterForDetail.buttonUtmTerm}</li>
                        <li>Content : {selectedNewsletterForDetail.buttonUtmContent}</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardHeader className="bg-muted/50 pb-3">
                    <CardTitle className="text-base font-medium">Audience</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="p-4 bg-muted/20 rounded-md">
                      <p>
                        <span className="font-medium">Tous les inscrits à la newsletter</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMailPreviewData({
                      titreMail: selectedNewsletterForDetail.titreMail,
                      sujet: selectedNewsletterForDetail.subject,
                      texteApercu: selectedNewsletterForDetail.texteApercu,
                      imageUrl: selectedNewsletterForDetail.imageUrl,
                      bannerLink: selectedNewsletterForDetail.bannerLink,
                      utmSource: selectedNewsletterForDetail.utmSource,
                      utmMedium: selectedNewsletterForDetail.utmMedium,
                      utmCampaign: selectedNewsletterForDetail.utmCampaign,
                      utmTerm: selectedNewsletterForDetail.utmTerm,
                      utmContent: selectedNewsletterForDetail.utmContent,
                      buttonLink: selectedNewsletterForDetail.buttonLink,
                      buttonUtmSource: selectedNewsletterForDetail.buttonUtmSource,
                      buttonUtmMedium: selectedNewsletterForDetail.buttonUtmMedium,
                      buttonUtmCampaign: selectedNewsletterForDetail.buttonUtmCampaign,
                      buttonUtmTerm: selectedNewsletterForDetail.buttonUtmTerm,
                      buttonUtmContent: selectedNewsletterForDetail.buttonUtmContent,
                      contenuHaut: selectedNewsletterForDetail.contenuMailHaut,
                      contenuBas: selectedNewsletterForDetail.contenuMailBas,
                      texteButton: selectedNewsletterForDetail.texteButton,
                    })
                    setMailPreviewOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" /> Visualiser
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Qu'est-ce qu'une newsletter ?</h3>
                <p>
                  Une newsletter est un email envoyé régulièrement à vos clients pour les informer de vos nouveautés, promotions ou actualités. Elle permet de fidéliser votre audience et de générer du trafic vers votre site.
                </p>
                <h3 className="text-lg font-medium">Structure d'une newsletter</h3>
                <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                  <p>Chaque newsletter est composée des éléments suivants :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Objet</strong> : Le sujet de l'email</li>
                    <li><strong>Pré-en-tête</strong> : Le texte d'aperçu visible dans la boîte de réception</li>
                    <li><strong>Contenu</strong> : Le corps de l'email, souvent en HTML</li>
                    <li><strong>Template</strong> : Le modèle graphique utilisé</li>
                    <li><strong>Critère d'inscription</strong> : Envoi uniquement aux utilisateurs inscrits à la newsletter</li>
                  </ul>
                </div>
                <h3 className="text-lg font-medium">Statistiques</h3>
                <p>Pour chaque newsletter, vous pouvez consulter des statistiques détaillées :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nombre d'emails envoyés</li>
                  <li>Nombre d'ouvertures</li>
                  <li>Nombre de clics</li>
                  <li>Nombre de désabonnements</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <MailPreview open={mailPreviewOpen} onOpenChange={setMailPreviewOpen} mail={mailPreviewData || {}} />
    </Tabs>
  )
}