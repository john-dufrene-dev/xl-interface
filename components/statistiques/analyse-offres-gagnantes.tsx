"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"

interface AnalyseOffresGagnantesProps {
  dateRange?: DateRange
  site?: string
}

interface Produit {
  id: string
  nom: string
  categorie: string
  prix: Record<string, number>
  prixPromo: Record<string, number | null>
  siteGagnant: string
  ecartPrix: number
  enPromo: boolean
}

interface SiteStats {
  site: string
  nbOffresGagnantes: number
  pourcentage: number
  ecartMoyen: number
  tauxPromo: number
  color: string
}

export function AnalyseOffresGagnantes({ dateRange, site }: AnalyseOffresGagnantesProps) {
  const [activeTab, setActiveTab] = useState("apercu")
  const [categorieFilter, setCategorieFilter] = useState("all")
  const [produits, setProduits] = useState<Produit[]>([])
  const [siteStats, setSiteStats] = useState<SiteStats[]>([])

  // Générer des données simulées
  useEffect(() => {
    // Simuler l'effet des filtres
    const siteFilter = site === "all" ? null : site

    // Catégories de produits
    const categories = ["Électronique", "Vêtements", "Maison", "Jardin", "Alimentation"]

    // Couleurs pour les graphiques
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]

    // Générer des produits aléatoires
    const generateProduits = () => {
      const produits: Produit[] = []

      for (let i = 1; i <= 50; i++) {
        const categorieIndex = Math.floor(Math.random() * categories.length)
        const categorie = categories[categorieIndex]

        // Générer des prix pour chaque site
        const prix: Record<string, number> = {
          "1": Math.floor(Math.random() * 100) + 50,
          "2": Math.floor(Math.random() * 100) + 50,
          "3": Math.floor(Math.random() * 100) + 50,
          "4": Math.floor(Math.random() * 100) + 50,
        }

        // Générer des prix promo pour certains produits
        const prixPromo: Record<string, number | null> = {
          "1": Math.random() > 0.7 ? prix["1"] * 0.8 : null,
          "2": Math.random() > 0.7 ? prix["2"] * 0.8 : null,
          "3": Math.random() > 0.7 ? prix["3"] * 0.8 : null,
          "4": Math.random() > 0.7 ? prix["4"] * 0.8 : null,
        }

        // Déterminer le site gagnant (prix le plus bas)
        let siteGagnant = "1"
        let prixMin = prixPromo["1"] !== null ? prixPromo["1"]! : prix["1"]

        for (let j = 2; j <= 4; j++) {
          const siteId = j.toString()
          const prixSite = prixPromo[siteId] !== null ? prixPromo[siteId]! : prix[siteId]

          if (prixSite < prixMin) {
            prixMin = prixSite
            siteGagnant = siteId
          }
        }

        // Calculer l'écart de prix
        const prixMoyen = Object.values(prix).reduce((sum, p) => sum + p, 0) / 4
        const ecartPrix = ((prixMoyen - prixMin) / prixMoyen) * 100

        // Déterminer si le produit est en promo
        const enPromo = prixPromo[siteGagnant] !== null

        produits.push({
          id: `PROD-${i.toString().padStart(3, "0")}`,
          nom: `Produit ${i}`,
          categorie,
          prix,
          prixPromo,
          siteGagnant,
          ecartPrix,
          enPromo,
        })
      }

      return produits
    }

    // Générer les statistiques par site
    const generateSiteStats = (produits: Produit[]) => {
      const stats: SiteStats[] = []

      for (let i = 1; i <= 4; i++) {
        const siteId = i.toString()
        const produitsGagnants = produits.filter((p) => p.siteGagnant === siteId)
        const nbOffresGagnantes = produitsGagnants.length
        const pourcentage = (nbOffresGagnantes / produits.length) * 100

        const ecartMoyen = produitsGagnants.reduce((sum, p) => sum + p.ecartPrix, 0) / (nbOffresGagnantes || 1)
        const produitsEnPromo = produitsGagnants.filter((p) => p.enPromo)
        const tauxPromo = (produitsEnPromo.length / (nbOffresGagnantes || 1)) * 100

        stats.push({
          site: `Site ${siteId}`,
          nbOffresGagnantes,
          pourcentage,
          ecartMoyen,
          tauxPromo,
          color: colors[i - 1],
        })
      }

      return stats
    }

    const allProduits = generateProduits()

    // Appliquer les filtres
    let filteredProduits = [...allProduits]

    if (siteFilter) {
      filteredProduits = filteredProduits.filter((p) => p.siteGagnant === siteFilter)
    }

    if (categorieFilter !== "all") {
      filteredProduits = filteredProduits.filter((p) => p.categorie === categorieFilter)
    }

    setProduits(filteredProduits)
    setSiteStats(generateSiteStats(allProduits))
  }, [dateRange, site, categorieFilter])

  // Extraire les catégories uniques
  const categories = ["all", ...Array.from(new Set(produits.map((p) => p.categorie)))]

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="graphiques">Graphiques</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
          <TabsTrigger value="comparaison">Comparaison détaillée</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="apercu" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {siteStats.map((stat) => (
              <Card key={stat.site}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.site}</CardTitle>
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: stat.color }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.nbOffresGagnantes}</div>
                  <p className="text-xs text-muted-foreground">{stat.pourcentage.toFixed(1)}% des produits</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Statistiques par site</CardTitle>
              <CardDescription>Analyse comparative des offres gagnantes par site</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Offres gagnantes</TableHead>
                    <TableHead>Pourcentage</TableHead>
                    <TableHead>Écart moyen</TableHead>
                    <TableHead>Taux de promotion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteStats.map((stat) => (
                    <TableRow key={stat.site}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
                          <span>{stat.site}</span>
                        </div>
                      </TableCell>
                      <TableCell>{stat.nbOffresGagnantes}</TableCell>
                      <TableCell>{stat.pourcentage.toFixed(1)}%</TableCell>
                      <TableCell>{stat.ecartMoyen.toFixed(1)}%</TableCell>
                      <TableCell>{stat.tauxPromo.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Répartition des offres gagnantes</CardTitle>
              <CardDescription>Nombre de produits où chaque site propose le prix le plus bas</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siteStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="site" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name === "nbOffresGagnantes" ? "Offres gagnantes" : name]}
                  />
                  <Legend content={() => null} /> {/* Hide legend as we have colors in the bars */}
                  <Bar dataKey="nbOffresGagnantes" name="Offres gagnantes" radius={[4, 4, 0, 0]}>
                    {siteStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="nbOffresGagnantes" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Graphiques */}
        <TabsContent value="graphiques" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Écart de prix moyen</CardTitle>
                <CardDescription>Écart moyen en pourcentage par rapport au prix le plus bas du marché</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={siteStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="site" />
                    <YAxis unit="%" />
                    <Tooltip
                      formatter={(value) => [`${Number.parseFloat(value as string).toFixed(1)}%`, "Écart de prix"]}
                    />
                    <Legend />
                    <Bar dataKey="ecartMoyen" name="Écart de prix moyen" unit="%" radius={[4, 4, 0, 0]}>
                      {siteStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact des promotions</CardTitle>
                <CardDescription>Pourcentage des offres gagnantes qui sont en promotion</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={siteStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="site" />
                    <YAxis unit="%" />
                    <Tooltip
                      formatter={(value) => [`${Number.parseFloat(value as string).toFixed(1)}%`, "Taux de promotion"]}
                    />
                    <Legend />
                    <Bar dataKey="tauxPromo" name="Taux de promotion" unit="%" radius={[4, 4, 0, 0]}>
                      {siteStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Produits */}
        <TabsContent value="produits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Liste des produits</h3>
            <Select value={categorieFilter} onValueChange={setCategorieFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories
                  .filter((c) => c !== "all")
                  .map((categorie) => (
                    <SelectItem key={categorie} value={categorie}>
                      {categorie}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Site 1</TableHead>
                    <TableHead>Site 2</TableHead>
                    <TableHead>Site 3</TableHead>
                    <TableHead>Site 4</TableHead>
                    <TableHead>Meilleure offre</TableHead>
                    <TableHead>Écart</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produits.slice(0, 10).map((produit) => (
                    <TableRow key={produit.id}>
                      <TableCell className="font-medium">{produit.id}</TableCell>
                      <TableCell>{produit.nom}</TableCell>
                      <TableCell>{produit.categorie}</TableCell>
                      <TableCell className={produit.siteGagnant === "1" ? "font-bold text-green-600" : ""}>
                        {produit.prixPromo["1"] !== null ? (
                          <div>
                            <span className="line-through text-muted-foreground">{produit.prix["1"].toFixed(2)}€</span>
                            <span className="ml-2">{produit.prixPromo["1"]!.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <span>{produit.prix["1"].toFixed(2)}€</span>
                        )}
                      </TableCell>
                      <TableCell className={produit.siteGagnant === "2" ? "font-bold text-green-600" : ""}>
                        {produit.prixPromo["2"] !== null ? (
                          <div>
                            <span className="line-through text-muted-foreground">{produit.prix["2"].toFixed(2)}€</span>
                            <span className="ml-2">{produit.prixPromo["2"]!.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <span>{produit.prix["2"].toFixed(2)}€</span>
                        )}
                      </TableCell>
                      <TableCell className={produit.siteGagnant === "3" ? "font-bold text-green-600" : ""}>
                        {produit.prixPromo["3"] !== null ? (
                          <div>
                            <span className="line-through text-muted-foreground">{produit.prix["3"].toFixed(2)}€</span>
                            <span className="ml-2">{produit.prixPromo["3"]!.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <span>{produit.prix["3"].toFixed(2)}€</span>
                        )}
                      </TableCell>
                      <TableCell className={produit.siteGagnant === "4" ? "font-bold text-green-600" : ""}>
                        {produit.prixPromo["4"] !== null ? (
                          <div>
                            <span className="line-through text-muted-foreground">{produit.prix["4"].toFixed(2)}€</span>
                            <span className="ml-2">{produit.prixPromo["4"]!.toFixed(2)}€</span>
                          </div>
                        ) : (
                          <span>{produit.prix["4"].toFixed(2)}€</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">Site {produit.siteGagnant}</span>
                          {produit.enPromo && (
                            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                              Promo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{produit.ecartPrix.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Comparaison détaillée */}
        <TabsContent value="comparaison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Économies moyennes par site</CardTitle>
                <CardDescription>Économies réalisées en choisissant les offres gagnantes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Économie moyenne</TableHead>
                      <TableHead>Économie max</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteStats.map((stat) => (
                      <TableRow key={stat.site}>
                        <TableCell>{stat.site}</TableCell>
                        <TableCell>{stat.ecartMoyen.toFixed(1)}%</TableCell>
                        <TableCell>{(stat.ecartMoyen * 1.5).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taux de promotion par site</CardTitle>
                <CardDescription>Pourcentage des offres gagnantes qui sont en promotion</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead>Taux de promotion</TableHead>
                      <TableHead>Nb produits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {siteStats.map((stat) => (
                      <TableRow key={stat.site}>
                        <TableCell>{stat.site}</TableCell>
                        <TableCell>{stat.tauxPromo.toFixed(1)}%</TableCell>
                        <TableCell>{Math.round((stat.nbOffresGagnantes * stat.tauxPromo) / 100)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse des promotions</CardTitle>
              <CardDescription>Impact des promotions sur les offres gagnantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Observations clés</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      {siteStats.sort((a, b) => b.tauxPromo - a.tauxPromo)[0]?.site} a le taux de promotion le plus
                      élevé ({siteStats.sort((a, b) => b.tauxPromo - a.tauxPromo)[0]?.tauxPromo.toFixed(1)}%)
                    </li>
                    <li>
                      {siteStats.sort((a, b) => b.nbOffresGagnantes - a.nbOffresGagnantes)[0]?.site} a le plus grand
                      nombre d'offres gagnantes (
                      {siteStats.sort((a, b) => b.nbOffresGagnantes - a.nbOffresGagnantes)[0]?.nbOffresGagnantes})
                    </li>
                    <li>
                      {siteStats.sort((a, b) => b.ecartMoyen - a.ecartMoyen)[0]?.site} offre les économies moyennes les
                      plus importantes (
                      {siteStats.sort((a, b) => b.ecartMoyen - a.ecartMoyen)[0]?.ecartMoyen.toFixed(1)}%)
                    </li>
                    <li>
                      {Math.round((produits.filter((p) => p.enPromo).length / produits.length) * 100)}% des offres
                      gagnantes sont des produits en promotion
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommandations</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Surveiller particulièrement les promotions sur{" "}
                      {siteStats.sort((a, b) => b.tauxPromo - a.tauxPromo)[0]?.site} qui propose régulièrement des
                      réductions
                    </li>
                    <li>
                      Pour les achats réguliers, privilégier{" "}
                      {siteStats.sort((a, b) => b.nbOffresGagnantes - a.nbOffresGagnantes)[0]?.site} qui propose
                      globalement les meilleurs prix
                    </li>
                    <li>
                      Pour les achats importants, comparer systématiquement les prix entre les sites pour maximiser les
                      économies
                    </li>
                    <li>Planifier les achats pendant les périodes promotionnelles pour optimiser les économies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
