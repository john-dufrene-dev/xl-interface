"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { FilterBar } from "@/components/filter-bar"
import { ExportButton } from "@/components/export-button"

// Types
type TopProduit = {
  id: string
  nom: string
  reference: string
  quantite: number
  chiffreAffaires: number
  categorie: string
  marque: string
  evolution: number
  image: string
  id_site: string
}

// Données de démonstration - Produits de parapharmacie français (version réduite)
const topProduits: TopProduit[] = [
  {
    id: "1",
    nom: "Eau Thermale Avène 300ml",
    reference: "AVE-ET300",
    quantite: 312,
    chiffreAffaires: 3432,
    categorie: "Soins visage",
    marque: "Avène",
    evolution: 8,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "2",
    nom: "Effaclar Duo+ La Roche-Posay 40ml",
    reference: "LRP-EFF40",
    quantite: 287,
    chiffreAffaires: 5166,
    categorie: "Soins visage",
    marque: "La Roche-Posay",
    evolution: 15,
    image: "/placeholder.svg",
    id_site: "2",
  },
  {
    id: "3",
    nom: "Cicaplast Baume B5 La Roche-Posay 100ml",
    reference: "LRP-CIC100",
    quantite: 265,
    chiffreAffaires: 3975,
    categorie: "Soins corps",
    marque: "La Roche-Posay",
    evolution: 22,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "4",
    nom: "Sensibio H2O Bioderma 500ml",
    reference: "BIO-SH500",
    quantite: 243,
    chiffreAffaires: 3645,
    categorie: "Nettoyants",
    marque: "Bioderma",
    evolution: 5,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "5",
    nom: "Huile Prodigieuse Nuxe 100ml",
    reference: "NUX-HP100",
    quantite: 231,
    chiffreAffaires: 6930,
    categorie: "Soins corps",
    marque: "Nuxe",
    evolution: -2,
    image: "/placeholder.svg",
    id_site: "3",
  },
  {
    id: "6",
    nom: "Céralip Stick Lèvres SVR 4g",
    reference: "SVR-CL4",
    quantite: 218,
    chiffreAffaires: 1744,
    categorie: "Lèvres",
    marque: "SVR",
    evolution: 12,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "7",
    nom: "Crème Mains Neutrogena 75ml",
    reference: "NEU-CM75",
    quantite: 205,
    chiffreAffaires: 1640,
    categorie: "Soins corps",
    marque: "Neutrogena",
    evolution: 3,
    image: "/placeholder.svg",
    id_site: "2",
  },
  {
    id: "8",
    nom: "Hydrabio Sérum Bioderma 40ml",
    reference: "BIO-HS40",
    quantite: 198,
    chiffreAffaires: 4950,
    categorie: "Soins visage",
    marque: "Bioderma",
    evolution: 18,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "9",
    nom: "Lipikar Baume AP+M La Roche-Posay 400ml",
    reference: "LRP-LB400",
    quantite: 187,
    chiffreAffaires: 5610,
    categorie: "Soins corps",
    marque: "La Roche-Posay",
    evolution: 10,
    image: "/placeholder.svg",
    id_site: "1",
  },
  {
    id: "10",
    nom: "Cicalfate+ Crème Réparatrice Avène 100ml",
    reference: "AVE-CR100",
    quantite: 176,
    chiffreAffaires: 2640,
    categorie: "Soins corps",
    marque: "Avène",
    evolution: 7,
    image: "/placeholder.svg",
    id_site: "2",
  },
]

// Couleurs pour les graphiques
const COLORS_PRODUITS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
  "#8dd1e1",
  "#a4262c",
  "#0078d4",
]
const COLORS_CATEGORIES = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#a4de6c",
  "#d0ed57",
  "#83a6ed",
]
const COLORS_MARQUES = [
  "#8dd1e1",
  "#a4262c",
  "#0078d4",
  "#107c10",
  "#ffb900",
  "#d83b01",
  "#b4009e",
  "#5c2d91",
  "#008575",
  "#004e8c",
]

