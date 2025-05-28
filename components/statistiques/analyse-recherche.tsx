"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, AlertTriangle } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
type Recherche = {
  id_query: number
  key_word: string
  date_add: string
  count?: number
  id_site?: string
}

// Données de démonstration pour les recherches
const recherches: Recherche[] = [
  { id_query: 1, key_word: "smartphone", date_add: "2023-05-01T10:30:00", id_site: "1" },
  { id_query: 2, key_word: "écouteurs sans fil", date_add: "2023-05-01T11:45:00", id_site: "1" },
  { id_query: 3, key_word: "chargeur rapide", date_add: "2023-05-01T14:20:00", id_site: "2" },
  { id_query: 4, key_word: "coque iphone", date_add: "2023-05-01T16:10:00", id_site: "1" },
  { id_query: 5, key_word: "smartphone", date_add: "2023-05-02T09:15:00", id_site: "1" },
  { id_query: 6, key_word: "tablette", date_add: "2023-05-02T10:30:00", id_site: "2" },
  { id_query: 7, key_word: "smartphone", date_add: "2023-05-02T11:45:00", id_site: "3" },
  { id_query: 8, key_word: "écouteurs bluetooth", date_add: "2023-05-02T14:20:00", id_site: "1" },
  { id_query: 9, key_word: "batterie externe", date_add: "2023-05-02T16:10:00", id_site: "2" },
  { id_query: 10, key_word: "smartphone samsung", date_add: "2023-05-03T09:15:00", id_site: "1" },
  { id_query: 11, key_word: "iphone", date_add: "2023-05-03T10:30:00", id_site: "1" },
  { id_query: 12, key_word: "écouteurs sans fil", date_add: "2023-05-03T11:45:00", id_site: "2" },
  { id_query: 13, key_word: "chargeur usb-c", date_add: "2023-05-03T14:20:00", id_site: "1" },
  { id_query: 14, key_word: "coque samsung", date_add: "2023-05-03T16:10:00", id_site: "3" },
  { id_query: 15, key_word: "smartphone", date_add: "2023-05-04T09:15:00", id_site: "1" },
  { id_query: 16, key_word: "montre connectée", date_add: "2023-05-04T10:30:00", id_site: "2" },
  { id_query: 17, key_word: "écouteurs sans fil", date_add: "2023-05-04T11:45:00", id_site: "1" },
  { id_query: 18, key_word: "clavier bluetooth", date_add: "2023-05-04T14:20:00", id_site: "3" },
  { id_query: 19, key_word: "souris sans fil", date_add: "2023-05-04T16:10:00", id_site: "1" },
  { id_query: 20, key_word: "smartphone", date_add: "2023-05-05T09:15:00", id_site: "2" },
  { id_query: 21, key_word: "casque audio", date_add: "2023-05-05T10:30:00", id_site: "1" },
  { id_query: 22, key_word: "écouteurs sans fil", date_add: "2023-05-05T11:45:00", id_site: "3" },
  { id_query: 23, key_word: "chargeur sans fil", date_add: "2023-05-05T14:20:00", id_site: "1" },
  { id_query: 24, key_word: "coque iphone", date_add: "2023-05-05T16:10:00", id_site: "2" },
  { id_query: 25, key_word: "smartphone", date_add: "2023-05-06T09:15:00", id_site: "1" },
  { id_query: 26, key_word: "tablette samsung", date_add: "2023-05-06T10:30:00", id_site: "3" },
  { id_query: 27, key_word: "écouteurs sans fil", date_add: "2023-05-06T11:45:00", id_site: "1" },
  { id_query: 28, key_word: "adaptateur hdmi", date_add: "2023-05-06T14:20:00", id_site: "2" },
  { id_query: 29, key_word: "câble usb", date_add: "2023-05-06T16:10:00", id_site: "1" },
  { id_query: 30, key_word: "smartphone", date_add: "2023-05-07T09:15:00", id_site: "3" },
]

