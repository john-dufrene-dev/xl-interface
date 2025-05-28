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
    totalClients: 1250,
    emailsEnvoyes: 980,
    offresUtilisees: 245,
    tauxConversion: 25.0,
    caGenere: 18750,
  },
  evolution: {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
    emailsEnvoyes: [120, 145, 165, 180, 190, 180],
    offresUtilisees: [30, 38, 42, 48, 52, 45],
    tauxConversion: [25.0, 26.2, 25.5, 26.7, 27.4, 25.0],
    caGenere: [2250, 2850, 3150, 3600, 3900, 3375],
  },
  parSegment: [
    {
      nom: "Clients premium",
      emailsEnvoyes: 320,
      offresUtilisees: 96,
      tauxConversion: 30.0,
      caGenere: 9600,
    },
    {
      nom: "Clients standard",
      emailsEnvoyes: 660,
      offresUtilisees: 149,
      tauxConversion: 22.6,
      caGenere: 9150,
    },
  ],
}

// Données filtrées par site
const statsBySite = {
  "1": {
    global: {
      totalScenarios: 3,
      scenariosActifs: 2,
      totalClients: 750,
      emailsEnvoyes: 580,
      offresUtilisees: 145,
      tauxConversion: 25.0,
      caGenere: 11250,
    },
    evolution: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
      emailsEnvoyes: [70, 85, 95, 110, 120, 100],
      offresUtilisees: [18, 22, 24, 30, 32, 25],
      tauxConversion: [25.7, 25.9, 25.3, 27.3, 26.7, 25.0],
      caGenere: [1350, 1650, 1800, 2250, 2400, 1875],
    },
  },
  "2": {
    global: {
      totalScenarios: 2,
      scenariosActifs: 1,
      totalClients: 500,
      emailsEnvoyes: 400,
      offresUtilisees: 100,
      tauxConversion: 25.0,
      caGenere: 7500,
    },
    evolution: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun"],
      emailsEnvoyes: [50, 60, 70, 70, 70, 80],
      offresUtilisees: [12, 16, 18, 18, 20, 20],
      tauxConversion: [24.0, 26.7, 25.7, 25.7, 28.6, 25.0],
      caGenere: [900, 1200, 1350, 1350, 1500, 1500],
    },
  },
}

export function AnniversaireStats() {
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
          emailsEnvoyes: statsBySite[selectedSite].evolution.emailsEnvoyes,
          offresUtilisees: statsBySite[selectedSite].evolution.offresUtilisees,
          tauxConversion: statsBySite[selectedSite].evolution.tauxConversion,
          caGenere: statsBySite[selectedSite].evolution.caGenere,
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
            <CardDescription>Offres utilisées / Emails envoyés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.global.tauxConversion}%</div>
            <p className="text-xs text-muted-foreground">
              {statsData.global.offresUtilisees} offres utilisées sur {statsData.global.emailsEnvoyes} emails envoyés
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">CA généré</CardTitle>
            <CardDescription>Chiffre d'affaires généré par les offres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.global.caGenere.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              Moyenne de {(statsData.global.caGenere / statsData.global.offresUtilisees).toFixed(2)}€ par offre utilisée
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
          <TabsTrigger value="segments">Par segment</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des performances</CardTitle>
              <CardDescription>Suivi des emails envoyés et des offres utilisées sur la période</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={statsData.evolution.labels.map((month, index) => ({
                      name: month,
                      emailsEnvoyes: statsData.evolution.emailsEnvoyes[index],
                      offresUtilisees: statsData.evolution.offresUtilisees[index],
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
                      dataKey="emailsEnvoyes"
                      name="Emails envoyés"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="offresUtilisees"
                      name="Offres utilisées"
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

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Performance par segment client</CardTitle>
              <CardDescription>Comparaison des performances par segment de clientèle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.parSegment} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="emailsEnvoyes" name="Emails envoyés" fill="#8884d8" />
                    <Bar dataKey="offresUtilisees" name="Offres utilisées" fill="#82ca9d" />
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
