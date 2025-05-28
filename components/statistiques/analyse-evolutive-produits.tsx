"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { ArrowDownIcon, ArrowUpIcon, BarChart3Icon, CalendarIcon, PackageIcon, TagIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FilterBar } from "@/components/filter-bar"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Types pour les données d'historique des produits
type FieldType = "quantity" | "price"

interface ProductHistoryEntry {
  id_history: number
  id_product: number
  product_name: string
  product_reference: string
  field: FieldType
  old_value: number
  new_value: number
  date_detected: string
  site_id: string
}

// Données de démonstration
const demoProductHistory: ProductHistoryEntry[] = [
  {
    id_history: 1,
    id_product: 96286,
    product_name: "MiumLab Gummies SOMMEIL 42 Gummies",
    product_reference: "3760325688655",
    field: "quantity",
    old_value: 10,
    new_value: 9,
    date_detected: "2025-05-16 15:55:01",
    site_id: "1",
  },
  {
    id_history: 2,
    id_product: 96040,
    product_name: "Biolane Expert Stick Solaire SPF50 Bébé Visage & Corps 20ml",
    product_reference: "3286010110169",
    field: "quantity",
    old_value: 15,
    new_value: 14,
    date_detected: "2025-05-16 15:55:01",
    site_id: "2",
  },
  {
    id_history: 3,
    id_product: 95165,
    product_name: "Yogi Tea Confort de l'Âme Bio 17 Sachets",
    product_reference: "4012824405547",
    field: "price",
    old_value: 3.5,
    new_value: 3.61,
    date_detected: "2025-05-16 15:55:01",
    site_id: "1",
  },
  {
    id_history: 4,
    id_product: 95163,
    product_name: "Yogi Tea Infusion Bio Happy Nature 17 Sachets",
    product_reference: "4012824405936",
    field: "price",
    old_value: 3.5,
    new_value: 3.76,
    date_detected: "2025-05-16 15:55:01",
    site_id: "3",
  },
  {
    id_history: 5,
    id_product: 2326,
    product_name: "Crème hydratante visage",
    product_reference: "8745632198745",
    field: "quantity",
    old_value: 157,
    new_value: 153,
    date_detected: "2025-04-14 12:04:06",
    site_id: "2",
  },
  {
    id_history: 6,
    id_product: 2347,
    product_name: "Sérum anti-âge",
    product_reference: "7896541236987",
    field: "quantity",
    old_value: 13,
    new_value: 6,
    date_detected: "2025-04-14 12:04:06",
    site_id: "4",
  },
  {
    id_history: 7,
    id_product: 2362,
    product_name: "Huile de massage relaxante",
    product_reference: "6547893214569",
    field: "price",
    old_value: 7.23,
    new_value: 7.48,
    date_detected: "2025-04-14 12:04:06",
    site_id: "1",
  },
  {
    id_history: 8,
    id_product: 2362,
    product_name: "Huile de massage relaxante",
    product_reference: "6547893214569",
    field: "quantity",
    old_value: 169,
    new_value: 165,
    date_detected: "2025-04-14 12:04:06",
    site_id: "1",
  },
  {
    id_history: 9,
    id_product: 2423,
    product_name: "Shampoing bio",
    product_reference: "3214569874563",
    field: "quantity",
    old_value: 25,
    new_value: 20,
    date_detected: "2025-04-14 12:04:06",
    site_id: "3",
  },
  {
    id_history: 10,
    id_product: 2424,
    product_name: "Après-shampoing bio",
    product_reference: "9874563214569",
    field: "quantity",
    old_value: 388,
    new_value: 387,
    date_detected: "2025-04-14 12:04:06",
    site_id: "2",
  },
  {
    id_history: 11,
    id_product: 2455,
    product_name: "Crème solaire SPF 50",
    product_reference: "6541239874563",
    field: "price",
    old_value: 10.69,
    new_value: 10.77,
    date_detected: "2025-04-14 12:04:06",
    site_id: "4",
  },
  {
    id_history: 12,
    id_product: 2461,
    product_name: "Gel douche à l'aloe vera",
    product_reference: "3214569874123",
    field: "quantity",
    old_value: 20,
    new_value: 19,
    date_detected: "2025-04-14 12:04:06",
    site_id: "3",
  },
  {
    id_history: 13,
    id_product: 2468,
    product_name: "Dentifrice naturel",
    product_reference: "9874563214123",
    field: "quantity",
    old_value: 40,
    new_value: 38,
    date_detected: "2025-04-14 12:04:06",
    site_id: "2",
  },
  {
    id_history: 14,
    id_product: 2470,
    product_name: "Brosse à dents bambou",
    product_reference: "6541239874123",
    field: "quantity",
    old_value: 1,
    new_value: 40,
    date_detected: "2025-04-14 12:04:06",
    site_id: "1",
  },
  {
    id_history: 15,
    id_product: 2480,
    product_name: "Savon artisanal",
    product_reference: "3214569871234",
    field: "quantity",
    old_value: 11,
    new_value: 56,
    date_detected: "2025-04-14 12:04:06",
    site_id: "4",
  },
  // Données supplémentaires pour les graphiques
  {
    id_history: 16,
    id_product: 2481,
    product_name: "Lotion tonique",
    product_reference: "7896541236123",
    field: "quantity",
    old_value: 25,
    new_value: 22,
    date_detected: "2025-04-13 10:15:22",
    site_id: "1",
  },
  {
    id_history: 17,
    id_product: 2482,
    product_name: "Masque visage",
    product_reference: "6547893214123",
    field: "price",
    old_value: 12.99,
    new_value: 13.49,
    date_detected: "2025-04-13 11:30:45",
    site_id: "2",
  },
  {
    id_history: 18,
    id_product: 2483,
    product_name: "Gommage corps",
    product_reference: "3214569874123",
    field: "quantity",
    old_value: 30,
    new_value: 25,
    date_detected: "2025-04-12 09:45:12",
    site_id: "3",
  },
  {
    id_history: 19,
    id_product: 2484,
    product_name: "Huile essentielle lavande",
    product_reference: "9874563214123",
    field: "price",
    old_value: 8.5,
    new_value: 8.75,
    date_detected: "2025-04-12 14:20:33",
    site_id: "4",
  },
  {
    id_history: 20,
    id_product: 2485,
    product_name: "Savon au lait d'ânesse",
    product_reference: "6541239874123",
    field: "quantity",
    old_value: 45,
    new_value: 40,
    date_detected: "2025-04-11 16:10:05",
    site_id: "1",
  },
]