// Données de démonstration pour les recherches sans résultats
const recherchesSansResultats: Recherche[] = [
  { id_query: 1, key_word: "smartphone pliable", date_add: "2023-05-01T10:30:00", id_site: "1" },
  { id_query: 2, key_word: "écouteurs gaming", date_add: "2023-05-01T11:45:00", id_site: "2" },
  { id_query: 3, key_word: "chargeur 100w", date_add: "2023-05-02T14:20:00", id_site: "1" },
  { id_query: 4, key_word: "coque biodégradable", date_add: "2023-05-02T16:10:00", id_site: "3" },
  { id_query: 5, key_word: "smartphone pliable", date_add: "2023-05-03T09:15:00", id_site: "2" },
  { id_query: 6, key_word: "tablette e-ink", date_add: "2023-05-03T10:30:00", id_site: "1" },
  { id_query: 7, key_word: "écouteurs traduction", date_add: "2023-05-04T11:45:00", id_site: "3" },
  { id_query: 8, key_word: "clavier rétroéclairé", date_add: "2023-05-04T14:20:00", id_site: "1" },
  { id_query: 9, key_word: "souris ergonomique", date_add: "2023-05-05T16:10:00", id_site: "2" },
  { id_query: 10, key_word: "smartphone pliable", date_add: "2023-05-06T09:15:00", id_site: "1" },
  { id_query: 11, key_word: "casque réalité virtuelle", date_add: "2023-05-06T10:30:00", id_site: "3" },
  { id_query: 12, key_word: "écouteurs antibruit", date_add: "2023-05-07T11:45:00", id_site: "2" },
]