export default function TopProduits() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedSite, setSelectedSite] = useState("")
  const [triPar, setTriPar] = useState("quantite")
  const [nombreElements, setNombreElements] = useState(10)

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

  // Filtrer les produits en fonction des filtres sélectionnés
  const produitsFiltres = topProduits.filter((produit) => {
    let matchesSite = true

    if (selectedSite) {
      matchesSite = produit.id_site === selectedSite
    }

    return matchesSite
  })

  // Trier les produits en fonction du critère sélectionné
  const produitsTries = [...produitsFiltres].sort((a, b) => {
    if (triPar === "quantite") {
      return b.quantite - a.quantite
    } else if (triPar === "chiffreAffaires") {
      return b.chiffreAffaires - a.chiffreAffaires
    } else if (triPar === "evolution") {
      return b.evolution - a.evolution
    }
    return 0
  })

  // Modifier les données pour le graphique en barres - Top N produits
  const donneesBarresProduits = produitsTries.slice(0, nombreElements).map((produit) => ({
    nom: produit.nom,
    quantite: produit.quantite,
    chiffreAffaires: produit.chiffreAffaires / 1000, // Convertir en milliers d'euros pour l'affichage
  }))

  // Calculer les données pour les catégories
  const categoriesMap = new Map<string, { quantite: number; chiffreAffaires: number }>()
  produitsFiltres.forEach((produit) => {
    if (!categoriesMap.has(produit.categorie)) {
      categoriesMap.set(produit.categorie, { quantite: 0, chiffreAffaires: 0 })
    }
    const categorie = categoriesMap.get(produit.categorie)!
    categorie.quantite += produit.quantite
    categorie.chiffreAffaires += produit.chiffreAffaires
  })

  // Modifier les données pour les catégories
  const categoriesTries = Array.from(categoriesMap.entries())
    .map(([categorie, data]) => ({
      nom: categorie,
      quantite: data.quantite,
      chiffreAffaires: data.chiffreAffaires / 1000, // Convertir en milliers d'euros
    }))
    .sort((a, b) => (triPar === "quantite" ? b.quantite - a.quantite : b.chiffreAffaires - a.chiffreAffaires))
    .slice(0, nombreElements)

  // Calculer les données pour les marques
  const marquesMap = new Map<string, { quantite: number; chiffreAffaires: number }>()
  produitsFiltres.forEach((produit) => {
    if (!marquesMap.has(produit.marque)) {
      marquesMap.set(produit.marque, { quantite: 0, chiffreAffaires: 0 })
    }
    const marque = marquesMap.get(produit.marque)!
    marque.quantite += produit.quantite
    marque.chiffreAffaires += produit.chiffreAffaires
  })

  // Modifier les données pour les marques
  const marquesTries = Array.from(marquesMap.entries())
    .map(([marque, data]) => ({
      nom: marque,
      quantite: data.quantite,
      chiffreAffaires: data.chiffreAffaires / 1000, // Convertir en milliers d'euros
    }))
    .sort((a, b) => (triPar === "quantite" ? b.quantite - a.quantite : b.chiffreAffaires - a.chiffreAffaires))
    .slice(0, nombreElements)

  // Données pour le graphique en camembert des catégories
  const donneesPieCategories = categoriesTries.map((cat) => ({
    name: cat.nom,
    value: triPar === "quantite" ? cat.quantite : cat.chiffreAffaires,
  }))

  // Données pour le graphique en camembert des marques
  const donneesPieMarques = marquesTries.map((marque) => ({
    name: marque.nom,
    value: triPar === "quantite" ? marque.quantite : marque.chiffreAffaires,
  }))

  return (
    <div className="space-y-4">
      <FilterBar
        dateValue={dateRange}
        siteValue={selectedSite}
        onDateChange={setDateRange}
        onSiteChange={setSelectedSite}
        onReset={resetFilters}
      />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Options d'analyse</CardTitle>
              <CardDescription>Choisissez comment vous souhaitez analyser vos données</CardDescription>
            </div>
            <ExportButton />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Trier par</label>
              <Select value={triPar} onValueChange={setTriPar}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sélectionner un critère" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quantite">Quantité vendue</SelectItem>
                  <SelectItem value="chiffreAffaires">Chiffre d'affaires</SelectItem>
                  <SelectItem value="evolution">Évolution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="text-sm font-medium mb-1 block">Nombre d'éléments</label>
              <Select
                value={nombreElements.toString()}
                onValueChange={(value) => setNombreElements(Number.parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Nombre d'éléments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="produits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="produits">Top Produits</TabsTrigger>
          <TabsTrigger value="categories">Top Catégories</TabsTrigger>
          <TabsTrigger value="marques">Top Marques</TabsTrigger>
        </TabsList>

        {/* Onglet Top Produits */}
        <TabsContent value="produits" className="space-y-4">
          <Tabs defaultValue="tableau" className="space-y-4">
            <TabsList>
              <TabsTrigger value="graphiques">Graphiques</TabsTrigger>
              <TabsTrigger value="tableau">Tableau</TabsTrigger>
            </TabsList>

            <TabsContent value="graphiques">
              <Card>
                <CardHeader>
                  <CardTitle>Top {nombreElements} des produits les plus vendus</CardTitle>
                  <CardDescription>
                    {triPar === "quantite"
                      ? "Par quantité vendue"
                      : triPar === "chiffreAffaires"
                        ? "Par chiffre d'affaires (K€)"
                        : "Par évolution"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={donneesBarresProduits}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 120,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nom" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "chiffreAffaires") {
                              return [`${value} K€`, "Chiffre d'affaires"]
                            }
                            return [value, name === "quantite" ? "Quantité vendue" : name]
                          }}
                        />
                        <Legend />
                        {triPar === "quantite" ? (
                          <Bar dataKey="quantite" name="Quantité vendue" fill={COLORS_PRODUITS[0]}>
                            {donneesBarresProduits.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS_PRODUITS[index % COLORS_PRODUITS.length]} />
                            ))}
                          </Bar>
                        ) : (
                          <Bar dataKey="chiffreAffaires" name="Chiffre d'affaires (K€)" fill={COLORS_PRODUITS[1]}>
                            {donneesBarresProduits.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS_PRODUITS[index % COLORS_PRODUITS.length]} />
                            ))}
                          </Bar>
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tableau">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Liste des produits les plus vendus</CardTitle>
                      <CardDescription>
                        {selectedSite
                          ? `Filtré par site: ${
                              selectedSite === "1"
                                ? "Site Principal"
                                : selectedSite === "2"
                                  ? "Site Secondaire"
                                  : selectedSite === "3"
                                    ? "Marketplace"
                                    : "Boutique Internationale"
                            }`
                          : "Tous les sites"}
                      </CardDescription>
                    </div>
                    <ExportButton />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rang</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Référence</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Marque</TableHead>
                        <TableHead className="text-right">Quantité</TableHead>
                        <TableHead className="text-right">Chiffre d'affaires</TableHead>
                        <TableHead className="text-right">Évolution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produitsTries.slice(0, nombreElements).map((produit, index) => (
                        <TableRow key={produit.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-md bg-muted mr-2">
                                <img
                                  src={produit.image || "/placeholder.svg"}
                                  alt={produit.nom}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              </div>
                              {produit.nom}
                            </div>
                          </TableCell>
                          <TableCell>{produit.reference}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{produit.categorie}</Badge>
                          </TableCell>
                          <TableCell>{produit.marque}</TableCell>
                          <TableCell className="text-right">{produit.quantite}</TableCell>
                          <TableCell className="text-right">
                            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                              produit.chiffreAffaires,
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div
                              className={`flex items-center justify-end ${
                                produit.evolution > 0
                                  ? "text-green-600"
                                  : produit.evolution < 0
                                    ? "text-red-600"
                                    : "text-gray-500"
                              }`}
                            >
                              {produit.evolution > 0 ? (
                                <ArrowUp className="h-4 w-4 mr-1" />
                              ) : produit.evolution < 0 ? (
                                <ArrowDown className="h-4 w-4 mr-1" />
                              ) : (
                                <Minus className="h-4 w-4 mr-1" />
                              )}
                              {produit.evolution > 0 ? "+" : ""}
                              {produit.evolution}%
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Onglets simplifiés pour les catégories et marques */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Top catégories</CardTitle>
              <CardDescription>Analyse des catégories de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Quantité vendue</TableHead>
                    <TableHead className="text-right">Chiffre d'affaires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesTries.map((categorie, index) => (
                    <TableRow key={categorie.nom}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{categorie.nom}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{categorie.quantite}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                          categorie.chiffreAffaires * 1000,
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marques">
          <Card>
            <CardHeader>
              <CardTitle>Top marques</CardTitle>
              <CardDescription>Analyse des marques de produits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rang</TableHead>
                    <TableHead>Marque</TableHead>
                    <TableHead className="text-right">Quantité vendue</TableHead>
                    <TableHead className="text-right">Chiffre d'affaires</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marquesTries.map((marque, index) => (
                    <TableRow key={marque.nom}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{marque.nom}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{marque.quantite}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                          marque.chiffreAffaires * 1000,
                        )}
                      </TableCell>
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