// Données de démonstration pour les prix d'achat
const demoPurchasePriceHistory = [
  {
    id_history: 101,
    id_product: 2362,
    product_name: "Huile de massage relaxante",
    product_reference: "6547893214569",
    old_value: 4.5,
    new_value: 4.75,
    date_detected: "2025-04-14 12:04:06",
    site_id: "2",
  },
  {
    id_history: 102,
    id_product: 2455,
    product_name: "Crème solaire SPF 50",
    product_reference: "6541239874563",
    old_value: 6.8,
    new_value: 6.9,
    date_detected: "2025-04-14 12:04:06",
    site_id: "1",
  },
  {
    id_history: 103,
    id_product: 95165,
    product_name: "Yogi Tea Confort de l'Âme Bio 17 Sachets",
    product_reference: "4012824405547",
    old_value: 2.1,
    new_value: 2.0,
    date_detected: "2025-05-16 15:55:01",
    site_id: "3",
  },
  {
    id_history: 104,
    id_product: 2482,
    product_name: "Masque visage",
    product_reference: "6547893214123",
    old_value: 7.5,
    new_value: 7.8,
    date_detected: "2025-04-13 11:30:45",
    site_id: "2",
  },
  {
    id_history: 105,
    id_product: 2484,
    product_name: "Huile essentielle lavande",
    product_reference: "9874563214123",
    old_value: 5.2,
    new_value: 5.35,
    date_detected: "2025-04-12 14:20:33",
    site_id: "4",
  },
]