// Couleurs pour les graphiques
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"]
const COLORS_PIE = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export default function AnalyseRecherche() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [periodType, setPeriodType] = useState<"day" | "week" | "month">("day")
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    today.setHours(23, 59, 59, 999)
    setDateRange({ from: sevenDaysAgo, to: today })
    setSelectedSite("")
    setSearchTerm("")
  }

  // Initialiser avec les 7 derniers jours au chargement
  useEffect(() => {
    if (!dateRange) {
      resetFilters()
    }
  }, [])

  // Filtrer les données en fonction des filtres sélectionnés
  const recherchesFiltrees = recherches.filter((recherche) => {
    let matchesSite = true
    let matchesSearch = true

    if (selectedSite) {
      matchesSite = recherche.id_site === selectedSite
    }

    if (searchTerm) {
      matchesSearch = recherche.key_word.toLowerCase().includes(searchTerm.toLowerCase())
    }

    return matchesSite && matchesSearch
  })

  const recherchesSansResultatsFiltrees = recherchesSansResultats.filter((recherche) => {
    let matchesSite = true
    let matchesSearch = true

    if (selectedSite) {
      matchesSite = recherche.id_site === selectedSite
    }

    if (searchTerm) {
      matchesSearch = recherche.key_word.toLowerCase().includes(searchTerm.toLowerCase())
    }

    return matchesSite && matchesSearch
  })

  // Regrouper les recherches par mot-clé pour obtenir les plus populaires
  const rechercheParMotCle = recherchesFiltrees.reduce(
    (acc, recherche) => {
      const motCle = recherche.key_word.toLowerCase()
      if (!acc[motCle]) {
        acc[motCle] = 0
      }
      acc[motCle]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Convertir en tableau et trier par nombre de recherches
  const motsClesPopulaires = Object.entries(rechercheParMotCle)
    .map(([key_word, count]) => ({ key_word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Regrouper les recherches sans résultats par mot-clé
  const recherchesSansResultatsParMotCle = recherchesSansResultatsFiltrees.reduce(
    (acc, recherche) => {
      const motCle = recherche.key_word.toLowerCase()
      if (!acc[motCle]) {
        acc[motCle] = 0
      }
      acc[motCle]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Convertir en tableau et trier par nombre de recherches
  const motsClesSansResultats = Object.entries(recherchesSansResultatsParMotCle)
    .map(([key_word, count]) => ({ key_word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Regrouper les recherches par jour pour le graphique d'évolution
  const rechercheParJour = recherchesFiltrees.reduce(
    (acc, recherche) => {
      const date = new Date(recherche.date_add).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Convertir en tableau pour le graphique
  const evolutionRecherches = Object.entries(rechercheParJour)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("")
      const dateB = b.date.split("/").reverse().join("")
      return dateA.localeCompare(dateB)
    })

  // Regrouper les recherches sans résultats par jour
  const recherchesSansResultatsParJour = recherchesSansResultatsFiltrees.reduce(
    (acc, recherche) => {
      const date = new Date(recherche.date_add).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      return acc
    },
    {} as Record<string, number>,
  )

  // Convertir en tableau pour le graphique
  const evolutionRecherchesSansResultats = Object.entries(recherchesSansResultatsParJour)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const dateA = a.date.split("/").reverse().join("")
      const dateB = b.date.split("/").reverse().join("")
      return dateA.localeCompare(dateB)
    })

  // Calculer le taux de recherches sans résultats
  const totalRecherches = recherchesFiltrees.length
  const totalRecherchesSansResultats = recherchesSansResultatsFiltrees.length
  const tauxRecherchesSansResultats = totalRecherches > 0 ? (totalRecherchesSansResultats / totalRecherches) * 100 : 0

  // Données pour le graphique en camembert
  const donneesRepartition = [
    { name: "Recherches avec résultats", value: totalRecherches - totalRecherchesSansResultats },
    { name: "Recherches sans résultats", value: totalRecherchesSansResultats },
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

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrer par mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={resetFilters} className="shrink-0">
          Réinitialiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total des recherches</CardTitle>
            <CardDescription className="text-xs">Nombre total de recherches effectuées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRecherches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recherches sans résultats</CardTitle>
            <CardDescription className="text-xs">Nombre de recherches n'ayant retourné aucun résultat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRecherchesSansResultats}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taux d'échec</CardTitle>
            <CardDescription className="text-xs">Pourcentage de recherches sans résultats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tauxRecherchesSansResultats.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tendances" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tendances">Tendances de recherche</TabsTrigger>
          <TabsTrigger value="sans-resultats">Recherches sans résultats</TabsTrigger>
          <TabsTrigger value="evolution">Évolution temporelle</TabsTrigger>
        </TabsList>

        {/* Onglet Tendances de recherche */}
        <TabsContent value="tendances" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top 10 des recherches</CardTitle>
                    <CardDescription>Mots-clés les plus recherchés</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={motsClesPopulaires}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="key_word" type="category" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Nombre de recherches" fill={COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Détail des recherches populaires</CardTitle>
                    <CardDescription>Liste des mots-clés les plus recherchés</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Mot-clé</TableHead>
                      <TableHead className="text-right">Nombre de recherches</TableHead>
                      <TableHead className="text-right">% du total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motsClesPopulaires.map((motCle, index) => (
                      <TableRow key={motCle.key_word}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{motCle.key_word}</TableCell>
                        <TableCell className="text-right">{motCle.count}</TableCell>
                        <TableCell className="text-right">
                          {((motCle.count / totalRecherches) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Recherches sans résultats */}
        <TabsContent value="sans-resultats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top recherches sans résultats</CardTitle>
                    <CardDescription>Opportunités d'amélioration du catalogue</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={motsClesSansResultats}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="key_word" type="category" tick={{ fontSize: 12 }} width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Nombre de recherches" fill={COLORS[1]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Répartition des recherches</CardTitle>
                    <CardDescription>Avec et sans résultats</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donneesRepartition}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {donneesRepartition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Nombre de recherches"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Recherches avec résultats</div>
                    <div className="text-xl font-bold">{totalRecherches - totalRecherchesSansResultats}</div>
                    <div className="text-sm text-muted-foreground">
                      {((1 - tauxRecherchesSansResultats / 100) * 100).toFixed(1)}% du total
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">Recherches sans résultats</div>
                    <div className="text-xl font-bold">{totalRecherchesSansResultats}</div>
                    <div className="text-sm text-muted-foreground">
                      {tauxRecherchesSansResultats.toFixed(1)}% du total
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
                  <CardTitle>Détail des recherches sans résultats</CardTitle>
                  <CardDescription>Liste des mots-clés sans résultats</CardDescription>
                </div>
                <ExportButton />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mot-clé</TableHead>
                    <TableHead className="text-right">Nombre de recherches</TableHead>
                    <TableHead className="text-right">Dernière recherche</TableHead>
                    <TableHead className="text-right">Site</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {motsClesSansResultats.map((motCle) => {
                    // Trouver la recherche la plus récente pour ce mot-clé
                    const recherchesMotCle = recherchesSansResultatsFiltrees.filter(
                      (r) => r.key_word.toLowerCase() === motCle.key_word.toLowerCase(),
                    )
                    const derniereRecherche = recherchesMotCle.sort(
                      (a, b) => new Date(b.date_add).getTime() - new Date(a.date_add).getTime(),
                    )[0]

                    return (
                      <TableRow key={motCle.key_word}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            {motCle.key_word}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{motCle.count}</TableCell>
                        <TableCell className="text-right">
                          {new Date(derniereRecherche.date_add).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">Site {derniereRecherche.id_site}</TableCell>
                        <TableCell className="text-right">-</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Évolution temporelle */}
        <TabsContent value="evolution" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Évolution des recherches</CardTitle>
                    <CardDescription>Nombre de recherches par jour</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={periodType}
                      onValueChange={(value) => setPeriodType(value as "day" | "week" | "month")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Par jour</SelectItem>
                        <SelectItem value="week">Par semaine</SelectItem>
                        <SelectItem value="month">Par mois</SelectItem>
                      </SelectContent>
                    </Select>
                    <ExportButton />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={evolutionRecherches}
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
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Nombre de recherches"
                        stroke={COLORS[0]}
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
                    <CardTitle>Évolution des recherches sans résultats</CardTitle>
                    <CardDescription>Nombre de recherches sans résultats par jour</CardDescription>
                  </div>
                  <ExportButton />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={evolutionRecherchesSansResultats}
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
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Recherches sans résultats"
                        stroke={COLORS[1]}
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
