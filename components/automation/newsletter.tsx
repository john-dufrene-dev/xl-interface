"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import NewsletterForm from "./newsletter-form"
import NewsletterStats from "./newsletter-stats"

// Types
export type NewsletterTemplate = "simple" | "promotionnel" | "informatif"

export interface Newsletter {
  id: string
  name: string
  siteId: string
  status: "actif" | "inactif" | "brouillon"
  subject: string
  preheader: string
  content: string
  template: NewsletterTemplate
  criteria: {
    categories: string[]
    interests: string[]
    lastPurchase: number | null
  }
  createdAt: string
  lastSent: string | null
  nextSend: string | null
  stats: {
    sent: number
    opened: number
    clicked: number
    unsubscribed: number
  }
}

// Données d'exemple
const exampleNewsletters: Newsletter[] = [
  {
    id: "1",
    name: "Newsletter mensuelle",
    siteId: "site1",
    status: "actif",
    subject: "Découvrez nos nouveautés du mois",
    preheader: "Les dernières tendances et promotions exclusives",
    content: "<p>Contenu de la newsletter mensuelle</p>",
    template: "simple",
    criteria: {
      categories: ["vêtements", "accessoires"],
      interests: ["mode", "tendances"],
      lastPurchase: 90,
    },
    createdAt: "2023-01-15T10:00:00Z",
    lastSent: "2023-04-01T09:00:00Z",
    nextSend: "2023-05-01T09:00:00Z",
    stats: {
      sent: 1250,
      opened: 680,
      clicked: 320,
      unsubscribed: 5,
    },
  },
  {
    id: "2",
    name: "Promotions spéciales",
    siteId: "site1",
    status: "actif",
    subject: "Offres exclusives pour nos clients fidèles",
    preheader: "Jusqu'à 50% de réduction sur une sélection d'articles",
    content: "<p>Contenu de la newsletter promotionnelle</p>",
    template: "promotionnel",
    criteria: {
      categories: ["électronique", "informatique"],
      interests: ["technologie", "gaming"],
      lastPurchase: 30,
    },
    createdAt: "2023-02-20T14:30:00Z",
    lastSent: "2023-04-15T10:00:00Z",
    nextSend: "2023-05-15T10:00:00Z",
    stats: {
      sent: 980,
      opened: 540,
      clicked: 290,
      unsubscribed: 3,
    },
  },
  {
    id: "3",
    name: "Actualités du secteur",
    siteId: "site2",
    status: "brouillon",
    subject: "Les dernières tendances du marché",
    preheader: "Restez informé des évolutions de votre secteur",
    content: "<p>Contenu de la newsletter informative</p>",
    template: "informatif",
    criteria: {
      categories: ["business", "finance"],
      interests: ["économie", "investissement"],
      lastPurchase: null,
    },
    createdAt: "2023-03-10T09:15:00Z",
    lastSent: null,
    nextSend: null,
    stats: {
      sent: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
    },
  },
]

export default function NewsletterComponent() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(exampleNewsletters)
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleCreateNewsletter = () => {
    setSelectedNewsletter(null)
    setIsEditing(true)
  }

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter)
    setIsEditing(true)
  }

  const handleSaveNewsletter = (newsletter: Newsletter) => {
    if (selectedNewsletter) {
      // Mise à jour d'une newsletter existante
      setNewsletters(newsletters.map((s) => (s.id === newsletter.id ? newsletter : s)))
    } else {
      // Création d'une nouvelle newsletter
      const newNewsletter = {
        ...newsletter,
        id: `${newsletters.length + 1}`,
        createdAt: new Date().toISOString(),
        lastSent: null,
        nextSend: null,
        stats: {
          sent: 0,
          opened: 0,
          clicked: 0,
          unsubscribed: 0,
        },
      }
      setNewsletters([...newsletters, newNewsletter])
    }
    setIsEditing(false)
    setSelectedNewsletter(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setSelectedNewsletter(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Newsletters</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos campagnes de newsletters pour communiquer avec vos clients.
          </p>
        </div>
        <Button onClick={handleCreateNewsletter}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Newsletter
        </Button>
      </div>

      {isEditing ? (
        <NewsletterForm newsletter={selectedNewsletter} onSave={handleSaveNewsletter} onCancel={handleCancelEdit} />
      ) : (
        <Tabs defaultValue="actives" className="space-y-4">
          <TabsList>
            <TabsTrigger value="actives">Newsletters actives</TabsTrigger>
            <TabsTrigger value="brouillons">Brouillons</TabsTrigger>
            <TabsTrigger value="inactives">Inactives</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="actives" className="space-y-4">
            {newsletters
              .filter((n) => n.status === "actif")
              .map((newsletter) => (
                <Card
                  key={newsletter.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEditNewsletter(newsletter)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{newsletter.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Actif</div>
                    </div>
                    <CardDescription>Sujet: {newsletter.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Dernier envoi</p>
                        <p className="text-sm text-muted-foreground">
                          {newsletter.lastSent ? new Date(newsletter.lastSent).toLocaleDateString() : "Jamais envoyé"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Prochain envoi</p>
                        <p className="text-sm text-muted-foreground">
                          {newsletter.nextSend ? new Date(newsletter.nextSend).toLocaleDateString() : "Non planifié"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Audience</p>
                        <p className="text-sm text-muted-foreground">{newsletter.stats.sent} destinataires</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {newsletters.filter((n) => n.status === "actif").length === 0 && (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Aucune newsletter active</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="brouillons" className="space-y-4">
            {newsletters
              .filter((n) => n.status === "brouillon")
              .map((newsletter) => (
                <Card
                  key={newsletter.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEditNewsletter(newsletter)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{newsletter.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Brouillon</div>
                    </div>
                    <CardDescription>Sujet: {newsletter.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Créé le</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(newsletter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Template</p>
                        <p className="text-sm text-muted-foreground">
                          {newsletter.template === "simple"
                            ? "Simple"
                            : newsletter.template === "promotionnel"
                              ? "Promotionnel"
                              : "Informatif"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {newsletters.filter((n) => n.status === "brouillon").length === 0 && (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Aucun brouillon</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inactives" className="space-y-4">
            {newsletters
              .filter((n) => n.status === "inactif")
              .map((newsletter) => (
                <Card
                  key={newsletter.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleEditNewsletter(newsletter)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{newsletter.name}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Inactif</div>
                    </div>
                    <CardDescription>Sujet: {newsletter.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Dernier envoi</p>
                        <p className="text-sm text-muted-foreground">
                          {newsletter.lastSent ? new Date(newsletter.lastSent).toLocaleDateString() : "Jamais envoyé"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Statistiques</p>
                        <p className="text-sm text-muted-foreground">
                          {newsletter.stats.opened} ouvertures / {newsletter.stats.clicked} clics
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {newsletters.filter((n) => n.status === "inactif").length === 0 && (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">Aucune newsletter inactive</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="statistiques">
            <NewsletterStats newsletters={newsletters} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
