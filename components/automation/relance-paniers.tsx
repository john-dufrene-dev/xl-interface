"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Power, BarChart4, ArrowLeft, Info, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { ScenarioForm } from "@/components/automation/scenario-form"
import { ScenarioStats } from "@/components/automation/scenario-stats"
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

// Types pour les scénarios de relance
type RelanceStep = {
  id: string
  delai: number
  delaiUnite: "heures" | "jours"
  titreMail?: string
  sujet: string
  texteApercu?: string
  contenu: string
  contenuHaut?: string
  contenuBas?: string
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
  bonReductionActif?: boolean
  montantReduction?: number
  typeReduction?: "pourcentage" | "euro"
}

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
    delaiCreation: number
    delaiCreationUnite: "heures" | "jours"
    statut: "non_traite" | "tous"
    bonReductionActif?: boolean
    montantReduction?: number
    typeReduction?: "pourcentage" | "euro"
  }
  etapes: RelanceStep[]
  actif: boolean
  dateCreation: string
  statistiques: {
    totalPaniers: number
    paniersRelances: number
    paniersConvertis: number
    tauxConversion: number
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
    nom: "Relance site 1",
    siteId: "1",
    siteName: "Site principal",
    titreMail: "Newsletter - Site Principal",
    sujetMail: "Votre panier vous attend sur Site Principal",
    texteApercu: "Découvrez les articles que vous avez sélectionnés et profitez de nos offres exclusives !",
    contenuMailHaut:
      "Bonjour cher client, nous avons remarqué que vous avez laissé des articles dans votre panier. Voici un rappel des produits que vous avez sélectionnés.",
    contenuMailBas:
      "N'hésitez pas à finaliser votre commande pour profiter de ces articles. Notre équipe reste à votre disposition pour toute question.",
    imageUrl: "https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Site+Principal",
    bannerLink: "https://www.siteprincipal.com/promo",
    utmSource: "email",
    utmMedium: "banner",
    utmCampaign: "cart_recovery",
    buttonLink: "https://www.siteprincipal.com/panier",
    buttonUtmSource: "email",
    buttonUtmMedium: "button",
    buttonUtmCampaign: "cart_recovery",
    texteButton: "Retourner à mon panier",
    criteres: {
      delaiCreation: 1,
      delaiCreationUnite: "jours",
      statut: "non_traite",
    },
    etapes: [
      {
        id: "1-1",
        delai: 4,
        delaiUnite: "heures",
        titreMail: "Rappel - Votre panier sur Site Principal",
        sujet: "Votre panier vous attend !",
        texteApercu: "Vos articles sont toujours disponibles, ne manquez pas cette opportunité !",
        contenu: "Nous avons remarqué que vous avez laissé des articles dans votre panier...",
        contenuHaut:
          "Cher client, nous avons remarqué que vous avez laissé des articles dans votre panier il y a quelques heures. Ces articles sont toujours disponibles et vous attendent !",
        contenuBas:
          "Cliquez sur le bouton ci-dessous pour retourner à votre panier et finaliser votre commande. Notre service client est disponible pour vous aider si nécessaire.",
        imageUrl: "https://placehold.co/600x200/3b82f6/ffffff?text=Rappel+Panier+Etape+1",
        bannerLink: "https://www.siteprincipal.com/panier",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step1",
        buttonLink: "https://www.siteprincipal.com/panier",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step1",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step1",
        texteButton: "Voir mon panier",
      },
      {
        id: "1-2",
        delai: 1,
        delaiUnite: "jours",
        titreMail: "Dernière chance - Site Principal",
        sujet: "Dernière chance : votre panier expire bientôt",
        texteApercu: "Ne manquez pas les articles que vous avez sélectionnés, ils sont très demandés !",
        contenu: "Les articles dans votre panier sont très demandés...",
        contenuHaut:
          "Attention ! Les articles dans votre panier sont très demandés et pourraient ne plus être disponibles très bientôt. Ne manquez pas cette opportunité !",
        contenuBas:
          "Pour vous remercier de votre intérêt, nous vous offrons 5% de réduction sur votre commande si vous la finalisez dans les prochaines 24 heures. Utilisez le code PANIER5 lors de votre commande.",
        imageUrl: "https://placehold.co/600x200/ef4444/ffffff?text=Derniere+Chance+Panier",
        bannerLink: "https://www.siteprincipal.com/panier-promo",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step2",
        buttonLink: "https://www.siteprincipal.com/panier-promo",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step2",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step2",
        texteButton: "Profiter de l'offre",
        bonReductionActif: true,
        montantReduction: 5,
        typeReduction: "pourcentage",
      },
    ],
    actif: true,
    dateCreation: getCurrentDate(), // Date actuelle
    statistiques: {
      totalPaniers: 120,
      paniersRelances: 98,
      paniersConvertis: 23,
      tauxConversion: 23.5,
    },
  },
  {
    id: "2",
    nom: "Relance site 2",
    siteId: "2",
    siteName: "Site secondaire",
    titreMail: "Newsletter - Site Secondaire",
    sujetMail: "Vos produits sélectionnés sur Site Secondaire",
    texteApercu: "Retrouvez les articles que vous avez ajoutés à votre panier et bénéficiez d'une offre spéciale !",
    contenuMailHaut:
      "Cher client, merci pour votre visite sur notre site. Nous avons conservé les articles que vous avez ajoutés à votre panier pour faciliter votre prochaine visite.",
    contenuMailBas:
      "Pour toute commande finalisée dans les 48 heures, nous vous offrons la livraison gratuite. N'hésitez pas à nous contacter pour toute question.",
    imageUrl: "https://placehold.co/600x200/10b981/ffffff?text=Banner+Site+Secondaire",
    bannerLink: "https://www.sitesecondaire.com/promo",
    utmSource: "email",
    utmMedium: "banner",
    utmCampaign: "cart_recovery",
    buttonLink: "https://www.sitesecondaire.com/panier",
    buttonUtmSource: "email",
    buttonUtmMedium: "button",
    buttonUtmCampaign: "cart_recovery",
    texteButton: "Finaliser ma commande",
    criteres: {
      delaiCreation: 12,
      delaiCreationUnite: "heures",
      statut: "non_traite",
    },
    etapes: [
      {
        id: "2-1",
        delai: 2,
        delaiUnite: "heures",
        titreMail: "Rappel - Votre sélection sur Site Secondaire",
        sujet: "Ne manquez pas ces articles !",
        texteApercu: "Vos produits sélectionnés sont toujours disponibles dans votre panier",
        contenu: "Vous avez sélectionné des produits de qualité...",
        contenuHaut:
          "Bonjour, vous avez récemment visité notre site et sélectionné des produits de qualité. Nous les avons gardés dans votre panier pour vous faciliter la vie !",
        contenuBas:
          "Votre panier est accessible en un clic. Nos conseillers sont disponibles pour répondre à toutes vos questions sur nos produits.",
        imageUrl: "https://placehold.co/600x200/059669/ffffff?text=Rappel+Selection+Etape+1",
        bannerLink: "https://www.sitesecondaire.com/selection",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step1",
        buttonLink: "https://www.sitesecondaire.com/panier",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step1",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step1",
        texteButton: "Accéder à mon panier",
      },
      {
        id: "2-2",
        delai: 10,
        delaiUnite: "heures",
        titreMail: "Offre spéciale - Site Secondaire",
        sujet: "Offre spéciale sur votre panier",
        texteApercu: "Profitez d'une réduction exclusive sur les articles de votre panier",
        contenu: "Pour vous remercier de votre intérêt, nous vous offrons 5% de réduction...",
        contenuHaut:
          "Nous avons une offre spéciale pour vous ! Pour vous remercier de votre intérêt pour nos produits, nous vous offrons 5% de réduction sur l'ensemble de votre panier.",
        contenuBas:
          "Cette offre est valable pendant 24 heures seulement. Utilisez le code MERCI5 lors de votre commande pour en bénéficier.",
        imageUrl: "https://placehold.co/600x200/0ea5e9/ffffff?text=Offre+Speciale+Etape+2",
        bannerLink: "https://www.sitesecondaire.com/offre",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step2",
        buttonLink: "https://www.sitesecondaire.com/offre",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step2",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step2",
        texteButton: "Profiter de l'offre",
        bonReductionActif: true,
        montantReduction: 5,
        typeReduction: "pourcentage",
      },
      {
        id: "2-3",
        delai: 2,
        delaiUnite: "jours",
        titreMail: "Dernière relance - Site Secondaire",
        sujet: "Dernière relance pour votre panier",
        texteApercu: "Votre panier sera bientôt supprimé, ne manquez pas cette opportunité",
        contenu: "Votre panier sera bientôt supprimé, ne manquez pas cette opportunité...",
        contenuHaut:
          "Attention ! Votre panier sera automatiquement supprimé dans 24 heures. Ne manquez pas l'opportunité d'acquérir les produits que vous avez sélectionnés.",
        contenuBas:
          "Pour vous encourager à finaliser votre achat, nous vous offrons 10% de réduction sur votre commande avec le code DERNIER10. Cette offre est valable uniquement aujourd'hui !",
        imageUrl: "https://placehold.co/600x200/f97316/ffffff?text=Derniere+Relance+Etape+3",
        bannerLink: "https://www.sitesecondaire.com/derniere-chance",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step3",
        buttonLink: "https://www.sitesecondaire.com/derniere-chance",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step3",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step3",
        texteButton: "Finaliser avec 10% de réduction",
        bonReductionActif: true,
        montantReduction: 10,
        typeReduction: "pourcentage",
      },
    ],
    actif: false,
    dateCreation: getRecentDate(2), // Il y a 2 jours
    statistiques: {
      totalPaniers: 85,
      paniersRelances: 72,
      paniersConvertis: 18,
      tauxConversion: 25.0,
    },
  },
  {
    id: "3",
    nom: "Relance site 3",
    siteId: "3",
    siteName: "Site e-commerce",
    titreMail: "Newsletter - Site E-commerce",
    sujetMail: "Offre flash sur votre panier Site E-commerce",
    texteApercu: "Profitez d'une remise exceptionnelle sur les articles de votre panier pendant 1 heure seulement !",
    contenuMailHaut:
      "Cher client, nous vous proposons une offre flash exceptionnelle sur les articles que vous avez laissés dans votre panier. Cette offre est limitée dans le temps !",
    contenuMailBas:
      "Pour bénéficier de cette offre, il vous suffit de finaliser votre commande dans l'heure qui suit. Notre équipe est à votre disposition pour vous accompagner.",
    imageUrl: "https://placehold.co/600x200/8b5cf6/ffffff?text=Banner+Site+Ecommerce",
    bannerLink: "https://www.siteecommerce.com/offre-flash",
    utmSource: "email",
    utmMedium: "banner",
    utmCampaign: "cart_recovery",
    buttonLink: "https://www.siteecommerce.com/panier-flash",
    buttonUtmSource: "email",
    buttonUtmMedium: "button",
    buttonUtmCampaign: "cart_recovery",
    buttonUtmContent: "cta_button",
    texteButton: "Profiter de l'offre flash",
    criteres: {
      delaiCreation: 6,
      delaiCreationUnite: "heures",
      statut: "non_traite",
    },
    etapes: [
      {
        id: "3-1",
        delai: 1,
        delaiUnite: "heures",
        titreMail: "Offre flash - Site E-commerce",
        sujet: "Offre flash sur votre panier !",
        texteApercu: "Remise exceptionnelle de 10% sur votre panier pendant 1 heure seulement !",
        contenu: "Profitez d'une remise exceptionnelle de 10% sur votre panier pendant 1 heure seulement !",
        contenuHaut:
          "OFFRE EXCEPTIONNELLE ! Nous vous offrons une remise de 10% sur l'ensemble des articles de votre panier si vous finalisez votre commande dans l'heure qui suit.",
        contenuBas:
          "Cette offre est strictement limitée dans le temps. Utilisez le code FLASH10 lors de votre commande pour bénéficier de cette remise. Ne manquez pas cette opportunité !",
        imageUrl: "https://placehold.co/600x200/ec4899/ffffff?text=Offre+Flash+Etape+1",
        bannerLink: "https://www.siteecommerce.com/offre-flash-etape1",
        utmSource: "email",
        utmMedium: "banner",
        utmCampaign: "cart_recovery_step1",
        buttonLink: "https://www.siteecommerce.com/panier-flash",
        buttonUtmSource: "email",
        buttonUtmMedium: "button",
        buttonUtmCampaign: "cart_recovery_step1",
        buttonUtmTerm: "",
        buttonUtmContent: "cta_step1",
        texteButton: "Commander maintenant",
        bonReductionActif: true,
        montantReduction: 10,
        typeReduction: "pourcentage",
      },
    ],
    actif: true,
    dateCreation: getRecentDate(1), // Il y a 1 jour
    statistiques: {
      totalPaniers: 45,
      paniersRelances: 45,
      paniersConvertis: 12,
      tauxConversion: 26.7,
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
    id: "etapes",
    accessorKey: "etapes",
    header: "Étapes",
    cell: ({ row }) => row.original.etapes.length,
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

export default function RelancePaniers() {
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
  const [selectedStepForPreview, setSelectedStepForPreview] = useState<RelanceStep | null>(null)

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
          totalPaniers: 0,
          paniersRelances: 0,
          paniersConvertis: 0,
          tauxConversion: 0,
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
      buttonLink: scenario.buttonLink,
      buttonUtmSource: scenario.buttonUtmSource,
      buttonUtmMedium: scenario.buttonUtmMedium,
      buttonUtmCampaign: scenario.buttonUtmCampaign,
      contenuHaut: scenario.contenuMailHaut,
      contenuBas: scenario.contenuMailBas,
      texteButton: scenario.texteButton,
    })
    setSelectedStepForPreview(null)
    setMailPreviewOpen(true)
  }

  const handlePreviewStepMail = (step: RelanceStep) => {
    setPreviewMail({
      titreMail: step.titreMail,
      sujet: step.sujet,
      texteApercu: step.texteApercu,
      imageUrl: step.imageUrl,
      bannerLink: step.bannerLink,
      utmSource: step.utmSource,
      utmMedium: step.utmMedium,
      utmCampaign: step.utmCampaign,
      buttonLink: step.buttonLink,
      buttonUtmSource: step.buttonUtmSource,
      buttonUtmMedium: step.buttonUtmMedium,
      buttonUtmCampaign: step.buttonUtmCampaign,
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
                <CardTitle>Scénarios de relance</CardTitle>
                <CardDescription>Gérez vos scénarios de relance de paniers abandonnés</CardDescription>
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
          <ScenarioForm
            scenario={editingScenario}
            onCancel={() => setActiveTab("liste")}
            onSubmit={handleSubmitScenario}
          />
        </TabsContent>
        <TabsContent value="statistiques">
          <ScenarioStats />
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
                  : "Comprendre les scénarios de relance"}
              </CardTitle>
              <CardDescription>
                {selectedScenarioForDetail
                  ? `Informations détaillées sur le scénario de relance pour ${selectedScenarioForDetail.siteName}`
                  : "Explication détaillée du fonctionnement des scénarios de relance de paniers abandonnés"}
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
                          selectedScenarioForDetail.utmCampaign) && (
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
                            </div>
                          </div>
                        )}
                        {(selectedScenarioForDetail.buttonUtmSource ||
                          selectedScenarioForDetail.buttonUtmMedium ||
                          selectedScenarioForDetail.buttonUtmCampaign) && (
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
                      <div className="p-4 bg-muted/20 rounded-md">
                        <p>
                          Les paniers sont considérés comme abandonnés après{" "}
                          <span className="font-medium">
                            {selectedScenarioForDetail.criteres.delaiCreation}{" "}
                            {selectedScenarioForDetail.criteres.delaiCreationUnite === "heures"
                              ? "heure(s)"
                              : "jour(s)"}
                          </span>{" "}
                          sans activité.
                        </p>
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
                                {selectedScenarioForDetail.criteres.montantReduction} {selectedScenarioForDetail.criteres.typeReduction === "pourcentage" ? "%" : "€"}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base font-medium">
                        Étapes de relance ({selectedScenarioForDetail.etapes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {selectedScenarioForDetail.etapes.map((etape, index) => (
                        <Card key={etape.id} className="border border-gray-200">
                          <CardHeader className="bg-muted/30 pb-2 flex flex-row justify-between items-center">
                            <CardTitle className="text-base">Mail de relance {index + 1}</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => handlePreviewStepMail(etape)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualiser
                            </Button>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-4">
                            <div className="p-3 bg-muted/20 rounded-md">
                              <p className="text-sm text-muted-foreground">Délai avant envoi</p>
                              <p className="font-medium">
                                {etape.delai} {etape.delaiUnite === "heures" ? "heure(s)" : "jour(s)"}
                                {index === 0 ? " après l'abandon du panier" : " après l'étape précédente"}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Objet du mail</p>
                                <p className="font-medium">{etape.sujet}</p>
                              </div>
                              {etape.texteApercu && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Texte d'aperçu</p>
                                  <p className="font-medium">{etape.texteApercu}</p>
                                </div>
                              )}
                            </div>

                            {etape.titreMail && (
                              <div>
                                <p className="text-sm text-muted-foreground">Titre du mail</p>
                                <p className="font-medium">{etape.titreMail}</p>
                              </div>
                            )}

                            {etape.imageUrl && (
                              <div>
                                <p className="text-sm text-muted-foreground">Image du mail</p>
                                <div className="mt-2 border rounded-md p-2">
                                  <img
                                    src={etape.imageUrl || "/placeholder.svg"}
                                    alt="Image du mail"
                                    className="max-w-full h-auto"
                                  />
                                </div>
                              </div>
                            )}

                            <div>
                              <p className="text-sm text-muted-foreground">Contenu du mail (partie haute)</p>
                              <p className="text-sm border rounded-md p-3 bg-muted/20">
                                {etape.contenuHaut || etape.contenu}
                              </p>
                            </div>

                            {etape.contenuBas && (
                              <div>
                                <p className="text-sm text-muted-foreground">Contenu du mail (partie basse)</p>
                                <p className="text-sm border rounded-md p-3 bg-muted/20">{etape.contenuBas}</p>
                              </div>
                            )}

                            {etape.texteButton && (
                              <div>
                                <p className="text-sm text-muted-foreground">Texte du bouton</p>
                                <p className="font-medium">{etape.texteButton}</p>
                              </div>
                            )}
                            {etape.bannerLink && (
                              <div>
                                <p className="text-sm text-muted-foreground">Lien de la bannière</p>
                                <p className="font-medium break-all">{etape.bannerLink}</p>
                              </div>
                            )}
                            {etape.buttonLink && (
                              <div>
                                <p className="text-sm text-muted-foreground">Lien du bouton</p>
                                <p className="font-medium break-all">{etape.buttonLink}</p>
                              </div>
                            )}
                            {etape.bonReductionActif !== undefined && (
                              <div className="mt-4 p-3 bg-muted/30 rounded-md">
                                <p className="mb-2">
                                  <span className="font-medium">Bon de réduction: </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      etape.bonReductionActif
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {etape.bonReductionActif ? "Activé" : "Désactivé"}
                                  </span>
                                </p>
                                {etape.bonReductionActif && (
                                  <div className="mt-2">
                                    <p>
                                      <span className="font-medium">Réduction: </span>
                                      {etape.montantReduction} {etape.typeReduction === "pourcentage" ? "%" : "€"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                            {(etape.utmSource ||
                              etape.utmMedium ||
                              etape.utmCampaign) && (
                              <div>
                                <p className="text-sm text-muted-foreground">Paramètres UTM de la bannière</p>
                                <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                  {etape.utmSource && (
                                    <div>
                                      <span className="font-medium">Source:</span> {etape.utmSource}
                                    </div>
                                  )}
                                  {etape.utmMedium && (
                                    <div>
                                      <span className="font-medium">Medium:</span> {etape.utmMedium}
                                    </div>
                                  )}
                                  {etape.utmCampaign && (
                                    <div>
                                      <span className="font-medium">Campaign:</span> {etape.utmCampaign}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {(etape.buttonUtmSource ||
                              etape.buttonUtmMedium ||
                              etape.buttonUtmCampaign) && (
                              <div>
                                <p className="text-sm text-muted-foreground">Paramètres UTM du bouton</p>
                                <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                                  {etape.buttonUtmSource && (
                                    <div>
                                      <span className="font-medium">Source:</span> {etape.buttonUtmSource}
                                    </div>
                                  )}
                                  {etape.buttonUtmMedium && (
                                    <div>
                                      <span className="font-medium">Medium:</span> {etape.buttonUtmMedium}
                                    </div>
                                  )}
                                  {etape.buttonUtmCampaign && (
                                    <div>
                                      <span className="font-medium">Campaign:</span> {etape.buttonUtmCampaign}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/50 pb-3">
                      <CardTitle className="text-base font-medium">Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total paniers</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.totalPaniers}</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Paniers relancés</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.paniersRelances}</p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Paniers convertis</p>
                          <p className="text-2xl font-bold">
                            {selectedScenarioForDetail.statistiques.paniersConvertis}
                          </p>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground">Taux de conversion</p>
                          <p className="text-2xl font-bold">{selectedScenarioForDetail.statistiques.tauxConversion}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Qu'est-ce qu'un scénario de relance ?</h3>
                  <p>
                    Un scénario de relance est une séquence automatisée d'emails envoyés aux clients qui ont abandonné
                    leur panier d'achat. L'objectif est de rappeler au client les produits qu'il a laissés dans son
                    panier et de l'encourager à finaliser son achat.
                  </p>

                  <h3 className="text-lg font-medium">Structure d'un mail de relance</h3>
                  <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                    <p>Chaque mail de relance est composé des éléments suivants :</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Objet du mail</strong> : L'objet qui apparaît dans la boîte de réception du client (ex:
                        "Votre panier vous attend !")
                      </li>
                      <li>
                        <strong>Texte d'aperçu</strong> : Le texte qui apparaît comme prévisualisation dans certains
                        clients mail (ex: "Découvrez les articles que vous avez sélectionnés...")
                      </li>
                      <li>
                        <strong>Titre du mail</strong> : Le titre qui apparaît dans l'en-tête du mail (ex: "Newsletter -
                        Site Principal")
                      </li>
                      <li>
                        <strong>Image du mail</strong> : Une bannière ou image principale qui apparaît en haut du mail
                      </li>
                      <li>
                        <strong>Contenu du mail (partie haute)</strong> : Le texte principal qui apparaît au début du
                        mail
                      </li>
                      <li>
                        <strong>Contenu du mail (partie basse)</strong> : Le texte qui apparaît en fin de mail,
                        généralement pour inciter à l'action
                      </li>
                      <li>
                        <strong>Texte du bouton</strong> : Le texte du bouton d'action (ex: "Voir mon panier")
                      </li>
                      <li>
                        <strong>Liens et paramètres UTM</strong> : Les liens de la bannière et du bouton, ainsi que les
                        paramètres de suivi UTM pour analyser les performances
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-medium">Comment fonctionne un scénario ?</h3>
                  <p>
                    Chaque scénario est composé d'une ou plusieurs étapes. Une étape correspond à l'envoi d'un email à
                    un moment précis. Le délai entre chaque étape est configurable, ainsi que le contenu de chaque
                    email.
                  </p>

                  <h3 className="text-lg font-medium">Critères d'inscription</h3>
                  <p>
                    Les critères d'inscription déterminent quels paniers abandonnés seront inclus dans le scénario de
                    relance. Vous pouvez définir un délai après lequel un panier est considéré comme abandonné.
                  </p>

                  <h3 className="text-lg font-medium">Étapes de relance</h3>
                  <p>Chaque étape de relance correspond à l'envoi d'un email. Vous pouvez configurer :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Le délai avant l'envoi de l'email (par rapport à l'étape précédente ou à l'abandon du panier pour
                      la première étape)
                    </li>
                    <li>Le titre, le sujet et le texte d'aperçu du mail</li>
                    <li>L'image à inclure dans le mail</li>
                    <li>Le contenu du mail (parties haute et basse)</li>
                    <li>Les liens et paramètres UTM pour le suivi des performances</li>
                  </ul>

                  <h3 className="text-lg font-medium">Statistiques</h3>
                  <p>Pour chaque scénario, vous pouvez consulter des statistiques détaillées :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nombre total de paniers concernés</li>
                    <li>Nombre de paniers relancés</li>
                    <li>Nombre de paniers convertis en commande</li>
                    <li>Taux de conversion</li>
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
