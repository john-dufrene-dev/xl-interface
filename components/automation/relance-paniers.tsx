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
    cell: ({ row }: { row: { original: Scenario } }) => (
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
    cell: ({ row }: { row: { original: Scenario } }) => row.original.etapes.length,
  },
  {
    id: "dateCreation",
    accessorKey: "dateCreation",
    header: "Date de création",
    cell: ({ row }: { row: { original: Scenario } }) => {
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
    cell: ({ row }: { row: { original: Scenario } }) => (
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

// Nouvelle structure de statistiques basée sur la structure SQL
// Les données seraient normalement récupérées via une API ou une requête SQL sur les tables :
// - itekstats_relance_scenario_mail (is_send, is_open, nb_opened)
// - itekstats_relance_scenario_mail_click (pour les clics)

// Exemple de structure de stats pour affichage (à remplacer par des requêtes réelles côté back)
const getScenarioStats = (scenarioId: string) => {
  // Ces valeurs sont fictives, à remplacer par des requêtes réelles
  return {
    nbMailsSent: 120, // Nombre d'emails envoyés (is_send)
    nbMailsOpened: 80, // Nombre d'emails ouverts (is_open)
    nbOpenedTotal: 150, // Nombre total d'ouvertures (nb_opened)
    nbClicks: 45, // Nombre total de clics (mail_click)
    openRate: 80 / 120 * 100, // Taux d'ouverture (%)
    clickRate: 45 / 120 * 100, // Taux de clic (%)
  }
}

export default function RelancePaniers() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("liste")
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null)
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined)
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
  const [selectedStepForPreview, setSelectedStepForPreview] = useState<RelanceStep | null>(null)

  // Génération de métriques factices par scénario
  const scenarioMetrics = scenarios.map((s) => {
    // Simule des valeurs réalistes
    const paniers_relances = Math.floor(Math.random() * 120 + 30)
    const paniers_convertis = Math.floor(paniers_relances * (Math.random() * 0.3 + 0.15))
    const taux_conversion = paniers_relances > 0 ? (paniers_convertis / paniers_relances) * 100 : 0
    const is_send = paniers_relances + Math.floor(Math.random() * 40)
    const is_open = Math.floor(is_send * (Math.random() * 0.5 + 0.3))
    const nb_opened = is_open + Math.floor(is_open * (Math.random() * 1.2))
    const nb_clicks = Math.floor(is_open * (Math.random() * 0.4 + 0.1))
    const openRate = is_send > 0 ? (is_open / is_send) * 100 : 0
    const clickRate = is_send > 0 ? (nb_clicks / is_send) * 100 : 0
    return {
      nom: s.nom,
      site: s.siteName,
      paniers_relances,
      paniers_convertis,
      taux_conversion: taux_conversion.toFixed(1),
      is_send,
      is_open,
      nb_opened,
      nb_clicks,
      openRate: openRate.toFixed(1),
      clickRate: clickRate.toFixed(1),
    }
  })

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
      cell: ({ row }: { row: { original: Scenario } }) => (
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
                <CardTitle>Scénarios de relance</CardTitle>
                <CardDescription>Gérez vos scénarios de relance de paniers abandonnés</CardDescription>
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
          <ScenarioForm
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
                <CardTitle className="text-base">Paniers relancés</CardTitle>
                <CardDescription className="text-xs">Total sur tous les scénarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scenarioMetrics.reduce((acc, sc) => acc + sc.paniers_relances, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Paniers convertis</CardTitle>
                <CardDescription className="text-xs">Total sur tous les scénarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {scenarioMetrics.reduce((acc, sc) => acc + sc.paniers_convertis, 0)}
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
                    const totalRelances = scenarioMetrics.reduce((acc, sc) => acc + sc.paniers_relances, 0)
                    const totalConvertis = scenarioMetrics.reduce((acc, sc) => acc + sc.paniers_convertis, 0)
                    return totalRelances > 0 ? ((totalConvertis / totalRelances) * 100).toFixed(1) : "0"
                  })()}%
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
                  {scenarioMetrics.reduce((acc, sc) => acc + sc.is_send, 0)}
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
                    <CardTitle>Relance & Conversion par scénario</CardTitle>
                    <CardDescription>Comparaison des performances</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarioMetrics}
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
                      <Bar dataKey="paniers_relances" name="Paniers relancés" fill="#3b82f6" />
                      <Bar dataKey="paniers_convertis" name="Paniers convertis" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Emailing par scénario</CardTitle>
                    <CardDescription>Performance des emails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={scenarioMetrics}
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
                      <Bar dataKey="is_send" name="Emails envoyés" fill="#3b82f6" />
                      <Bar dataKey="is_open" name="Emails ouverts" fill="#10b981" />
                      <Bar dataKey="nb_clicks" name="Clics" fill="#f59e0b" />
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
                    <CardTitle>Taux de performance</CardTitle>
                    <CardDescription>Comparaison des taux</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={scenarioMetrics}
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
                      <Line
                        type="monotone"
                        dataKey="openRate"
                        name="Taux d'ouverture (%)"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="clickRate"
                        name="Taux de clic (%)"
                        stroke="#f59e0b"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="taux_conversion"
                        name="Taux de conversion (%)"
                        stroke="#10b981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition des conversions</CardTitle>
                    <CardDescription>Part de chaque scénario</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scenarioMetrics.map(sc => ({
                          name: sc.nom,
                          value: sc.paniers_convertis
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {scenarioMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Paniers convertis"]} />
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
                    <CardTitle>Relance & Conversion</CardTitle>
                    <CardDescription>Performance des scénarios</CardDescription>
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
                        <TableHead className="text-right bg-blue-50">Paniers relancés</TableHead>
                        <TableHead className="text-right bg-green-50">Paniers convertis</TableHead>
                        <TableHead className="text-right bg-green-50">Taux de conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenarioMetrics.map((sc) => (
                        <TableRow key={sc.nom}>
                          <TableCell className="font-medium">{sc.nom}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.site}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.paniers_relances}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.paniers_convertis}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.taux_conversion}%</TableCell>
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
                    <CardTitle>Emailing</CardTitle>
                    <CardDescription>Performance des emails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="bg-gray-100 font-medium">Scénario</TableHead>
                        <TableHead className="text-right bg-blue-50">Emails envoyés</TableHead>
                        <TableHead className="text-right bg-blue-50">Emails ouverts</TableHead>
                        <TableHead className="text-right bg-green-50">Taux d'ouverture</TableHead>
                        <TableHead className="text-right bg-green-50">Total clics</TableHead>
                        <TableHead className="text-right bg-green-50">Taux de clic</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scenarioMetrics.map((sc) => (
                        <TableRow key={sc.nom}>
                          <TableCell className="font-medium">{sc.nom}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.is_send}</TableCell>
                          <TableCell className="text-right bg-blue-50">{sc.is_open}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.openRate}%</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.nb_clicks}</TableCell>
                          <TableCell className="text-right bg-green-50">{sc.clickRate}%</TableCell>
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
                      <TableHead className="text-right bg-blue-50">Paniers relancés</TableHead>
                      <TableHead className="text-right bg-blue-50">Paniers convertis</TableHead>
                      <TableHead className="text-right bg-blue-50">Taux de conversion</TableHead>
                      <TableHead className="text-right bg-yellow-50">Emails envoyés</TableHead>
                      <TableHead className="text-right bg-yellow-50">Emails ouverts</TableHead>
                      <TableHead className="text-right bg-yellow-50">Taux d'ouverture</TableHead>
                      <TableHead className="text-right bg-green-50">Total ouvertures</TableHead>
                      <TableHead className="text-right bg-green-50">Total clics</TableHead>
                      <TableHead className="text-right bg-green-50">Taux de clic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarioMetrics.map((sc) => (
                      <TableRow key={sc.nom}>
                        <TableCell className="font-medium sticky left-0 bg-white z-10">{sc.nom}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.site}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.paniers_relances}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.paniers_convertis}</TableCell>
                        <TableCell className="text-right bg-blue-50">{sc.taux_conversion}%</TableCell>
                        <TableCell className="text-right bg-yellow-50">{sc.is_send}</TableCell>
                        <TableCell className="text-right bg-yellow-50">{sc.is_open}</TableCell>
                        <TableCell className="text-right bg-yellow-50">{sc.openRate}%</TableCell>
                        <TableCell className="text-right bg-green-50">{sc.nb_opened}</TableCell>
                        <TableCell className="text-right bg-green-50">{sc.nb_clicks}</TableCell>
                        <TableCell className="text-right bg-green-50">{sc.clickRate}%</TableCell>
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