// Données de démonstration pour les statuts
const demoStatusHistory = [
  {
    id_history: 201,
    id_product: 2470,
    product_name: "Brosse à dents bambou",
    product_reference: "6541239874123",
    old_value: "Inactif",
    new_value: "Actif",
    date_detected: "2025-04-14 12:04:06",
    site_id: "1",
  },
  {
    id_history: 202,
    id_product: 2423,
    product_name: "Shampoing bio",
    product_reference: "3214569874563",
    old_value: "Actif",
    new_value: "Inactif",
    date_detected: "2025-04-14 12:04:06",
    site_id: "2",
  },
  {
    id_history: 203,
    id_product: 96040,
    product_name: "Biolane Expert Stick Solaire SPF50 Bébé Visage & Corps 20ml",
    product_reference: "3286010110169",
    old_value: "Inactif",
    new_value: "Actif",
    date_detected: "2025-05-16 15:55:01",
    site_id: "4",
  },
  {
    id_history: 204,
    id_product: 2481,
    product_name: "Lotion tonique",
    product_reference: "7896541236123",
    old_value: "Actif",
    new_value: "Inactif",
    date_detected: "2025-04-13 10:15:22",
    site_id: "3",
  },
  {
    id_history: 205,
    id_product: 2485,
    product_name: "Savon au lait d'ânesse",
    product_reference: "6541239874123",
    old_value: "Inactif",
    new_value: "Actif",
    date_detected: "2025-04-11 16:10:05",
    site_id: "1",
  },
]

interface AnalyseEvolutiveProduitsProps {
  initialSite?: string
  onSiteChange?: (site: string) => void
}

