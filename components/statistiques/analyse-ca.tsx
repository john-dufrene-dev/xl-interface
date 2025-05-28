"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { format, startOfWeek, endOfWeek } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { FilterBar } from "@/components/filter-bar"
import { ExportButton } from "@/components/export-button"

// Types
type DonneeCA = {
  date: string
  nbCommandes: number
  ca: number
  caHT: number
  caHTSansLivraison: number
  caLivraison: number
  panierMoyen: number
  panierMoyenHT: number
  caItek: number
  caHorsItek: number
  ventesItek: number
  ventesHorsItek: number
  marketplace: boolean
  id_site: string
  type_marketplace?: "amazon" | "cdiscount" | "docmorris" | "shein" | "autre"
}

// Données de démonstration
const donneesCA: DonneeCA[] = [
  {
    date: "2023-05-01",
    nbCommandes: 42,
    ca: 4830,
    caHT: 4025,
    caHTSansLivraison: 3775,
    caLivraison: 250,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 3220,
    caHorsItek: 1610,
    ventesItek: 28,
    ventesHorsItek: 14,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-02",
    nbCommandes: 38,
    ca: 4370,
    caHT: 3642,
    caHTSansLivraison: 3412,
    caLivraison: 230,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2840,
    caHorsItek: 1530,
    ventesItek: 25,
    ventesHorsItek: 13,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-03",
    nbCommandes: 45,
    ca: 5175,
    caHT: 4312.5,
    caHTSansLivraison: 4042.5,
    caLivraison: 270,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 3450,
    caHorsItek: 1725,
    ventesItek: 30,
    ventesHorsItek: 15,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-04",
    nbCommandes: 52,
    ca: 6240,
    caHT: 5200,
    caHTSansLivraison: 4890,
    caLivraison: 310,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 4160,
    caHorsItek: 2080,
    ventesItek: 35,
    ventesHorsItek: 17,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-05",
    nbCommandes: 58,
    ca: 7250,
    caHT: 6041.67,
    caHTSansLivraison: 5691.67,
    caLivraison: 350,
    panierMoyen: 125,
    panierMoyenHT: 104.17,
    caItek: 4930,
    caHorsItek: 2320,
    ventesItek: 39,
    ventesHorsItek: 19,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-06",
    nbCommandes: 48,
    ca: 5760,
    caHT: 4800,
    caHTSansLivraison: 4510,
    caLivraison: 290,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3840,
    caHorsItek: 1920,
    ventesItek: 32,
    ventesHorsItek: 16,
    marketplace: false,
    id_site: "1",
  },
  {
    date: "2023-05-07",
    nbCommandes: 35,
    ca: 4025,
    caHT: 3354.17,
    caHTSansLivraison: 3144.17,
    caLivraison: 210,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2625,
    caHorsItek: 1400,
    ventesItek: 23,
    ventesHorsItek: 12,
    marketplace: false,
    id_site: "1",
  },
  // Données pour le site 2
  {
    date: "2023-05-01",
    nbCommandes: 18,
    ca: 1980,
    caHT: 1650,
    caHTSansLivraison: 1530,
    caLivraison: 120,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 1320,
    caHorsItek: 660,
    ventesItek: 12,
    ventesHorsItek: 6,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-02",
    nbCommandes: 22,
    ca: 2420,
    caHT: 2016.67,
    caHTSansLivraison: 1876.67,
    caLivraison: 140,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 1650,
    caHorsItek: 770,
    ventesItek: 15,
    ventesHorsItek: 7,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-03",
    nbCommandes: 25,
    ca: 2875,
    caHT: 2395.83,
    caHTSansLivraison: 2245.83,
    caLivraison: 150,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 1925,
    caHorsItek: 950,
    ventesItek: 17,
    ventesHorsItek: 8,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-04",
    nbCommandes: 28,
    ca: 3360,
    caHT: 2800,
    caHTSansLivraison: 2630,
    caLivraison: 170,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 2240,
    caHorsItek: 1120,
    ventesItek: 19,
    ventesHorsItek: 9,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-05",
    nbCommandes: 32,
    ca: 3840,
    caHT: 3200,
    caHTSansLivraison: 3010,
    caLivraison: 190,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 2560,
    caHorsItek: 1280,
    ventesItek: 21,
    ventesHorsItek: 11,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-06",
    nbCommandes: 24,
    ca: 2760,
    caHT: 2300,
    caHTSansLivraison: 2160,
    caLivraison: 140,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 1840,
    caHorsItek: 920,
    ventesItek: 16,
    ventesHorsItek: 8,
    marketplace: false,
    id_site: "2",
  },
  {
    date: "2023-05-07",
    nbCommandes: 20,
    ca: 2200,
    caHT: 1833.33,
    caHTSansLivraison: 1713.33,
    caLivraison: 120,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 1430,
    caHorsItek: 770,
    ventesItek: 13,
    ventesHorsItek: 7,
    marketplace: false,
    id_site: "2",
  },
  // Données pour les marketplaces (site 3)
  {
    date: "2023-05-01",
    nbCommandes: 15,
    ca: 1650,
    caHT: 1375,
    caHTSansLivraison: 1300,
    caLivraison: 75,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 1100,
    caHorsItek: 550,
    ventesItek: 10,
    ventesHorsItek: 5,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-01",
    nbCommandes: 8,
    ca: 880,
    caHT: 733.33,
    caHTSansLivraison: 693.33,
    caLivraison: 40,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 600,
    caHorsItek: 280,
    ventesItek: 6,
    ventesHorsItek: 2,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-01",
    nbCommandes: 7,
    ca: 770,
    caHT: 641.67,
    caHTSansLivraison: 606.67,
    caLivraison: 35,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 550,
    caHorsItek: 220,
    ventesItek: 5,
    ventesHorsItek: 2,
    marketplace: true,
    id_site: "3",
    type_marketplace: "docmorris",
  },
  {
    date: "2023-05-01",
    nbCommandes: 6,
    ca: 660,
    caHT: 550,
    caHTSansLivraison: 520,
    caLivraison: 30,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 480,
    caHorsItek: 180,
    ventesItek: 4,
    ventesHorsItek: 2,
    marketplace: true,
    id_site: "3",
    type_marketplace: "shein",
  },
  {
    date: "2023-05-02",
    nbCommandes: 32,
    ca: 3520,
    caHT: 2933.33,
    caHTSansLivraison: 2773.33,
    caLivraison: 160,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2530,
    caHorsItek: 990,
    ventesItek: 23,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-02",
    nbCommandes: 32,
    ca: 3520,
    caHT: 2933.33,
    caHTSansLivraison: 2773.33,
    caLivraison: 160,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2530,
    caHorsItek: 990,
    ventesItek: 23,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-02",
    nbCommandes: 32,
    ca: 3520,
    caHT: 2933.33,
    caHTSansLivraison: 2773.33,
    caLivraison: 160,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2530,
    caHorsItek: 990,
    ventesItek: 23,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
  {
    date: "2023-05-03",
    nbCommandes: 35,
    ca: 4025,
    caHT: 3354.17,
    caHTSansLivraison: 3179.17,
    caLivraison: 175,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2870,
    caHorsItek: 1155,
    ventesItek: 25,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-03",
    nbCommandes: 35,
    ca: 4025,
    caHT: 3354.17,
    caHTSansLivraison: 3179.17,
    caLivraison: 175,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2870,
    caHorsItek: 1155,
    ventesItek: 25,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-03",
    nbCommandes: 35,
    ca: 4025,
    caHT: 3354.17,
    caHTSansLivraison: 3179.17,
    caLivraison: 175,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2870,
    caHorsItek: 1155,
    ventesItek: 25,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
  {
    date: "2023-05-04",
    nbCommandes: 38,
    ca: 4560,
    caHT: 3800,
    caHTSansLivraison: 3610,
    caLivraison: 190,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3230,
    caHorsItek: 1330,
    ventesItek: 27,
    ventesHorsItek: 11,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-04",
    nbCommandes: 38,
    ca: 4560,
    caHT: 3800,
    caHTSansLivraison: 3610,
    caLivraison: 190,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3230,
    caHorsItek: 1330,
    ventesItek: 27,
    ventesHorsItek: 11,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-04",
    nbCommandes: 38,
    ca: 4560,
    caHT: 3800,
    caHTSansLivraison: 3610,
    caLivraison: 190,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3230,
    caHorsItek: 1330,
    ventesItek: 27,
    ventesHorsItek: 11,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
  {
    date: "2023-05-05",
    nbCommandes: 42,
    ca: 5040,
    caHT: 4200,
    caHTSansLivraison: 3990,
    caLivraison: 210,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3570,
    caHorsItek: 1470,
    ventesItek: 30,
    ventesHorsItek: 12,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-05",
    nbCommandes: 42,
    ca: 5040,
    caHT: 4200,
    caHTSansLivraison: 3990,
    caLivraison: 210,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3570,
    caHorsItek: 1470,
    ventesItek: 30,
    ventesHorsItek: 12,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-05",
    nbCommandes: 42,
    ca: 5040,
    caHT: 4200,
    caHTSansLivraison: 3990,
    caLivraison: 210,
    panierMoyen: 120,
    panierMoyenHT: 100,
    caItek: 3570,
    caHorsItek: 1470,
    ventesItek: 30,
    ventesHorsItek: 12,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
  {
    date: "2023-05-06",
    nbCommandes: 34,
    ca: 3910,
    caHT: 3258.33,
    caHTSansLivraison: 3088.33,
    caLivraison: 170,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2720,
    caHorsItek: 1190,
    ventesItek: 24,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-06",
    nbCommandes: 34,
    ca: 3910,
    caHT: 3258.33,
    caHTSansLivraison: 3088.33,
    caLivraison: 170,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2720,
    caHorsItek: 1190,
    ventesItek: 24,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-06",
    nbCommandes: 34,
    ca: 3910,
    caHT: 3258.33,
    caHTSansLivraison: 3088.33,
    caLivraison: 170,
    panierMoyen: 115,
    panierMoyenHT: 95.83,
    caItek: 2720,
    caHorsItek: 1190,
    ventesItek: 24,
    ventesHorsItek: 10,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
  {
    date: "2023-05-07",
    nbCommandes: 30,
    ca: 3300,
    caHT: 2750,
    caHTSansLivraison: 2600,
    caLivraison: 150,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2310,
    caHorsItek: 990,
    ventesItek: 21,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "amazon",
  },
  {
    date: "2023-05-07",
    nbCommandes: 30,
    ca: 3300,
    caHT: 2750,
    caHTSansLivraison: 2600,
    caLivraison: 150,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2310,
    caHorsItek: 990,
    ventesItek: 21,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "cdiscount",
  },
  {
    date: "2023-05-07",
    nbCommandes: 30,
    ca: 3300,
    caHT: 2750,
    caHTSansLivraison: 2600,
    caLivraison: 150,
    panierMoyen: 110,
    panierMoyenHT: 91.67,
    caItek: 2310,
    caHorsItek: 990,
    ventesItek: 21,
    ventesHorsItek: 9,
    marketplace: true,
    id_site: "3",
    type_marketplace: "autre",
  },
]

// Couleurs pour les graphiques
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]
const COLORS_PIE = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function AnalyseCA() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [periodType, setPeriodType] = useState<"day" | "week" | "month">("day")
  const [periodTypeGlobal, setPeriodTypeGlobal] = useState<"day" | "week" | "month">("day")
  const [periodTypeMarketplace, setPeriodTypeMarketplace] = useState<"day" | "week" | "month">("day")
  const [periodTypeLivraison, setPeriodTypeLivraison] = useState<"day" | "week" | "month">("day")

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

  // Filtrer les données en fonction des filtres sélectionnés
  const donneesFiltrees = donneesCA.filter((donnee) => {
    let matchesSite = true

    if (selectedSite) {
      matchesSite = donnee.id_site === selectedSite
    }

    return matchesSite
  })

  // Calculer les totaux
  const calculerTotaux = (donnees: DonneeCA[]) => {
    const totalCommandes = donnees.reduce((acc, curr) => acc + curr.nbCommandes, 0)
    const totalCA = donnees.reduce((acc, curr) => acc + curr.ca, 0)
    const totalCAHT = donnees.reduce((acc, curr) => acc + curr.caHT, 0)
    const totalCAHTSansLivraison = donnees.reduce((acc, curr) => acc + curr.caHTSansLivraison, 0)
    const totalCALivraison = donnees.reduce((acc, curr) => acc + curr.caLivraison, 0)
    const totalCAItek = donnees.reduce((acc, curr) => acc + curr.caItek, 0)
    const totalCAHorsItek = donnees.reduce((acc, curr) => acc + curr.caHorsItek, 0)
    const totalVentesItek = donnees.reduce((acc, curr) => acc + curr.ventesItek, 0)
    const totalVentesHorsItek = donnees.reduce((acc, curr) => acc + curr.ventesHorsItek, 0)
    const panierMoyenGlobal = totalCommandes > 0 ? totalCA / totalCommandes : 0
    const panierMoyenHTGlobal = totalCommandes > 0 ? totalCAHT / totalCommandes : 0
    const totalGainItek = totalCAItek * 0.05 // Calcul du gain ITEK (5% du CA ITEK)

    return {
      totalCommandes,
      totalCA,
      totalCAHT,
      totalCAHTSansLivraison,
      totalCALivraison,
      totalCAItek,
      totalCAHorsItek,
      totalVentesItek,
      totalVentesHorsItek,
      panierMoyenGlobal,
      panierMoyenHTGlobal,
      totalGainItek, // Ajout du gain ITEK
    }
  }

  // Calculer les totaux pour les marketplaces
  const donneesMarketplace = donneesFiltrees.filter((donnee) => donnee.marketplace)

  // Calculer les totaux pour chaque type de marketplace
  const donneesAmazon = donneesMarketplace.filter((donnee) => donnee.type_marketplace === "amazon")
  const totauxAmazon = calculerTotaux(donneesAmazon)

  const donneesCdiscount = donneesMarketplace.filter((donnee) => donnee.type_marketplace === "cdiscount")
  const totauxCdiscount = calculerTotaux(donneesCdiscount)

  const donneesDocMorris = donneesMarketplace.filter((donnee) => donnee.type_marketplace === "docmorris")
  const totauxDocMorris = calculerTotaux(donneesDocMorris)

  const donneesShein = donneesMarketplace.filter((donnee) => donnee.type_marketplace === "shein")
  const totauxShein = calculerTotaux(donneesShein)

  const donneesAutresMP = donneesMarketplace.filter((donnee) => donnee.type_marketplace === "autre")
  const totauxAutresMP = calculerTotaux(donneesAutresMP)

  // Calculer les totaux pour toutes les données filtrées
  const totauxGlobaux = calculerTotaux(donneesFiltrees)

  const totauxMarketplace = calculerTotaux(donneesMarketplace)

  // Calculer les totaux pour les sites hors marketplace
  const donneesHorsMarketplace = donneesFiltrees.filter((donnee) => !donnee.marketplace)
  const totauxHorsMarketplace = calculerTotaux(donneesHorsMarketplace)

  // Préparer les données pour le graphique d'évolution du CA
  const donneesEvolutionCA = Array.from(new Set(donneesFiltrees.map((donnee) => donnee.date)))
    .map((date) => {
      const donneesJour = donneesFiltrees.filter((d) => d.date === date)
      const caJour = donneesJour.reduce((acc, curr) => acc + curr.ca, 
0)
      const caHTJour = donneesJour.reduce((acc, curr) => acc + curr.caHT, 0)
      const caHTSansLivraisonJour = donneesJour.reduce((acc, curr) => acc + curr.caHTSansLivraison, 0)
      const caLivraisonJour = donneesJour.reduce((acc, curr) => acc + curr.caLivraison, 0)
      const caItek = donneesJour.reduce((acc, curr) => acc + curr.caItek, 0)
      const caHorsItek = donneesJour.reduce((acc, curr) => acc + curr.caHorsItek, 0)
      const nbCommandes = donneesJour.reduce((acc, curr) => acc + curr.nbCommandes, 0)
      const panierMoyen = nbCommandes > 0 ? caJour / nbCommandes : 0
      const panierMoyenHT = nbCommandes > 0 ? caHTJour / nbCommandes : 0

      // Regrouper par site pour ce jour
      const siteData = Array.from(new Set(donneesJour.map((d) => d.id_site))).map((siteId) => {
        const donneesSite = donneesJour.filter((d) => d.id_site === siteId)
        return {
          id_site: siteId,
          ca: donneesSite.reduce((acc, curr) => acc + curr.ca, 0),
          caHT: donneesSite.reduce((acc, curr) => acc + curr.caHT, 0),
          nbCommandes: donneesSite.reduce((acc, curr) => acc + curr.nbCommandes, 0),
        }
      })

      return {
        date: format(new Date(date), "dd/MM", { locale: fr }),
        ca: caJour,
        caHT: caHTJour,
        caHTSansLivraison: caHTSansLivraisonJour,
        caLivraison: caLivraisonJour,
        caItek,
        caHorsItek,
        nbCommandes,
        panierMoyen,
        panierMoyenHT,
        gainItek: caItek * 0.05, // Ajout du gain ITEK (5% du CA ITEK)
        siteData,
      }
    })
    .sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("")
      const dateB = b.date.split("/").reverse().join("")
      return dateA.localeCompare(dateB)
    })

  // Données pour le graphique en camembert de répartition ITEK/Hors ITEK
  const donneesRepartitionCA = [
    { name: "CA ITEK", value: totauxGlobaux.totalCAItek },
    { name: "CA Hors ITEK", value: totauxGlobaux.totalCAHorsItek },
  ]

  // Données pour le graphique en camembert de répartition des ventes ITEK/Hors ITEK
  const donneesRepartitionVentes = [
    { name: "Ventes ITEK", value: totauxGlobaux.totalVentesItek },
    { name: "Ventes Hors ITEK", value: totauxGlobaux.totalVentesHorsItek },
  ]

  // Données pour le graphique en camembert de répartition CA avec/sans livraison
  const donneesRepartitionLivraison = [
    { name: "CA HT sans livraison", value: totauxGlobaux.totalCAHTSansLivraison },
    { name: "CA Livraison", value: totauxGlobaux.totalCALivraison },
  ]

  // Données pour le graphique en camembert de répartition par marketplace
  const donneesRepartitionMarketplace = [
    { name: "AMAZON", value: totauxGlobaux.totalCAHT * 0.35, fill: "#FF9900" },
    { name: "CDISCOUNT", value: totauxGlobaux.totalCAHT * 0.25, fill: "#00AE42" },
    { name: "DOCMORRIS", value: totauxGlobaux.totalCAHT * 0.15, fill: "#FF6B00" },
    { name: "TIKTOK", value: totauxGlobaux.totalCAHT * 0.08, fill: "#000000" },
    { name: "SHEIN", value: totauxGlobaux.totalCAHT * 0.07, fill: "#E60279" },
    { name: "LCDP", value: totauxGlobaux.totalCAHT * 0.06, fill: "#4A90E2" },
    { name: "AUTRES MARKETS", value: totauxGlobaux.totalCAHT * 0.04, fill: "#9B9B9B" },
  ]

  return (
    <div className="space-y-4">
      <FilterBar
        dateValue={dateRange}
        siteValue={selectedSite}
        onDateChange={setDateRange}
        onSiteChange={setSelectedSite}
        onReset={resetFilters}
      />

      <Tabs defaultValue="global" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global">CA Analyse Globale</TabsTrigger>
          <TabsTrigger value="itek">CA Analyse ITEK</TabsTrigger>
          <TabsTrigger value="marketplace">CA Marketplaces</TabsTrigger>
          <TabsTrigger value="livraison">CA Analyse Livraison</TabsTrigger>
        </TabsList>

        {/* Onglet Analyse Globale */}
        <TabsContent value="global" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Commandes</CardTitle>
                  <CardDescription className="text-xs">Nombre total de commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totauxGlobaux.totalCommandes}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">CA Total HT</CardTitle>
                  <CardDescription className="text-xs">CA HT total sur la période</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT,
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Frais de livraison HT</CardTitle>
                  <CardDescription className="text-xs">Total des frais de livraison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCALivraison,
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">% des frais de livraisons HT</CardTitle>
                  <CardDescription className="text-xs">Part des frais de livraison dans le CA HT</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {((totauxGlobaux.totalCALivraison / totauxGlobaux.totalCAHT) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Panier moyen HT</CardTitle>
                  <CardDescription className="text-xs">Valeur moyenne HT des commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.panierMoyenHTGlobal,
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition du CA HT</CardTitle>
                    <CardDescription>ITEK vs Hors ITEK</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donneesRepartitionCA}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {donneesRepartitionCA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            value as number,
                          ),
                          "Chiffre d'affaires",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">CA ITEK</div>
                    <div className="text-xl font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAItek,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((totauxGlobaux.totalCAItek / totauxGlobaux.totalCAHT) * 100).toFixed(1)}% du CA total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">CA Hors ITEK</div>
                    <div className="text-xl font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHorsItek,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((totauxGlobaux.totalCAHorsItek / totauxGlobaux.totalCAHT) * 100).toFixed(1)}% du CA total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>PART DES FRAIS DE PORT DANS LE CA HT GLOBAL</CardTitle>
                    <CardDescription>Analyse par marketplace</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Amazon",
                          ca: totauxGlobaux.totalCAHT * 0.35 * 0.97,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.35 * 0.03,
                          total: totauxGlobaux.totalCAHT * 0.35,
                          pourcentage: "3%",
                          fill: "#FF9900",
                        },
                        {
                          name: "Cdiscount",
                          ca: totauxGlobaux.totalCAHT * 0.25 * 0.98,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.25 * 0.02,
                          total: totauxGlobaux.totalCAHT * 0.25,
                          pourcentage: "2%",
                          fill: "#00AE42",
                        },
                        {
                          name: "DocMorris",
                          ca: totauxGlobaux.totalCAHT * 0.15 * 0.98,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.15 * 0.02,
                          total: totauxGlobaux.totalCAHT * 0.15,
                          pourcentage: "2%",
                          fill: "#FF6B00",
                        },
                        {
                          name: "TikTok",
                          ca: totauxGlobaux.totalCAHT * 0.08 * 0.97,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.08 * 0.03,
                          total: totauxGlobaux.totalCAHT * 0.08,
                          pourcentage: "3%",
                          fill: "#000000",
                        },
                        {
                          name: "SHEIN",
                          ca: totauxGlobaux.totalCAHT * 0.07 * 0.975,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.07 * 0.025,
                          total: totauxGlobaux.totalCAHT * 0.07,
                          pourcentage: "2,5%",
                          fill: "#E60279",
                        },
                        {
                          name: "LCDP",
                          ca: totauxGlobaux.totalCAHT * 0.06 * 0.97,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.06 * 0.03,
                          total: totauxGlobaux.totalCAHT * 0.06,
                          pourcentage: "3%",
                          fill: "#4A90E2",
                        },
                        {
                          name: "Autres",
                          ca: totauxGlobaux.totalCAHT * 0.04 * 0.97,
                          fraisLivraison: totauxGlobaux.totalCAHT * 0.04 * 0.03,
                          total: totauxGlobaux.totalCAHT * 0.04,
                          pourcentage: "3%",
                          fill: "#9B9B9B",
                        },
                      ]}
                      margin={{
                        top: 30,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      barSize={60}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" scale="point" padding={{ left: 40, right: 40 }} />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <Tooltip
                        formatter={(value, name, props) => {
                          if (name === "ca") {
                            return [
                              new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                value as number,
                              ),
                              "CA HT",
                            ]
                          }
                          if (name === "fraisLivraison") {
                            return [
                              new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                value as number,
                              ),
                              "Frais de livraison",
                            ]
                          }
                          return [value, name]
                        }}
                      />
                      <Legend
                        verticalAlign="top"
                        content={() => (
                          <div className="flex justify-center items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500"></div>
                              <span className="text-xs">CA HT</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-black"></div>
                              <span className="text-xs">Frais Livraison</span>
                            </div>
                          </div>
                        )}
                      />
                      <Bar
                        dataKey="ca"
                        stackId="a"
                        fill="#e74c3c"
                        name="CA HT"
                        label={(props) => {
                          const { x, y, width, payload } = props
                          if (
                            !payload ||
                            typeof payload.ca !== "number" ||
                            typeof payload.fraisLivraison !== "number"
                          ) {
                            return null
                          }
                          const total = payload.ca + payload.fraisLivraison
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 10}
                              fill="#000"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize={12}
                            >
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                                maximumFractionDigits: 0,
                              }).format(total)}
                            </text>
                          )
                        }}
                      />
                      <Bar
                        dataKey="fraisLivraison"
                        stackId="a"
                        fill="#000"
                        name="Frais Livraison"
                        label={(props) => {
                          const { x, y, width, payload } = props
                          if (
                            !payload ||
                            typeof payload.fraisLivraison !== "number" ||
                            typeof payload.ca !== "number"
                          ) {
                            return null
                          }
                          const pourcentage =
                            payload.pourcentage ||
                            ((payload.fraisLivraison / (payload.ca + payload.fraisLivraison)) * 100).toFixed(1) + "%"
                          return (
                            <text
                              x={x + width / 2}
                              y={y - 30}
                              fill="#e74c3c"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontWeight="bold"
                              fontSize={14}
                            >
                              {pourcentage}
                            </text>
                          )
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">AMAZON</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.35,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">35% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">CDISCOUNT</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.25,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">25% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">DOCMORRIS</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.15,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">15% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">TIKTOK</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.08,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">8% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">SHEIN</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.07,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">7% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">LCDP</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.06,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">6% du CA HT total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">AUTRES</div>
                    <div className="text-sm font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.04,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">4% du CA HT total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Évolution du CA HT avec frais de livraisons</CardTitle>
                    <CardDescription>Comparaison 2024/2025</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "Jan", "2024": 42500, "2025": 48300 },
                        { date: "Fév", "2024": 45200, "2025": 51800 },
                        { date: "Mar", "2024": 48900, "2025": 55400 },
                        { date: "Avr", "2024": 51200, "2025": 58900 },
                        { date: "Mai", "2024": 54800, "2025": 62300 },
                        { date: "Juin", "2024": 58100, "2025": 65700 },
                        { date: "Juil", "2024": 61500, "2025": 69200 },
                        { date: "Août", "2024": 59800, "2025": 67500 },
                        { date: "Sept", "2024": 62300, "2025": 70800 },
                        { date: "Oct", "2024": 65700, "2025": 74200 },
                        { date: "Nov", "2024": 69200, "2025": 78500 },
                        { date: "Déc", "2024": 72800, "2025": 82900 },
                      ]}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number)
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="2024"
                        name="CA HT 2024"
                        stroke={COLORS[0]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="2025"
                        name="CA HT 2025"
                        stroke={COLORS[1]}
                        activeDot={{ r: 8 }}
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
                    <CardTitle>Évolution du CA HT ITEK avec frais de livraisons</CardTitle>
                    <CardDescription>Comparaison 2024/2025</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "Jan", "2024": 28500, "2025": 32300 },
                        { date: "Fév", "2024": 30200, "2025": 34800 },
                        { date: "Mar", "2024": 32900, "2025": 37400 },
                        { date: "Avr", "2024": 34200, "2025": 39900 },
                        { date: "Mai", "2024": 36800, "2025": 42300 },
                        { date: "Juin", "2024": 39100, "2025": 44700 },
                        { date: "Juil", "2024": 41500, "2025": 47200 },
                        { date: "Août", "2024": 40800, "2025": 46500 },
                        { date: "Sept", "2024": 42300, "2025": 48800 },
                        { date: "Oct", "2024": 44700, "2025": 51200 },
                        { date: "Nov", "2024": 47200, "2025": 54500 },
                        { date: "Déc", "2024": 49800, "2025": 57900 },
                      ]}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number)
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="2024"
                        name="CA ITEK 2024"
                        stroke={COLORS[0]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="2025"
                        name="CA ITEK 2025"
                        stroke={COLORS[1]}
                        activeDot={{ r: 8 }}
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
                    <CardTitle>Évolution du CA HT Autres avec frais de livraisons</CardTitle>
                    <CardDescription>Comparaison 2024/2025</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "Jan", "2024": 14000, "2025": 16000 },
                        { date: "Fév", "2024": 15000, "2025": 17000 },
                        { date: "Mar", "2024": 16000, "2025": 18000 },
                        { date: "Avr", "2024": 17000, "2025": 19000 },
                        { date: "Mai", "2024": 18000, "2025": 20000 },
                        { date: "Juin", "2024": 19000, "2025": 21000 },
                        { date: "Juil", "2024": 20000, "2025": 22000 },
                        { date: "Août", "2024": 19000, "2025": 21000 },
                        { date: "Sept", "2024": 20000, "2025": 22000 },
                        { date: "Oct", "2024": 21000, "2025": 23000 },
                        { date: "Nov", "2024": 22000, "2025": 24000 },
                        { date: "Déc", "2024": 23000, "2025": 25000 },
                      ]}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number)
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="2024"
                        name="CA Autres 2024"
                        stroke={COLORS[0]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="2025"
                        name="CA Autres 2025"
                        stroke={COLORS[1]}
                        activeDot={{ r: 8 }}
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
                    <CardTitle>Évolution des commandes</CardTitle>
                    <CardDescription>Commandes et panier moyen</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={donneesEvolutionCA}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "panierMoyenHT") {
                            return [
                              new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                value as number,
                              ),
                              "Panier moyen HT",
                            ]
                          }
                          return [value, name === "nbCommandes" ? "Nombre de commandes" : name]
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="nbCommandes"
                        name="Nombre de commandes"
                        fill={COLORS[3]}
                        barSize={30}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="panierMoyenHT"
                        name="Panier moyen HT"
                        stroke={COLORS[4]}
                        strokeWidth={2}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Répartition du CA HT par Canal de vente</CardTitle>
                  <CardDescription>Analyse des performances par plateforme</CardDescription>
                </div>
                <ExportButton />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      {
                        name: "Amazon",
                        ca: totauxGlobaux.totalCAHT * 0.35,
                        fill: "#FF9900",
                      },
                      {
                        name: "Cdiscount",
                        ca: totauxGlobaux.totalCAHT * 0.25,
                        fill: "#00AE42",
                      },
                      {
                        name: "DocMorris",
                        ca: totauxGlobaux.totalCAHT * 0.15,
                        fill: "#FF6B00",
                      },
                      {
                        name: "TikTok",
                        ca: totauxGlobaux.totalCAHT * 0.08,
                        fill: "#000000",
                      },
                      {
                        name: "SHEIN",
                        ca: totauxGlobaux.totalCAHT * 0.07,
                        fill: "#E60279",
                      },
                      {
                        name: "LCDP",
                        ca: totauxGlobaux.totalCAHT * 0.06,
                        fill: "#4A90E2",
                      },
                      {
                        name: "Site",
                        ca: totauxGlobaux.totalCAHT * 0.1,
                        fill: "#8B5CF6",
                      },
                      {
                        name: "Autres",
                        ca: totauxGlobaux.totalCAHT * 0.04,
                        fill: "#9B9B9B",
                      },
                    ]}
                    margin={{
                      top: 20,
                      right: 120,
                      left: 80,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip
                      formatter={(value) => [
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number),
                        "CA HT",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="ca"
                      name="CA HT"
                      radius={[0, 4, 4, 0]}
                      fill="#8884d8"
                      label={{
                        position: "right",
                        formatter: (value: number) => {
                          const percentage = ((value / totauxGlobaux.totalCAHT) * 100).toFixed(1)
                          return `${new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)} (${percentage}%)`
                        },
                      }}
                    >
                      {[
                        { name: "Amazon", fill: "#FF9900" },
                        { name: "Cdiscount", fill: "#00AE42" },
                        { name: "DocMorris", fill: "#FF6B00" },
                        { name: "TikTok", fill: "#000000" },
                        { name: "SHEIN", fill: "#E60279" },
                        { name: "LCDP", fill: "#4A90E2" },
                        { name: "Site", fill: "#8B5CF6" },
                        { name: "Autres", fill: "#9B9B9B" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-8 gap-2 text-center text-xs">
                <div>
                  <div className="font-medium">Amazon</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.35,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">35%</div>
                </div>
                <div>
                  <div className="font-medium">Cdiscount</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.25,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">25%</div>
                </div>
                <div>
                  <div className="font-medium">DocMorris</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.15,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">15%</div>
                </div>
                <div>
                  <div className="font-medium">TikTok</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.08,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">8%</div>
                </div>
                <div>
                  <div className="font-medium">SHEIN</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.07,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">7%</div>
                </div>
                <div>
                  <div className="font-medium">LCDP</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.06,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">6%</div>
                </div>
                <div>
                  <div className="font-medium">Site</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.1,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">10%</div>
                </div>
                <div>
                  <div className="font-medium">Autres</div>
                  <div className="text-sm font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      totauxGlobaux.totalCAHT * 0.04,
                    )}
                  </div>
                  <div className="text-muted-foreground font-semibold">4%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Détail des ventes par période</CardTitle>
                  <CardDescription>Analyse des performances</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodTypeGlobal}
                      onChange={(e) => setPeriodTypeGlobal(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Date</TableHead>
                      <TableHead className="text-right bg-blue-50">Commandes</TableHead>
                      <TableHead className="text-right bg-blue-50">CA HT Global</TableHead>
                      <TableHead className="text-right bg-blue-50">Frais de livraison global</TableHead>
                      <TableHead className="text-right bg-yellow-50">NB Vente ITEK</TableHead>
                      <TableHead className="text-right bg-yellow-50">CA HT ITEK</TableHead>
                      <TableHead className="text-right bg-yellow-50">Frais de livraison ITEK</TableHead>
                      <TableHead className="text-right bg-yellow-50">CA HT ITEK TOTAL</TableHead>
                      <TableHead className="text-right bg-green-50">Commandes hors ITEK</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT hors ITEK</TableHead>
                      <TableHead className="text-right bg-green-50">Frais de livraison hors ITEK</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT hors ITEK TOTAL</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT AMAZON</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT CDiscount</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT DocMorris</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT TIKTOK</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT SHEIN</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT LCDP</TableHead>
                      <TableHead className="text-right bg-green-50">CA HT autres Markets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodTypeGlobal === "day" &&
                      donneesEvolutionCA.map((jour) => {
                        // Les données sont déjà filtrées par le site sélectionné
                        const totalCommandes = jour.siteData.reduce((acc, site) => acc + site.nbCommandes, 0)
                        const totalCAHT = jour.siteData.reduce((acc, site) => acc + site.caHT, 0)
                        const caLivraison = (jour.caLivraison / jour.caHT) * totalCAHT

                        // Données ITEK
                        const ventesItek = donneesCA
                          .filter((d) => format(new Date(d.date), "dd/MM", { locale: fr }) === jour.date)
                          .reduce((acc, curr) => acc + curr.ventesItek, 0)
                        const caItek = (jour.caItek / jour.caHT) * totalCAHT
                        const fraisLivraisonItek = caLivraison * (caItek / totalCAHT)
                        const caITEKTotal = caItek + fraisLivraisonItek

                        // Données hors ITEK
                        const commandesHorsItek = totalCommandes - ventesItek
                        const caHorsItek = totalCAHT - caItek
                        const fraisLivraisonHorsItek = caLivraison - fraisLivraisonItek
                        const caHorsITEKTotal = caHorsItek + fraisLivraisonHorsItek

                        // Données marketplaces (fictives basées sur des pourcentages)
                        const caAmazon = totalCAHT * 0.35
                        const caCDiscount = totalCAHT * 0.25
                        const caDocMorris = totalCAHT * 0.15
                        const caTikTok = totalCAHT * 0.08
                        const caShein = totalCAHT * 0.07
                        const caLCDP = totalCAHT * 0.06
                        const caAutresMarkets = totalCAHT * 0.04

                        return (
                          <TableRow key={jour.date}>
                            <TableCell className="font-medium sticky left-0 bg-white z-10">{jour.date}</TableCell>
                            <TableCell className="text-right bg-blue-50">{totalCommandes}</TableCell>
                            <TableCell className="text-right bg-blue-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalCAHT)}
                            </TableCell>
                            <TableCell className="text-right bg-blue-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caLivraison,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-yellow-50">{ventesItek}</TableCell>
                            <TableCell className="text-right bg-yellow-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(caItek)}
                            </TableCell>
                            <TableCell className="text-right bg-yellow-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                fraisLivraisonItek,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-yellow-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caITEKTotal,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">{commandesHorsItek}</TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caHorsItek,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                fraisLivraisonHorsItek,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caHorsITEKTotal,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(caAmazon)}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caCDiscount,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caDocMorris,
                              )}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(caTikTok)}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(caShein)}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(caLCDP)}
                            </TableCell>
                            <TableCell className="text-right bg-green-50">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                caAutresMarkets,
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}

                    {periodTypeGlobal === "week" &&
                      (() => {
                        // Regrouper les données par semaine
                        const weekData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHT: number
                            caHTSansLivraison: number
                            caLivraison: number
                            ventesItek: number
                            caItek: number
                            startDate: Date
                            endDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const start = startOfWeek(date, { weekStartsOn: 1 })
                          const end = endOfWeek(date, { weekStartsOn: 1 })

                          const weekKey = `${format(start, "dd/MM", { locale: fr })} - ${format(end, "dd/MM", { locale: fr })}`

                          if (!weekData.has(weekKey)) {
                            weekData.set(weekKey, {
                              nbCommandes: 0,
                              caHT: 0,
                              caHTSansLivraison: 0,
                              caLivraison: 0,
                              ventesItek: 0,
                              caItek: 0,
                              startDate: start,
                              endDate: end,
                            })
                          }

                          const weekStats = weekData.get(weekKey)!
                          weekStats.nbCommandes += donnee.nbCommandes
                          weekStats.caHT += donnee.caHT
                          weekStats.caHTSansLivraison += donnee.caHTSansLivraison
                          weekStats.caLivraison += donnee.caLivraison
                          weekStats.ventesItek += donnee.ventesItek
                          weekStats.caItek += donnee.caItek
                        })

                        return Array.from(weekData.entries())
                          .sort((a, b) => a[1].startDate.getTime() - b[1].startDate.getTime())
                          .map(([weekKey, stats]) => {
                            // Données ITEK
                            const fraisLivraisonItek = stats.caLivraison * (stats.caItek / stats.caHT)
                            const caITEKTotal = stats.caItek + fraisLivraisonItek

                            // Données hors ITEK
                            const commandesHorsItek = stats.nbCommandes - stats.ventesItek
                            const caHorsItek = stats.caHT - stats.caItek
                            const fraisLivraisonHorsItek = stats.caLivraison - fraisLivraisonItek
                            const caHorsITEKTotal = caHorsItek + fraisLivraisonHorsItek

                            // Données marketplaces (fictives basées sur des pourcentages)
                            const caAmazon = stats.caHT * 0.35
                            const caCDiscount = stats.caHT * 0.25
                            const caDocMorris = stats.caHT * 0.15
                            const caTikTok = stats.caHT * 0.08
                            const caShein = stats.caHT * 0.07
                            const caLCDP = stats.caHT * 0.06
                            const caAutresMarkets = stats.caHT * 0.04

                            return (
                              <TableRow key={weekKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{weekKey}</TableCell>
                                <TableCell className="text-right bg-blue-50">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right bg-blue-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caHT,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-blue-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caLivraison,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">{stats.ventesItek}</TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    fraisLivraisonItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caITEKTotal,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">{commandesHorsItek}</TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caHorsItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    fraisLivraisonHorsItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caHorsITEKTotal,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caAmazon,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caCDiscount,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caDocMorris,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caTikTok,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caShein,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caLCDP,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caAutresMarkets,
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}

                    {periodTypeGlobal === "month" &&
                      (() => {
                        // Regrouper les données par mois
                        const monthData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHT: number
                            caHTSansLivraison: number
                            caLivraison: number
                            ventesItek: number
                            caItek: number
                            monthDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const monthKey = format(date, "MMMM yyyy", { locale: fr })

                          if (!monthData.has(monthKey)) {
                            monthData.set(monthKey, {
                              nbCommandes: 0,
                              caHT: 0,
                              caHTSansLivraison: 0,
                              caLivraison: 0,
                              ventesItek: 0,
                              caItek: 0,
                              monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
                            })
                          }

                          const monthStats = monthData.get(monthKey)!
                          monthStats.nbCommandes += donnee.nbCommandes
                          monthStats.caHT += donnee.caHT
                          monthStats.caHTSansLivraison += donnee.caHTSansLivraison
                          monthStats.caLivraison += donnee.caLivraison
                          monthStats.ventesItek += donnee.ventesItek
                          monthStats.caItek += donnee.caItek
                        })

                        return Array.from(monthData.entries())
                          .sort((a, b) => a[1].monthDate.getTime() - b[1].monthDate.getTime())
                          .map(([monthKey, stats]) => {
                            // Données ITEK
                            const fraisLivraisonItek = stats.caLivraison * (stats.caItek / stats.caHT)
                            const caITEKTotal = stats.caItek + fraisLivraisonItek

                            // Données hors ITEK
                            const commandesHorsItek = stats.nbCommandes - stats.ventesItek
                            const caHorsItek = stats.caHT - stats.caItek
                            const fraisLivraisonHorsItek = stats.caLivraison - fraisLivraisonItek
                            const caHorsITEKTotal = caHorsItek + fraisLivraisonHorsItek

                            // Données marketplaces (fictives basées sur des pourcentages)
                            const caAmazon = stats.caHT * 0.35
                            const caCDiscount = stats.caHT * 0.25
                            const caDocMorris = stats.caHT * 0.15
                            const caTikTok = stats.caHT * 0.08
                            const caShein = stats.caHT * 0.07
                            const caLCDP = stats.caHT * 0.06
                            const caAutresMarkets = stats.caHT * 0.04

                            return (
                              <TableRow key={monthKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{monthKey}</TableCell>
                                <TableCell className="text-right bg-blue-50">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right bg-blue-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caHT,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-blue-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caLivraison,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">{stats.ventesItek}</TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    stats.caItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    fraisLivraisonItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-yellow-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caITEKTotal,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">{commandesHorsItek}</TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caHorsItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    fraisLivraisonHorsItek,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caHorsITEKTotal,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caAmazon,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caCDiscount,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caDocMorris,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caTikTok,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caShein,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caLCDP,
                                  )}
                                </TableCell>
                                <TableCell className="text-right bg-green-50">
                                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                                    caAutresMarkets,
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse ITEK */}
        <TabsContent value="itek" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Commandes ITEK</CardTitle>
                <CardDescription className="text-xs">Nombre total de commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totauxGlobaux.totalVentesItek}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">CA HT ITEK (avec frais de livraisons)</CardTitle>
                <CardDescription className="text-xs">CA HT total sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalCAItek,
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">CA HT ITEK (sans frais de livraisons)</CardTitle>
                <CardDescription className="text-xs">CA HT hors frais de livraison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalCAItek * (totauxGlobaux.totalCAHTSansLivraison / totauxGlobaux.totalCAHT),
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Frais de livraisons ITEK HT</CardTitle>
                <CardDescription className="text-xs">Total des frais de livraison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalCAItek * (totauxGlobaux.totalCALivraison / totauxGlobaux.totalCAHT),
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">% du CA Total HT</CardTitle>
                <CardDescription className="text-xs">Part ITEK dans le CA total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {((totauxGlobaux.totalCAItek / totauxGlobaux.totalCAHT) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Panier moyen ITEK HT</CardTitle>
                <CardDescription className="text-xs">Valeur moyenne HT des commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalVentesItek > 0 ? totauxGlobaux.totalCAItek / totauxGlobaux.totalVentesItek : 0,
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-emerald-700">Gain ITEK (5%)</CardTitle>
                <CardDescription className="text-xs text-emerald-600">Gain généré pour ITEK</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-700">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalGainItek,
                  )}
                </div>
                <div className="text-xs text-emerald-600 mt-2">5% du CA ITEK total</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Évolution du chiffre d'affaires HT ITEK sans frais de livraison</CardTitle>
                    <CardDescription>CA HT quotidien sur la période</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: "Jan", "2024": 28500, "2025": 32300 },
                        { date: "Fév", "2024": 30200, "2025": 34800 },
                        { date: "Mar", "2024": 32900, "2025": 37400 },
                        { date: "Avr", "2024": 34200, "2025": 39900 },
                        { date: "Mai", "2024": 36800, "2025": 42300 },
                        { date: "Juin", "2024": 39100, "2025": 44700 },
                        { date: "Juil", "2024": 41500, "2025": 47200 },
                        { date: "Août", "2024": 40800, "2025": 46500 },
                        { date: "Sept", "2024": 42300, "2025": 48800 },
                        { date: "Oct", "2024": 44700, "2025": 51200 },
                        { date: "Nov", "2024": 47200, "2025": 54500 },
                        { date: "Déc", "2024": 49800, "2025": 57900 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number)
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="2024"
                        name="CA ITEK 2024"
                        stroke={COLORS[0]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="2025"
                        name="CA ITEK 2025"
                        stroke={COLORS[1]}
                        activeDot={{ r: 8 }}
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
                    <CardTitle>Évolution des ventes ITEK</CardTitle>
                    <CardDescription>Nombre de ventes ITEK par jour</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={donneesEvolutionCA.map((jour) => ({
                        ...jour,
                        ventesItek: donneesCA
                          .filter((d) => format(new Date(d.date), "dd/MM", { locale: fr }) === jour.date)
                          .reduce((acc, curr) => acc + curr.ventesItek, 0),
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ventesItek" name="Ventes ITEK" fill={COLORS[3]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition du CA HT</CardTitle>
                    <CardDescription>ITEK vs Hors ITEK</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donneesRepartitionCA}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {donneesRepartitionCA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            value as number,
                          ),
                          "Chiffre d'affaires",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">CA ITEK</div>
                    <div className="text-xl font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAItek,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((totauxGlobaux.totalCAItek / totauxGlobaux.totalCAHT) * 100).toFixed(1)}% du CA total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">CA Hors ITEK</div>
                    <div className="text-xl font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHorsItek,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {((totauxGlobaux.totalCAHorsItek / totauxGlobaux.totalCAHT) * 100).toFixed(1)}% du CA total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition des ventes</CardTitle>
                    <CardDescription>Ventes ITEK vs Hors ITEK</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donneesRepartitionVentes}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {donneesRepartitionVentes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Nombre de ventes"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Ventes ITEK</div>
                    <div className="text-xl font-bold">{totauxGlobaux.totalVentesItek}</div>
                    <div className="text-sm text-muted-foreground">
                      {(
                        (totauxGlobaux.totalVentesItek /
                          (totauxGlobaux.totalVentesItek + totauxGlobaux.totalVentesHorsItek)) *
                        100
                      ).toFixed(1)}
                      % du total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Ventes Hors ITEK</div>
                    <div className="text-xl font-bold">{totauxGlobaux.totalVentesHorsItek}</div>
                    <div className="text-sm text-muted-foreground">
                      {(
                        (totauxGlobaux.totalVentesHorsItek /
                          (totauxGlobaux.totalVentesItek + totauxGlobaux.totalVentesHorsItek)) *
                        100
                      ).toFixed(1)}
                      % du total
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Détail des ventes ITEK par période</CardTitle>
                  <CardDescription>Analyse des performances</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Date</TableHead>
                      <TableHead className="text-right">Commandes</TableHead>
                      <TableHead className="text-right">CA HT</TableHead>
                      <TableHead className="text-right">Panier Moyen HT</TableHead>
                      <TableHead className="text-right">Gain ITEK (5%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodType === "day" &&
                      donneesEvolutionCA.map((jour) => (
                        <TableRow key={jour.date}>
                          <TableCell className="font-medium sticky left-0 bg-white z-10">{jour.date}</TableCell>
                          <TableCell className="text-right">{jour.nbCommandes}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(jour.caItek)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(jour.panierMoyenHT)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(jour.gainItek)}
                          </TableCell>
                        </TableRow>
                      ))}
                    {periodType === "week" &&
                      (() => {
                        const weekData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caItek: number
                            panierMoyenHT: number
                            gainItek: number
                            startDate: Date
                            endDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const start = startOfWeek(date, { weekStartsOn: 1 })
                          const end = endOfWeek(date, { weekStartsOn: 1 })

                          const weekKey = `${format(start, "dd/MM", {
                            locale: fr,
                          })} - ${format(end, "dd/MM", { locale: fr })}`

                          if (!weekData.has(weekKey)) {
                            weekData.set(weekKey, {
                              nbCommandes: 0,
                              caItek: 0,
                              panierMoyenHT: 0,
                              gainItek: 0,
                              startDate: start,
                              endDate: end,
                            })
                          }

                          const weekStats = weekData.get(weekKey)!
                          weekStats.nbCommandes += donnee.nbCommandes
                          weekStats.caItek += donnee.caItek
                        })

                        return Array.from(weekData.entries())
                          .sort((a, b) => a[1].startDate.getTime() - b[1].startDate.getTime())
                          .map(([weekKey, stats]) => {
                            const totalVentesItek = donneesFiltrees
                              .filter((d) => {
                                const date = new Date(d.date)
                                const start = startOfWeek(date, { weekStartsOn: 1 })
                                const end = endOfWeek(date, { weekStartsOn: 1 })
                                const weekKeyCalculated = `${format(start, "dd/MM", {
                                  locale: fr,
                                })} - ${format(end, "dd/MM", { locale: fr })}`
                                return weekKeyCalculated === weekKey
                              })
                              .reduce((acc, curr) => acc + curr.ventesItek, 0)

                            const panierMoyenHT = totalVentesItek > 0 ? stats.caItek / totalVentesItek : 0
                            const gainItek = stats.caItek * 0.05

                            return (
                              <TableRow key={weekKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{weekKey}</TableCell>
                                <TableCell className="text-right">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(stats.caItek)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(panierMoyenHT)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(gainItek)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}
                    {periodType === "month" &&
                      (() => {
                        const monthData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caItek: number
                            panierMoyenHT: number
                            gainItek: number
                            monthDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const monthKey = format(date, "MMMM yyyy", { locale: fr })

                          if (!monthData.has(monthKey)) {
                            monthData.set(monthKey, {
                              nbCommandes: 0,
                              caItek: 0,
                              panierMoyenHT: 0,
                              gainItek: 0,
                              monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
                            })
                          }

                          const monthStats = monthData.get(monthKey)!
                          monthStats.nbCommandes += donnee.nbCommandes
                          monthStats.caItek += donnee.caItek
                        })

                        return Array.from(monthData.entries())
                          .sort((a, b) => a[1].monthDate.getTime() - b[1].monthDate.getTime())
                          .map(([monthKey, stats]) => {
                            const totalVentesItek = donneesFiltrees
                              .filter((d) => {
                                const date = new Date(d.date)
                                const monthKeyCalculated = format(date, "MMMM yyyy", { locale: fr })
                                return monthKeyCalculated === monthKey
                              })
                              .reduce((acc, curr) => acc + curr.ventesItek, 0)

                            const panierMoyenHT = totalVentesItek > 0 ? stats.caItek / totalVentesItek : 0
                            const gainItek = stats.caItek * 0.05

                            return (
                              <TableRow key={monthKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{monthKey}</TableCell>
                                <TableCell className="text-right">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(stats.caItek)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(panierMoyenHT)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(gainItek)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse Marketplaces */}
        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé des performances par Marketplace</CardTitle>
              <CardDescription>Vue d'ensemble des métriques clés</CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marketplace</TableHead>
                    <TableHead className="text-right">Commandes</TableHead>
                    <TableHead className="text-right">CA HT</TableHead>
                    <TableHead className="text-right">Panier Moyen HT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-blue-50">
                    <TableCell className="font-medium">Total Marketplaces</TableCell>
                    <TableCell className="text-right font-bold">{totauxMarketplace.totalCommandes}</TableCell>
                    <TableCell className="text-right font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxMarketplace.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxMarketplace.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF9900" }}></div>
                        Amazon
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{totauxAmazon.totalCommandes}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxAmazon.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxAmazon.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00AE42" }}></div>
                        Cdiscount
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{totauxCdiscount.totalCommandes}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxCdiscount.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxCdiscount.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF6B00" }}></div>
                        DocMorris
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{totauxDocMorris.totalCommandes}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxDocMorris.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxDocMorris.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E60279" }}></div>
                        SHEIN
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{totauxShein.totalCommandes}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxShein.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxShein.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#000000" }}></div>
                        TikTok
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{Math.round(totauxMarketplace.totalCommandes * 0.08)}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.08,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxMarketplace.panierMoyenHTGlobal * 1.1,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#4A90E2" }}></div>
                        LCDP
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{Math.round(totauxMarketplace.totalCommandes * 0.06)}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxGlobaux.totalCAHT * 0.06,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxMarketplace.panierMoyenHTGlobal * 0.95,
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#9B9B9B" }}></div>
                        Autres MP
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{totauxAutresMP.totalCommandes}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxAutresMP.totalCAHT,
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        totauxAutresMP.panierMoyenHTGlobal,
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparaison Sites directs vs Marketplaces</CardTitle>
              <CardDescription>Répartition des performances entre canaux de vente</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Indicateur</TableHead>
                    <TableHead className="text-center font-medium">Sites directs</TableHead>
                    <TableHead className="text-center font-medium">Marketplace</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">CA HT</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {((totauxHorsMarketplace.totalCAHT / totauxGlobaux.totalCAHT) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            totauxHorsMarketplace.totalCAHT,
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {((totauxMarketplace.totalCAHT / totauxGlobaux.totalCAHT) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            totauxMarketplace.totalCAHT,
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Commandes</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {((totauxHorsMarketplace.totalCommandes / totauxGlobaux.totalCommandes) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totauxHorsMarketplace.totalCommandes}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {((totauxMarketplace.totalCommandes / totauxGlobaux.totalCommandes) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {totauxMarketplace.totalCommandes}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Panier moyen HT</TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                          totauxHorsMarketplace.panierMoyenHTGlobal,
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                          totauxMarketplace.panierMoyenHTGlobal,
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évolution du CA HT Marketplaces avec frais de livraisons</CardTitle>
                  <CardDescription>CA HT quotidien sur la période</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodTypeMarketplace}
                      onChange={(e) => setPeriodTypeMarketplace(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: "Jan", "2024": 15200, "2025": 17800 },
                      { date: "Fév", "2024": 16500, "2025": 19200 },
                      { date: "Mar", "2024": 17800, "2025": 20500 },
                      { date: "Avr", "2024": 18900, "2025": 21800 },
                      { date: "Mai", "2024": 20100, "2025": 23200 },
                      { date: "Juin", "2024": 21400, "2025": 24600 },
                      { date: "Juil", "2024": 22700, "2025": 26000 },
                      { date: "Août", "2024": 21900, "2025": 25100 },
                      { date: "Sept", "2024": 23200, "2025": 26700 },
                      { date: "Oct", "2024": 24500, "2025": 28200 },
                      { date: "Nov", "2024": 25800, "2025": 29700 },
                      {
                        date: "Déc",
                        "2024": 27100,
                        "2025": 31200,
                      },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number)
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="2024"
                      name="CA HT Marketplaces 2024"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="2025"
                      name="CA HT Marketplaces 2025"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
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
                  <CardTitle>Détail des ventes Marketplaces par période</CardTitle>
                  <CardDescription>Analyse des performances</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodTypeMarketplace}
                      onChange={(e) => setPeriodTypeMarketplace(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Date</TableHead>
                      <TableHead className="text-right bg-blue-100">Commandes</TableHead>
                      <TableHead className="text-right bg-blue-100">CA HT avec livraison</TableHead>
                      <TableHead className="text-right bg-blue-100">Panier Moyen HT</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT AMAZON</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT CDiscount</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT DocMorris</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT TIKTOK</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT SHEIN</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT LCDP</TableHead>
                      <TableHead className="text-right bg-green-100">CA HT autres Markets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodTypeMarketplace === "day" &&
                      donneesEvolutionCA.map((jour) => {
                        // Calculer les valeurs pour chaque marketplace basées sur des pourcentages du CA HT total
                        const caAmazon = jour.caHT * 0.35
                        const caCDiscount = jour.caHT * 0.25
                        const caDocMorris = jour.caHT * 0.15
                        const caTikTok = jour.caHT * 0.08
                        const caShein = jour.caHT * 0.07
                        const caLCDP = jour.caHT * 0.06
                        const caAutresMarkets = jour.caHT * 0.04

                        return (
                          <TableRow key={jour.date}>
                            <TableCell className="font-medium sticky left-0 bg-white z-10">{jour.date}</TableCell>
                            <TableCell className="text-right bg-blue-100">{jour.nbCommandes}</TableCell>
                            <TableCell className="text-right bg-blue-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(jour.caHT)}
                            </TableCell>
                            <TableCell className="text-right bg-blue-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(jour.panierMoyenHT)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caAmazon)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caCDiscount)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caDocMorris)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caTikTok)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caShein)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caLCDP)}
                            </TableCell>
                            <TableCell className="text-right bg-green-100">
                              {new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "EUR",
                              }).format(caAutresMarkets)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    {periodTypeMarketplace === "week" &&
                      (() => {
                        const weekData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHT: number
                            panierMoyenHT: number
                            startDate: Date
                            endDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          if (donnee.marketplace) {
                            const date = new Date(donnee.date)
                            const start = startOfWeek(date, { weekStartsOn: 1 })
                            const end = endOfWeek(date, { weekStartsOn: 1 })

                            const weekKey = `${format(start, "dd/MM", {
                              locale: fr,
                            })} - ${format(end, "dd/MM", { locale: fr })}`

                            if (!weekData.has(weekKey)) {
                              weekData.set(weekKey, {
                                nbCommandes: 0,
                                caHT: 0,
                                panierMoyenHT: 0,
                                startDate: start,
                                endDate: end,
                              })
                            }

                            const weekStats = weekData.get(weekKey)!
                            weekStats.nbCommandes += donnee.nbCommandes
                            weekStats.caHT += donnee.caHT
                          }
                        })

                        return Array.from(weekData.entries())
                          .sort((a, b) => a[1].startDate.getTime() - b[1].startDate.getTime())
                          .map(([weekKey, stats]) => {
                            const totalVentes = donneesFiltrees
                              .filter((d) => {
                                if (d.marketplace) {
                                  const date = new Date(d.date)
                                  const start = startOfWeek(date, { weekStartsOn: 1 })
                                  const end = endOfWeek(date, { weekStartsOn: 1 })
                                  const weekKeyCalculated = `${format(start, "dd/MM", {
                                    locale: fr,
                                  })} - ${format(end, "dd/MM", { locale: fr })}`
                                  return weekKeyCalculated === weekKey
                                }
                                return false
                              })
                              .reduce((acc, curr) => acc + curr.nbCommandes, 0)

                            const panierMoyenHT = totalVentes > 0 ? stats.caHT / totalVentes : 0

                            // Calculer les valeurs pour chaque marketplace basées sur des pourcentages du CA HT total
                            const caAmazon = stats.caHT * 0.35
                            const caCDiscount = stats.caHT * 0.25
                            const caDocMorris = stats.caHT * 0.15
                            const caTikTok = stats.caHT * 0.08
                            const caShein = stats.caHT * 0.07
                            const caLCDP = stats.caHT * 0.06
                            const caAutresMarkets = stats.caHT * 0.04

                            return (
                              <TableRow key={weekKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{weekKey}</TableCell>
                                <TableCell className="text-right bg-blue-100">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right bg-blue-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(stats.caHT)}
                                </TableCell>
                                <TableCell className="text-right bg-blue-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(panierMoyenHT)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caAmazon)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caCDiscount)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caDocMorris)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caTikTok)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caShein)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caLCDP)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caAutresMarkets)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}
                    {periodTypeMarketplace === "month" &&
                      (() => {
                        const monthData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHT: number
                            panierMoyenHT: number
                            monthDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          if (donnee.marketplace) {
                            const date = new Date(donnee.date)
                            const monthKey = format(date, "MMMM yyyy", { locale: fr })

                            if (!monthData.has(monthKey)) {
                              monthData.set(monthKey, {
                                nbCommandes: 0,
                                caHT: 0,
                                panierMoyenHT: 0,
                                monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
                              })
                            }

                            const monthStats = monthData.get(monthKey)!
                            monthStats.nbCommandes += donnee.nbCommandes
                            monthStats.caHT += donnee.caHT
                          }
                        })

                        return Array.from(monthData.entries())
                          .sort((a, b) => a[1].monthDate.getTime() - b[1].monthDate.getTime())
                          .map(([monthKey, stats]) => {
                            const totalVentes = donneesFiltrees
                              .filter((d) => {
                                if (d.marketplace) {
                                  const date = new Date(d.date)
                                  const monthKeyCalculated = format(date, "MMMM yyyy", { locale: fr })
                                  return monthKeyCalculated === monthKey
                                }
                                return false
                              })
                              .reduce((acc, curr) => acc + curr.nbCommandes, 0)

                            const panierMoyenHT = totalVentes > 0 ? stats.caHT / totalVentes : 0

                            // Calculer les valeurs pour chaque marketplace basées sur des pourcentages du CA HT total
                            const caAmazon = stats.caHT * 0.35
                            const caCDiscount = stats.caHT * 0.25
                            const caDocMorris = stats.caHT * 0.15
                            const caTikTok = stats.caHT * 0.08
                            const caShein = stats.caHT * 0.07
                            const caLCDP = stats.caHT * 0.06
                            const caAutresMarkets = stats.caHT * 0.04

                            return (
                              <TableRow key={monthKey}>
                                <TableCell className="font-medium sticky left-0 bg-white z-10">{monthKey}</TableCell>
                                <TableCell className="text-right bg-blue-100">{stats.nbCommandes}</TableCell>
                                <TableCell className="text-right bg-blue-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(stats.caHT)}
                                </TableCell>
                                <TableCell className="text-right bg-blue-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(panierMoyenHT)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caAmazon)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caCDiscount)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caDocMorris)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caTikTok)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caShein)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caLCDP)}
                                </TableCell>
                                <TableCell className="text-right bg-green-100">
                                  {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }).format(caAutresMarkets)}
                                </TableCell>
                              </TableRow>
                            )
                          })
                      })()}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse Livraison */}
        <TabsContent value="livraison" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">CA HT sans livraison</CardTitle>
                <CardDescription className="text-xs">CA HT total sans livraison sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totauxGlobaux.totalCAHTSansLivraison}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">CA Livraison</CardTitle>
                <CardDescription className="text-xs">CA total de la livraison sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    totauxGlobaux.totalCALivraison,
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pourcentage CA Livraison</CardTitle>
                <CardDescription className="text-xs">Pourcentage du CA total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {((totauxGlobaux.totalCALivraison / totauxGlobaux.totalCAHT) * 100).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Répartition du CA HT avec/sans livraison</CardTitle>
                  <CardDescription>Analyse de la répartition</CardDescription>
                </div>
                <ExportButton />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donneesRepartitionLivraison}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {donneesRepartitionLivraison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value as number),
                        "Chiffre d'affaires",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Évolution du CA HT avec/sans livraison</CardTitle>
                  <CardDescription>Analyse de l'évolution du CA</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodTypeLivraison}
                      onChange={(e) => setPeriodTypeLivraison(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={donneesEvolutionCA}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "caHTSansLivraison") {
                          return [
                            new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                              value as number,
                            ),
                            "CA HT sans livraison",
                          ]
                        }
                        if (name === "caLivraison") {
                          return [
                            new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                              value as number,
                            ),
                            "CA Livraison",
                          ]
                        }
                        return [value, name]
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="caHTSansLivraison"
                      name="CA HT sans livraison"
                      stroke={COLORS[0]}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="caLivraison"
                      name="CA Livraison"
                      stroke={COLORS[1]}
                      activeDot={{ r: 8 }}
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
                  <CardTitle>Détail des ventes avec/sans livraison par période</CardTitle>
                  <CardDescription>Analyse des performances</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <select
                      className="h-8 rounded-md border border-input bg-background px-3 text-sm"
                      value={periodTypeLivraison}
                      onChange={(e) => setPeriodTypeLivraison(e.target.value as "day" | "week" | "month")}
                    >
                      <option value="day">Par jour</option>
                      <option value="week">Par semaine</option>
                      <option value="month">Par mois</option>
                    </select>
                  </div>
                  <ExportButton />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-gray-100 font-medium sticky left-0 z-10">Date</TableHead>
                      <TableHead className="text-right">Commandes</TableHead>
                      <TableHead className="text-right">CA HT sans livraison</TableHead>
                      <TableHead className="text-right">CA Livraison</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodTypeLivraison === "day" &&
                      donneesEvolutionCA.map((jour) => (
                        <TableRow key={jour.date}>
                          <TableCell className="font-medium sticky left-0 bg-white z-10">{jour.date}</TableCell>
                          <TableCell className="text-right">{jour.nbCommandes}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(jour.caHTSansLivraison)}
                          </TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            }).format(jour.caLivraison)}
                          </TableCell>
                        </TableRow>
                      ))}
                    {periodTypeLivraison === "week" &&
                      (() => {
                        const weekData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHTSansLivraison: number
                            caLivraison: number
                            startDate: Date
                            endDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const start = startOfWeek(date, { weekStartsOn: 1 })
                          const end = endOfWeek(date, { weekStartsOn: 1 })

                          const weekKey = `${format(start, "dd/MM", {
                            locale: fr,
                          })} - ${format(end, "dd/MM", { locale: fr })}`

                          if (!weekData.has(weekKey)) {
                            weekData.set(weekKey, {
                              nbCommandes: 0,
                              caHTSansLivraison: 0,
                              caLivraison: 0,
                              startDate: start,
                              endDate: end,
                            })
                          }

                          const weekStats = weekData.get(weekKey)!
                          weekStats.nbCommandes += donnee.nbCommandes
                          weekStats.caHTSansLivraison += donnee.caHTSansLivraison
                          weekStats.caLivraison += donnee.caLivraison
                        })

                        return Array.from(weekData.entries())
                          .sort((a, b) => a[1].startDate.getTime() - b[1].startDate.getTime())
                          .map(([weekKey, stats]) => (
                            <TableRow key={weekKey}>
                              <TableCell className="font-medium sticky left-0 bg-white z-10">{weekKey}</TableCell>
                              <TableCell className="text-right">{stats.nbCommandes}</TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(stats.caHTSansLivraison)}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(stats.caLivraison)}
                              </TableCell>
                            </TableRow>
                          ))
                      })()}
                    {periodTypeLivraison === "month" &&
                      (() => {
                        const monthData = new Map<
                          string,
                          {
                            nbCommandes: number
                            caHTSansLivraison: number
                            caLivraison: number
                            monthDate: Date
                          }
                        >()

                        donneesFiltrees.forEach((donnee) => {
                          const date = new Date(donnee.date)
                          const monthKey = format(date, "MMMM yyyy", { locale: fr })

                          if (!monthData.has(monthKey)) {
                            monthData.set(monthKey, {
                              nbCommandes: 0,
                              caHTSansLivraison: 0,
                              caLivraison: 0,
                              monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
                            })
                          }

                          const monthStats = monthData.get(monthKey)!
                          monthStats.nbCommandes += donnee.nbCommandes
                          monthStats.caHTSansLivraison += donnee.caHTSansLivraison
                          monthStats.caLivraison += donnee.caLivraison
                        })

                        return Array.from(monthData.entries())
                          .sort((a, b) => a[1].monthDate.getTime() - b[1].monthDate.getTime())
                          .map(([monthKey, stats]) => (
                            <TableRow key={monthKey}>
                              <TableCell className="font-medium sticky left-0 bg-white z-10">{monthKey}</TableCell>
                              <TableCell className="text-right">{stats.nbCommandes}</TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(stats.caHTSansLivraison)}
                              </TableCell>
                              <TableCell className="text-right">
                                {new Intl.NumberFormat("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                }).format(stats.ca\
