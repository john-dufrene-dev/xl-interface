"use client"

import { useState } from "react"
import type { Newsletter } from "./newsletter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"

interface NewsletterStatsProps {
  newsletters: Newsletter[]
}

export default function NewsletterStats({ newsletters }: NewsletterStatsProps) {
  const [period, setPeriod] = useState<"7j" | "30j" | "90j" | "1an">("30j")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  // Calculer les statistiques globales
  const totalSent = newsletters.reduce((acc, n) => acc + n.stats.sent, 0)
  const totalOpened = newsletters.reduce((acc, n) => acc + n.stats.opened, 0)
  const totalClicked = newsletters.reduce((acc, n) => acc + n.stats.clicked, 0)
  const totalUnsubscribed = newsletters.reduce((acc, n) => acc + n.stats.unsubscribed, 0)

  const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0
  const unsubscribeRate = totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0

  // Générer des données pour les graphiques
  const getChartData = () => {
    // Simuler des données pour différentes périodes
    const dataPoints = period === "7j" ? 7 : period === "30j" ? 30 : period === "90j" ? 12 : 12
    const labels = []
    const sentData = []
    const openedData = []
    const clickedData = []

    for (let i = 0; i < dataPoints; i++) {
      if (period === "7j") {
        labels.push(`Jour ${i + 1}`)
      } else if (period === "30j") {
        labels.push(`Jour ${i + 1}`)
      } else if (period === "90j") {
        labels.push(`Semaine ${i + 1}`)
      } else {
        labels.push(`Mois ${i + 1}`)
      }

      // Générer des données aléatoires mais cohérentes
      const sent = Math.floor(Math.random() * 500) + 100
      const opened = Math.floor(sent * (Math.random() * 0.4 + 0.3))
      const clicked = Math.floor(opened * (Math.random() * 0.3 + 0.1))

      sentData.push(sent)
      openedData.push(opened)
      clickedData.push(clicked)
    }

    return { labels, sentData, openedData, clickedData }
  }

  const chartData = getChartData()

  // Fonction pour rendre le graphique en fonction du type sélectionné
  const renderChart = () => {
    const chartHeight = 300
    const chartWidth = "100%"

    // Simuler différents types de graphiques avec des images
    let chartQuery = ""
    if (chartType === "bar") {
      chartQuery = "bar chart email statistics"
    } else if (chartType === "line") {
      chartQuery = "line chart email statistics"
    } else {
      chartQuery = "pie chart email statistics"
    }

    return (
      <div className="relative">
        <img
          src={`/placeholder.svg?height=${chartHeight}&width=800&query=${chartQuery}`}
          alt={`${chartType} chart`}
          className="w-full h-[300px] object-cover rounded-md border"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-muted-foreground bg-white/80 px-3 py-1 rounded-full">
            Graphique {chartType === "bar" ? "à barres" : chartType === "line" ? "linéaire" : "circulaire"} des
            statistiques
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Statistiques des newsletters</h3>
          <p className="text-sm text-muted-foreground">Analysez les performances de vos campagnes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={(value: "7j" | "30j" | "90j" | "1an") => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7j">7 derniers jours</SelectItem>
              <SelectItem value="30j">30 derniers jours</SelectItem>
              <SelectItem value="90j">3 derniers mois</SelectItem>
              <SelectItem value="1an">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <button className={`p-2 ${chartType === "bar" ? "bg-muted" : ""}`} onClick={() => setChartType("bar")}>
              <BarChart className="h-4 w-4" />
            </button>
            <button className={`p-2 ${chartType === "line" ? "bg-muted" : ""}`} onClick={() => setChartType("line")}>
              <LineChart className="h-4 w-4" />
            </button>
            <button className={`p-2 ${chartType === "pie" ? "bg-muted" : ""}`} onClick={() => setChartType("pie")}>
              <PieChart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emails envoyés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent}</div>
            <p className="text-xs text-muted-foreground">Sur la période sélectionnée</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux d'ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{totalOpened} emails ouverts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de clic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{totalClicked} clics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Désabonnements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unsubscribeRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">{totalUnsubscribed} désabonnements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution des performances</CardTitle>
          <CardDescription>Visualisez l'évolution de vos campagnes sur la période</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engagement">
            <TabsList className="mb-4">
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="templates">Par template</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
            </TabsList>

            <TabsContent value="engagement">
              {renderChart()}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium">Envoyés</div>
                  <div className="text-2xl font-bold text-blue-500">
                    {chartData.sentData.reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Ouverts</div>
                  <div className="text-2xl font-bold text-green-500">
                    {chartData.openedData.reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Cliqués</div>
                  <div className="text-2xl font-bold text-amber-500">
                    {chartData.clickedData.reduce((a, b) => a + b, 0)}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates">
              <div className="flex justify-center items-center h-[300px]">
                <img
                  src="/placeholder.svg?height=300&width=800&query=pie chart email templates performance"
                  alt="Performance par template"
                  className="max-h-full rounded-md border"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium">Simple</div>
                  <div className="text-lg font-bold">32.5%</div>
                  <div className="text-xs text-muted-foreground">Taux d'ouverture</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Promotionnel</div>
                  <div className="text-lg font-bold">45.8%</div>
                  <div className="text-xs text-muted-foreground">Taux d'ouverture</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Informatif</div>
                  <div className="text-lg font-bold">38.2%</div>
                  <div className="text-xs text-muted-foreground">Taux d'ouverture</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audience">
              <div className="flex justify-center items-center h-[300px]">
                <img
                  src="/placeholder.svg?height=300&width=800&query=bar chart email audience demographics"
                  alt="Démographie de l'audience"
                  className="max-h-full rounded-md border"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Répartition par catégorie</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span>Vêtements</span>
                        <span className="font-medium">42%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Électronique</span>
                        <span className="font-medium">28%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Maison & Déco</span>
                        <span className="font-medium">18%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Autres</span>
                        <span className="font-medium">12%</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Répartition par intérêt</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span>Mode</span>
                        <span className="font-medium">35%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Technologie</span>
                        <span className="font-medium">25%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Cuisine</span>
                        <span className="font-medium">20%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Autres</span>
                        <span className="font-medium">20%</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meilleures performances</CardTitle>
          <CardDescription>Les newsletters avec les meilleurs taux d'engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Nom
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Date d'envoi
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Envoyés
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Taux d'ouverture
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Taux de clic
                  </th>
                </tr>
              </thead>
              <tbody>
                {newsletters
                  .filter((n) => n.lastSent)
                  .sort((a, b) => b.stats.opened / b.stats.sent - a.stats.opened / a.stats.sent)
                  .slice(0, 5)
                  .map((newsletter) => (
                    <tr key={newsletter.id} className="border-b">
                      <td className="px-4 py-3 font-medium">{newsletter.name}</td>
                      <td className="px-4 py-3">
                        {newsletter.lastSent ? new Date(newsletter.lastSent).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">{newsletter.stats.sent}</td>
                      <td className="px-4 py-3">
                        {((newsletter.stats.opened / newsletter.stats.sent) * 100).toFixed(1)}%
                      </td>
                      <td className="px-4 py-3">
                        {((newsletter.stats.clicked / newsletter.stats.opened) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