export default function AnalyseEvolutiveProduits({ initialSite = "1", onSiteChange }: AnalyseEvolutiveProduitsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("jour")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [selectedSite, setSelectedSite] = useState<string>(initialSite)
  const [stockTopCount, setStockTopCount] = useState<number>(10)
  const [priceTopCount, setPriceTopCount] = useState<number>(10)
  const [purchasePriceTopCount, setPurchasePriceTopCount] = useState<number>(10)
  const [statusTopCount, setStatusTopCount] = useState<number>(10)

  // Mettre à jour le site parent lorsque le site local change
  const handleSiteChange = (site: string) => {
    setSelectedSite(site)
    if (onSiteChange) {
      onSiteChange(site)
    }
  }

  // Initialiser avec la période par défaut (7 derniers jours)
  useEffect(() => {
    if (!dateRange) {
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)
      today.setHours(23, 59, 59, 999)
      setDateRange({ from: sevenDaysAgo, to: today })
    }
  }, [dateRange])

  const handleResetFilters = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)
    setDateRange({ from: sevenDaysAgo, to: today })
    setSelectedSite("all")
    setSelectedPeriod("jour")
  }

  // Filtrer les données par type (stock ou prix)
  const stockChanges = demoProductHistory.filter((item) => item.field === "quantity")
  const priceChanges = demoProductHistory.filter((item) => item.field === "price")

  // Calculer les statistiques
  const totalChanges = demoProductHistory.length
  const stockDecrease = stockChanges.filter((item) => item.new_value < item.old_value).length
  const stockIncrease = stockChanges.filter((item) => item.new_value > item.old_value).length
  const priceIncrease = priceChanges.filter((item) => item.new_value > item.old_value).length
  const priceDecrease = priceChanges.filter((item) => item.new_value < item.old_value).length

  // Calculer les produits avec les plus grandes variations
  const stockVariations = stockChanges.map((item) => ({
    ...item,
    variation: item.new_value - item.old_value,
    variationPercent: ((item.new_value - item.old_value) / item.old_value) * 100,
  }))

  const priceVariations = priceChanges.map((item) => ({
    ...item,
    variation: item.new_value - item.old_value,
    variationPercent: ((item.new_value - item.old_value) / item.old_value) * 100,
  }))

  // Trier par variation absolue
  const biggestStockVariations = [...stockVariations].sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation))

  const biggestPriceVariations = [...priceVariations].sort(
    (a, b) => Math.abs(b.variationPercent) - Math.abs(a.variationPercent),
  )

  // Calculer les variations de prix d'achat
  const purchasePriceVariations = demoPurchasePriceHistory.map((item) => ({
    ...item,
    variation: item.new_value - item.old_value,
    variationPercent: ((item.new_value - item.old_value) / item.old_value) * 100,
  }))

  // Préparer les données pour les graphiques
  // 1. Données pour le graphique d'évolution temporelle
  const timelineData = [...demoProductHistory]
    .sort((a, b) => new Date(a.date_detected).getTime() - new Date(b.date_detected).getTime())
    .reduce(
      (acc, item) => {
        const date = format(new Date(item.date_detected), "dd/MM/yyyy")
        const existingEntry = acc.find((entry) => entry.date === date)

        if (existingEntry) {
          if (item.field === "quantity") {
            existingEntry.stock += 1
          } else {
            existingEntry.price += 1
          }
        } else {
          acc.push({
            date,
            stock: item.field === "quantity" ? 1 : 0,
            price: item.field === "price" ? 1 : 0,
          })
        }

        return acc
      },
      [] as { date: string; stock: number; price: number }[],
    )

  // 2. Données pour le graphique de répartition par type
  const typeDistributionData = [
    { name: "Stock", value: stockChanges.length, color: "#3b82f6" },
    { name: "Prix de vente", value: priceChanges.length, color: "#10b981" },
    { name: "Prix d'achat", value: demoPurchasePriceHistory.length, color: "#f59e0b" },
    { name: "Statut", value: demoStatusHistory.length, color: "#6366f1" },
  ]

  // 3. Données pour le graphique de répartition par site
  const siteDistributionData = [
    { name: "Site 1", value: demoProductHistory.filter((item) => item.site_id === "1").length, color: "#3b82f6" },
    { name: "Site 2", value: demoProductHistory.filter((item) => item.site_id === "2").length, color: "#10b981" },
    { name: "Site 3", value: demoProductHistory.filter((item) => item.site_id === "3").length, color: "#f59e0b" },
    { name: "Site 4", value: demoProductHistory.filter((item) => item.site_id === "4").length, color: "#6366f1" },
  ]

  // 4. Données pour le graphique de tendances de stock par site
  const stockBySiteData = [
    {
      site: "Site 1",
      hausse: stockChanges.filter((item) => item.site_id === "1" && item.new_value > item.old_value).length,
      baisse: stockChanges.filter((item) => item.site_id === "1" && item.new_value < item.old_value).length,
    },
    {
      site: "Site 2",
      hausse: stockChanges.filter((item) => item.site_id === "2" && item.new_value > item.old_value).length,
      baisse: stockChanges.filter((item) => item.site_id === "2" && item.new_value < item.old_value).length,
    },
    {
      site: "Site 3",
      hausse: stockChanges.filter((item) => item.site_id === "3" && item.new_value > item.old_value).length,
      baisse: stockChanges.filter((item) => item.site_id === "3" && item.new_value < item.old_value).length,
    },
    {
      site: "Site 4",
      hausse: stockChanges.filter((item) => item.site_id === "4" && item.new_value > item.old_value).length,
      baisse: stockChanges.filter((item) => item.site_id === "4" && item.new_value < item.old_value).length,
    },
  ]

  // Composant réutilisable pour le sélecteur Top 10/50/100
  const TopSelector = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Afficher:</span>
      <select
        className="h-8 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value={10}>Top 10</option>
        <option value={50}>Top 50</option>
        <option value={100}>Top 100</option>
      </select>
    </div>
  )

  return (
    <div className="space-y-4">
      <FilterBar
        onDateChange={setDateRange}
        onSiteChange={handleSiteChange}
        onReset={handleResetFilters}
        dateValue={dateRange}
        siteValue={selectedSite}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variations de stock</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockChanges.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-red-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {stockDecrease} baisses
              </span>
              <span>|</span>
              <span className="flex items-center text-green-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {stockIncrease} hausses
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variations prix de vente</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceChanges.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {priceIncrease} hausses
              </span>
              <span>|</span>
              <span className="flex items-center text-red-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {priceDecrease} baisses
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variations prix d'achat</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoPurchasePriceHistory.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {demoPurchasePriceHistory.filter((item) => item.new_value > item.old_value).length} hausses
              </span>
              <span>|</span>
              <span className="flex items-center text-red-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {demoPurchasePriceHistory.filter((item) => item.new_value < item.old_value).length} baisses
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variations du statut</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demoStatusHistory.length}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpIcon className="mr-1 h-3 w-3" />
                {demoStatusHistory.filter((item) => item.new_value === "Actif").length} activations
              </span>
              <span>|</span>
              <span className="flex items-center text-red-500">
                <ArrowDownIcon className="mr-1 h-3 w-3" />
                {demoStatusHistory.filter((item) => item.new_value === "Inactif").length} désactivations
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modifications totales</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalChanges + demoPurchasePriceHistory.length + demoStatusHistory.length}
            </div>
            <p className="text-xs text-muted-foreground">modifications détectées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière mise à jour</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(demoProductHistory[0].date_detected), "dd MMM", { locale: fr })}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(demoProductHistory[0].date_detected), "HH:mm", { locale: fr })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Variations de stock</TabsTrigger>
          <TabsTrigger value="price">Variations prix de vente</TabsTrigger>
          <TabsTrigger value="purchase-price">Variations prix d'achat</TabsTrigger>
          <TabsTrigger value="status">Variations du statut</TabsTrigger>
          <TabsTrigger value="graphs">Graphiques</TabsTrigger>
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Principales variations de stock</CardTitle>
                <CardDescription>Les produits avec les plus grandes variations de stock</CardDescription>
              </div>
              <TopSelector value={stockTopCount} onChange={setStockTopCount} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Produit</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancienne valeur</TableHead>
                    <TableHead>Nouvelle valeur</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {biggestStockVariations.slice(0, stockTopCount).map((item) => (
                    <TableRow key={item.id_history}>
                      <TableCell className="font-medium">{item.id_product}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.old_value}</TableCell>
                      <TableCell>{item.new_value}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.variation > 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <ArrowUpIcon className="mr-1 h-3 w-3" />+{item.variation}
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <ArrowDownIcon className="mr-1 h-3 w-3" />
                              {item.variation}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Site {item.site_id}</TableCell>
                      <TableCell>{format(new Date(item.date_detected), "dd/MM/yyyy HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Principales variations de prix de vente</CardTitle>
                <CardDescription>Les produits avec les plus grandes variations de prix de vente</CardDescription>
              </div>
              <TopSelector value={priceTopCount} onChange={setPriceTopCount} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Produit</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancien prix</TableHead>
                    <TableHead>Nouveau prix</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {biggestPriceVariations.slice(0, priceTopCount).map((item) => (
                    <TableRow key={item.id_history}>
                      <TableCell className="font-medium">{item.id_product}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.old_value.toFixed(2)} €</TableCell>
                      <TableCell>{item.new_value.toFixed(2)} €</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.variation > 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <ArrowUpIcon className="mr-1 h-3 w-3" />+{item.variation.toFixed(2)} € (
                              {item.variationPercent.toFixed(1)}%)
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <ArrowDownIcon className="mr-1 h-3 w-3" />
                              {item.variation.toFixed(2)} € ({item.variationPercent.toFixed(1)}%)
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Site {item.site_id}</TableCell>
                      <TableCell>{format(new Date(item.date_detected), "dd/MM/yyyy HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-price" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Principales variations de prix d'achat</CardTitle>
                <CardDescription>Les produits avec les plus grandes variations de prix d'achat</CardDescription>
              </div>
              <TopSelector value={purchasePriceTopCount} onChange={setPurchasePriceTopCount} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Produit</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancien prix</TableHead>
                    <TableHead>Nouveau prix</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchasePriceVariations.slice(0, purchasePriceTopCount).map((item) => (
                    <TableRow key={item.id_history}>
                      <TableCell className="font-medium">{item.id_product}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.old_value.toFixed(2)} €</TableCell>
                      <TableCell>{item.new_value.toFixed(2)} €</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.variation > 0 ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <ArrowUpIcon className="mr-1 h-3 w-3" />+{item.variation.toFixed(2)} € (
                              {item.variationPercent.toFixed(1)}%)
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <ArrowDownIcon className="mr-1 h-3 w-3" />
                              {item.variation.toFixed(2)} € ({item.variationPercent.toFixed(1)}%)
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Site {item.site_id}</TableCell>
                      <TableCell>{format(new Date(item.date_detected), "dd/MM/yyyy HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Principales variations de statut</CardTitle>
                <CardDescription>Les produits avec des changements de statut récents</CardDescription>
              </div>
              <TopSelector value={statusTopCount} onChange={setStatusTopCount} />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Produit</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ancien statut</TableHead>
                    <TableHead>Nouveau statut</TableHead>
                    <TableHead>Variation</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoStatusHistory.slice(0, statusTopCount).map((item) => (
                    <TableRow key={item.id_history}>
                      <TableCell className="font-medium">{item.id_product}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.old_value}</TableCell>
                      <TableCell>{item.new_value}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.new_value === "Actif" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <ArrowUpIcon className="mr-1 h-3 w-3" />
                              Activation
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <ArrowDownIcon className="mr-1 h-3 w-3" />
                              Désactivation
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>Site {item.site_id}</TableCell>
                      <TableCell>{format(new Date(item.date_detected), "dd/MM/yyyy HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graphs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Graphique d'évolution temporelle */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des modifications dans le temps</CardTitle>
                <CardDescription>Nombre de modifications par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    stock: {
                      label: "Variations de stock",
                      color: "hsl(var(--chart-1))",
                    },
                    price: {
                      label: "Variations de prix",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="stock" stroke="var(--color-stock)" name="Variations de stock" />
                      <Line type="monotone" dataKey="price" stroke="var(--color-price)" name="Variations de prix" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Graphique de répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par type de modification</CardTitle>
                <CardDescription>Distribution des modifications par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {typeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} modifications`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique de répartition par site */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par site</CardTitle>
                <CardDescription>Distribution des modifications par site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={siteDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {siteDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} modifications`, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Graphique de tendances de stock par site */}
            <Card>
              <CardHeader>
                <CardTitle>Tendances de stock par site</CardTitle>
                <CardDescription>Hausses et baisses de stock par site</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    hausse: {
                      label: "Hausses",
                      color: "hsl(var(--chart-1))",
                    },
                    baisse: {
                      label: "Baisses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockBySiteData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="site" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="hausse" fill="var(--color-hausse)" name="Hausses" />
                      <Bar dataKey="baisse" fill="var(--color-baisse)" name="Baisses" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chronologie des modifications</CardTitle>
              <CardDescription>Historique complet des modifications de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>ID Produit</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Champ</TableHead>
                    <TableHead>Ancienne valeur</TableHead>
                    <TableHead>Nouvelle valeur</TableHead>
                    <TableHead>Site</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoProductHistory.slice(0, 15).map((item) => (
                    <TableRow key={item.id_history}>
                      <TableCell>{format(new Date(item.date_detected), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell className="font-medium">{item.id_product}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>
                        {item.field === "quantity" ? (
                          <Badge variant="outline" className="bg-blue-50">
                            Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50">
                            Prix
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.field === "price" ? `${item.old_value.toFixed(2)} €` : item.old_value}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {item.field === "price" ? `${item.new_value.toFixed(2)} €` : item.new_value}
                          {item.new_value > item.old_value ? (
                            <ArrowUpIcon className="ml-1 h-3 w-3 text-green-500" />
                          ) : item.new_value < item.old_value ? (
                            <ArrowDownIcon className="ml-1 h-3 w-3 text-red-500" />
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>Site {item.site_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
