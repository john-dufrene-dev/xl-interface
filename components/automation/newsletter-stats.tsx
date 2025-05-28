"use client"

import { useState } from "react"
import type { Newsletter } from "./newsletter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { DateRangePicker } from "@/components/date-range-picker"
import { PeriodSelector } from "@/components/period-selector"
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger } from "@/components/ui/tabs"
import type { DateRange } from "react-day-picker"

interface NewsletterStatsProps {
  newsletters: Newsletter[]
}

export default function NewsletterStats({ newsletters }: NewsletterStatsProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [datePickerMode, setDatePickerMode] = useState<"period" | "custom">("period")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("last-30-days")
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
    const dataPoints = selectedPeriod === "7j" ? 7 : selectedPeriod === "30j" ? 30 : selectedPeriod === "90j" ? 12 : 12
    const labels = []
    const sentData = []
    const openedData = []
    const clickedData = []

    for (let i = 0; i < dataPoints; i++) {
      if (selectedPeriod === "7j") {
        labels.push(`Jour ${i + 1}`)
      } else if (selectedPeriod === "30j") {
        labels.push(`Jour ${i + 1}`)
      } else if (selectedPeriod === "90j") {
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

  // Données pour le BarChart d'engagement
  const engagementData = chartData.labels.map((label, i) => ({
    label,
    Envoyés: chartData.sentData[i],
    Ouverts: chartData.openedData[i],
    Cliqués: chartData.clickedData[i],
  }))

  // Données pour le PieChart des templates
  const templateStats = newsletters.reduce((acc, n) => {
    acc[n.template] = (acc[n.template] || 0) + n.stats.opened
    return acc
  }, {} as Record<string, number>)
  const templatePieData = Object.entries(templateStats).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))
  const templateColors = ["#3b82f6", "#f59e42", "#10b981"]

  // Données pour le BarChart audience (catégories)
  const categoryStats = [
    { name: "Vêtements", value: 42 },
    { name: "Électronique", value: 28 },
    { name: "Maison & Déco", value: 18 },
    { name: "Autres", value: 12 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Statistiques des newsletters</h3>
          <p className="text-sm text-muted-foreground">Analysez les performances de vos campagnes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <UITabs value={datePickerMode} onValueChange={(v) => setDatePickerMode(v as "period" | "custom") }>
            <UITabsList className="h-9">
              <UITabsTrigger value="period" className="text-xs px-2 py-1.5">Périodes prédéfinies</UITabsTrigger>
              <UITabsTrigger value="custom" className="text-xs px-2 py-1.5">Période personnalisée</UITabsTrigger>
            </UITabsList>
          </UITabs>
          {datePickerMode === "period" ? (
            <PeriodSelector
              value={selectedPeriod}
              onChange={(range) => {
                setDateRange(range)
                setSelectedPeriod(selectedPeriod)
              }}
            />
          ) : (
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          )}
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
            </TabsList>

            <TabsContent value="engagement">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
                  <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Envoyés" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ouverts" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Cliqués" fill="#f59e42" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={templatePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {templatePieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={templateColors[idx % templateColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                {templatePieData.map((d, i) => (
                  <div key={d.name}>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-lg font-bold" style={{ color: templateColors[i % templateColors.length] }}>{d.value}</div>
                    <div className="text-xs text-muted-foreground">Ouverts</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audience">
              <div className="p-8 text-center text-muted-foreground text-lg">
                L'audience de vos newsletters correspond à l'ensemble des utilisateurs inscrits à la newsletter.
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
