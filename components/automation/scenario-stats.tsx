"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterBar } from "@/components/filter-bar"
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
} from "recharts"

// Données d'exemple pour les statistiques
const statsDataInitial = {
  global: {
    totalScenarios: 5,
    scenariosActifs: 3,
    totalPaniers: 450,
    paniersRelances: 320,
    paniersConvertis: 78,
    tauxConversion: 24.4,
    revenuGenere: 12450,
  },
  evolution: {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    paniersRelances: [45, 52, 68, 74, 62, 58],
    paniersConvertis: [12, 15, 18, 22, 16, 14],
    tauxConversion: [26.7, 28.8, 26.5, 29.7, 25.8, 24.1],
  },
  parScenario: [
    {
      nom: "Relance standard",
      paniersRelances: 180,
      paniersConvertis: 42,
      tauxConversion: 23.3,
      revenuGenere: 6840,
    },
    {
      nom: "Relance premium",
      paniersRelances: 95,
      paniersConvertis: 28,
      tauxConversion: 29.5,
      revenuGenere: 4200,
    },
    {
      nom: "Relance flash",
      paniersRelances: 45,
      paniersConvertis: 8,
      tauxConversion: 17.8,
      revenuGenere: 1410,
    },
  ],
}

// Données filtrées par site
const statsBySite = {
  "1": {
    global: {
      totalScenarios: 3,
      scenariosActifs: 2,
      totalPaniers: 280,
      paniersRelances: 210,
      paniersConvertis: 52,
      tauxConversion: 24.8,
      revenuGenere: 8250,
    },
    evolution: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
      paniersRelances: [30, 35, 45, 50, 40, 38],
      paniersConvertis: [8, 10, 12, 15, 11, 9],
      tauxConversion: [26.7, 28.6, 26.7, 30.0, 27.5, 23.7],
    },
  },
  "2": {
    global: {
      totalScenarios: 2,
      scenariosActifs: 1,
      totalPaniers: 170,
      paniersRelances: 110,
      paniersConvertis: 26,
      tauxConversion: 23.6,
      revenuGenere: 4200,
    },
    evolution: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
      paniersRelances: [15, 17, 23, 24, 22, 20],
      paniersConvertis: [4, 5, 6, 7, 5, 5],
      tauxConversion: [26.7, 29.4, 26.1, 29.2, 22.7, 25.0],
    },
  },
}

export function ScenarioStats() {
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined)
  const [statsData, setStatsData] = useState(statsDataInitial)

  // Simuler le filtrage des données en fonction du site sélectionné
  useEffect(() => {
    if (selectedSite && statsBySite[selectedSite]) {
      setStatsData({
        ...statsData,
        global: statsBySite[selectedSite].global,
        evolution: {
          labels: statsBySite[selectedSite].evolution.labels,
          paniersRelances: statsBySite[selectedSite].evolution.paniersRelances,
          paniersConvertis: statsBySite[selectedSite].evolution.paniersConvertis,
          tauxConversion: statsBySite[selectedSite].evolution.tauxConversion,
        },
      })
    } else {
      setStatsData(statsDataInitial)
    }
  }, [selectedSite])

  const handleResetFilters = () => {
    setSelectedSite("")
    setDateRange(undefined)
    setStatsData(statsDataInitial)
  }

  return (
    <div className="space-y-4">
      <FilterBar
        onDateChange={setDateRange}
        onSiteChange={setSelectedSite}
        onReset={handleResetFilters}
        dateValue={dateRange}
        siteValue={selectedSite}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Taux de conversion</CardTitle>
            <CardDescription>Paniers relancés convertis en commandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.global.tauxConversion}%</div>
            <p className="text-xs text-muted-foreground">
              {statsData.global.paniersConvertis} paniers convertis sur {statsData.global.paniersRelances} relancés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenu généré</CardTitle>
            <CardDescription>CA généré par les relances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.global.revenuGenere.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              Moyenne de {(statsData.global.revenuGenere / statsData.global.paniersConvertis).toFixed(2)}€ par
              conversion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Scénarios actifs</CardTitle>
            <CardDescription>Nombre de scénarios en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.global.scenariosActifs}</div>
            <p className="text-xs text-muted-foreground">Sur un total de {statsData.global.totalScenarios} scénarios</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="scenarios">Par scénario</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des performances</CardTitle>
              <CardDescription>Suivi des paniers relancés et convertis sur la période</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={statsData.evolution.labels.map((month, index) => ({
                      name: month,
                      paniersRelances: statsData.evolution.paniersRelances[index],
                      paniersConvertis: statsData.evolution.paniersConvertis[index],
                      tauxConversion: statsData.evolution.tauxConversion[index],
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="paniersRelances"
                      name="Paniers relancés"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="paniersConvertis"
                      name="Paniers convertis"
                      stroke="#82ca9d"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="tauxConversion"
                      name="Taux de conversion (%)"
                      stroke="#ff7300"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardHeader>
              <CardTitle>Performance par scénario</CardTitle>
              <CardDescription>Comparaison des performances de chaque scénario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.parScenario} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="paniersRelances" name="Paniers relancés" fill="#8884d8" />
                    <Bar dataKey="paniersConvertis" name="Paniers convertis" fill="#82ca9d" />
                    <Bar dataKey="tauxConversion" name="Taux de conversion (%)" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
