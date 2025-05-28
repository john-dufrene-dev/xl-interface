"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Globe, Key, FileDown, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

// Ajouter les imports nécessaires pour le Switch
import { Switch } from "@/components/ui/switch"

// Types
type SiteDetail = {
  id: string
  name: string
  url: string
  api_key: string
  status: "active" | "inactive" | "maintenance"
  created_at: string
  updated_at: string
  description?: string
  contact_email?: string
  contact_phone?: string
  technical_contact?: string
  analytics_id?: string
  theme?: string
  logo_url?: string
  // Champs pour la configuration des mails
  mail_color_primary?: string
  mail_color_secondary?: string
  mail_logo_url?: string
  mail_unsubscribe_link?: string
  mail_terms_link?: string
  mail_contact_form_link?: string
  mail_legal_notice_link?: string
  mail_shipping_email?: string
  // Nouveaux champs pour la configuration des marketplaces
  marketplace_amazon?: boolean
  marketplace_cdiscount?: boolean
  marketplace_docmorris?: boolean
  marketplace_tiktok?: boolean
  marketplace_shein?: boolean
  marketplace_lcdp?: boolean
  marketplace_autres?: boolean
}

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [site, setSite] = useState<SiteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<SiteDetail>>({})

  // Modifier les données de démonstration pour le détail du site
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      const siteData: SiteDetail = {
        id: params.id,
        name: `Site ${params.id}`,
        url: "https://www.monsite-ecommerce.fr",
        api_key: "api_key_123456",
        status: "active",
        created_at: "2023-01-15T10:30:00",
        updated_at: "2023-05-01T09:15:00",
        description: "Site principal de vente en ligne de produits électroniques et accessoires.",
        contact_email: "contact@monsite-ecommerce.fr",
        contact_phone: "01 23 45 67 89",
        technical_contact: "tech@monsite-ecommerce.fr",
        analytics_id: "UA-12345678-1",
        theme: "Modern Blue",
        logo_url: "/placeholder.svg",
        // Données de démonstration pour la configuration des mails
        mail_color_primary: "#3b82f6",
        mail_color_secondary: "#f3f4f6",
        mail_logo_url: "/abstract-logo.png",
        mail_unsubscribe_link: "https://www.monsite-ecommerce.fr/desinscription",
        mail_terms_link: "https://www.monsite-ecommerce.fr/cgv",
        mail_contact_form_link: "https://www.monsite-ecommerce.fr/contact",
        mail_legal_notice_link: "https://www.monsite-ecommerce.fr/mentions-legales",
        mail_shipping_email: "expedition@monsite-ecommerce.fr",
        // Données de démonstration pour la configuration des marketplaces
        marketplace_amazon: true,
        marketplace_cdiscount: true,
        marketplace_docmorris: false,
        marketplace_tiktok: params.id === "1" ? true : false,
        marketplace_shein: params.id === "2" ? true : false,
        marketplace_lcdp: params.id === "3" ? true : false,
        marketplace_autres: true,
      }

      setSite(siteData)
      setFormData(siteData)
      setLoading(false)
    }, 500)
  }, [params.id])

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Fonction pour obtenir le libellé du statut
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "maintenance":
        return "Maintenance"
      default:
        return status
    }
  }

  // Mettre à jour la fonction handleChange pour gérer les valeurs booléennes
  const handleChange = (field: keyof SiteDetail, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSave = () => {
    // Dans un cas réel, vous feriez un appel API ici
    if (site && formData) {
      const updatedSite = {
        ...site,
        ...formData,
        updated_at: new Date().toISOString(),
      }

      setSite(updatedSite)
      setIsEditing(false)
      toast({
        title: "Modifications enregistrées",
        description: "Les informations du site ont été mises à jour avec succès.",
      })
    }
  }

  const handleCancel = () => {
    setFormData(site || {})
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Globe className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Chargement des informations du site...</h3>
        </div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Site non trouvé</h3>
          <Button variant="link" onClick={() => router.push("/sites")} className="mt-2">
            Retour à la liste des sites
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/sites")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
            <p className="text-muted-foreground">
              Site créé le {format(new Date(site.created_at), "dd MMMM yyyy", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="mail-config">Configuration des mails</TabsTrigger>
          <TabsTrigger value="marketplace-config">Configuration des marketplaces</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>Détails et paramètres du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du site</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  ) : (
                    <div className="font-medium">{site.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL du site</Label>
                  {isEditing ? (
                    <Input id="url" value={formData.url || ""} onChange={(e) => handleChange("url", e.target.value)} />
                  ) : (
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {site.url}
                    </a>
                  )}
                </div>

                {/* Le bloc de description a été supprimé */}

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  {isEditing ? (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value as "active" | "inactive" | "maintenance")}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getStatusColor(site.status)}>{getStatusLabel(site.status)}</Badge>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Créé le</span>
                    <span>{format(new Date(site.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Dernière mise à jour</span>
                    <span>{format(new Date(site.updated_at), "dd/MM/yyyy HH:mm", { locale: fr })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacts et API</CardTitle>
                <CardDescription>Informations de contact et clé API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email de contact</Label>
                  {isEditing ? (
                    <Input
                      id="contact_email"
                      value={formData.contact_email || ""}
                      onChange={(e) => handleChange("contact_email", e.target.value)}
                    />
                  ) : (
                    <div>{site.contact_email || "Non défini"}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone de contact</Label>
                  {isEditing ? (
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone || ""}
                      onChange={(e) => handleChange("contact_phone", e.target.value)}
                    />
                  ) : (
                    <div>{site.contact_phone || "Non défini"}</div>
                  )}
                </div>

                {/* Le bloc de contact technique a été supprimé */}

                <Separator className="my-2" />

                <div className="space-y-2">
                  <Label htmlFor="api_key">Clé API</Label>
                  {isEditing ? (
                    <Input
                      id="api_key"
                      value={formData.api_key || ""}
                      onChange={(e) => handleChange("api_key", e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center">
                      <Key className="mr-2 h-4 w-4 text-muted-foreground" />
                      <code className="bg-muted px-2 py-1 rounded">{site.api_key}</code>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {!isEditing && (
                  <Button variant="outline" className="w-full">
                    <FileDown className="mr-2 h-4 w-4" />
                    Exporter CSV
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mail-config" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Apparence des mails</CardTitle>
                <CardDescription>Personnalisez l'apparence de vos emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mail_color_primary">Couleur principale</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        id="mail_color_primary"
                        type="color"
                        value={formData.mail_color_primary || "#3b82f6"}
                        onChange={(e) => handleChange("mail_color_primary", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={formData.mail_color_primary || "#3b82f6"}
                        onChange={(e) => handleChange("mail_color_primary", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: site.mail_color_primary || "#3b82f6" }}
                      />
                      <span>{site.mail_color_primary || "#3b82f6"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_color_secondary">Couleur secondaire</Label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        id="mail_color_secondary"
                        type="color"
                        value={formData.mail_color_secondary || "#f3f4f6"}
                        onChange={(e) => handleChange("mail_color_secondary", e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={formData.mail_color_secondary || "#f3f4f6"}
                        onChange={(e) => handleChange("mail_color_secondary", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: site.mail_color_secondary || "#f3f4f6" }}
                      />
                      <span>{site.mail_color_secondary || "#f3f4f6"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_logo_url">Logo</Label>
                  {isEditing ? (
                    <Input
                      id="mail_logo_url"
                      value={formData.mail_logo_url || ""}
                      onChange={(e) => handleChange("mail_logo_url", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  ) : (
                    <div>
                      {site.mail_logo_url ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={site.mail_logo_url || "/placeholder.svg"}
                            alt="Logo"
                            className="h-10 max-w-[200px] object-contain"
                          />
                          <span className="text-sm text-muted-foreground">{site.mail_logo_url}</span>
                        </div>
                      ) : (
                        "Non défini"
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liens et informations légales</CardTitle>
                <CardDescription>Configurez les liens légaux pour vos emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mail_unsubscribe_link">Lien de désinscription</Label>
                  {isEditing ? (
                    <Input
                      id="mail_unsubscribe_link"
                      value={formData.mail_unsubscribe_link || ""}
                      onChange={(e) => handleChange("mail_unsubscribe_link", e.target.value)}
                      placeholder="https://example.com/unsubscribe"
                    />
                  ) : (
                    <div>
                      {site.mail_unsubscribe_link ? (
                        <a
                          href={site.mail_unsubscribe_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {site.mail_unsubscribe_link}
                        </a>
                      ) : (
                        "Non défini"
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_terms_link">Lien des CGV</Label>
                  {isEditing ? (
                    <Input
                      id="mail_terms_link"
                      value={formData.mail_terms_link || ""}
                      onChange={(e) => handleChange("mail_terms_link", e.target.value)}
                      placeholder="https://example.com/cgv"
                    />
                  ) : (
                    <div>
                      {site.mail_terms_link ? (
                        <a
                          href={site.mail_terms_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {site.mail_terms_link}
                        </a>
                      ) : (
                        "Non défini"
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_contact_form_link">Lien du formulaire de contact</Label>
                  {isEditing ? (
                    <Input
                      id="mail_contact_form_link"
                      value={formData.mail_contact_form_link || ""}
                      onChange={(e) => handleChange("mail_contact_form_link", e.target.value)}
                      placeholder="https://example.com/contact"
                    />
                  ) : (
                    <div>
                      {site.mail_contact_form_link ? (
                        <a
                          href={site.mail_contact_form_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {site.mail_contact_form_link}
                        </a>
                      ) : (
                        "Non défini"
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_legal_notice_link">Lien des mentions légales</Label>
                  {isEditing ? (
                    <Input
                      id="mail_legal_notice_link"
                      value={formData.mail_legal_notice_link || ""}
                      onChange={(e) => handleChange("mail_legal_notice_link", e.target.value)}
                      placeholder="https://example.com/mentions-legales"
                    />
                  ) : (
                    <div>
                      {site.mail_legal_notice_link ? (
                        <a
                          href={site.mail_legal_notice_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {site.mail_legal_notice_link}
                        </a>
                      ) : (
                        "Non défini"
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mail_shipping_email">Email d'expédition</Label>
                  {isEditing ? (
                    <Input
                      id="mail_shipping_email"
                      value={formData.mail_shipping_email || ""}
                      onChange={(e) => handleChange("mail_shipping_email", e.target.value)}
                      placeholder="expedition@example.com"
                    />
                  ) : (
                    <div>{site.mail_shipping_email || "Non défini"}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="marketplace-config" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des marketplaces</CardTitle>
              <CardDescription>Activez ou désactivez les marketplaces pour ce site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_amazon">Amazon</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données Amazon dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_amazon"
                        checked={formData.marketplace_amazon}
                        onCheckedChange={(checked) => handleChange("marketplace_amazon", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_amazon ? "default" : "outline"}>
                        {site.marketplace_amazon ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_cdiscount">Cdiscount</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données Cdiscount dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_cdiscount"
                        checked={formData.marketplace_cdiscount}
                        onCheckedChange={(checked) => handleChange("marketplace_cdiscount", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_cdiscount ? "default" : "outline"}>
                        {site.marketplace_cdiscount ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_docmorris">DocMorris</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données DocMorris dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_docmorris"
                        checked={formData.marketplace_docmorris}
                        onCheckedChange={(checked) => handleChange("marketplace_docmorris", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_docmorris ? "default" : "outline"}>
                        {site.marketplace_docmorris ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_tiktok">TikTok</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données TikTok dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_tiktok"
                        checked={formData.marketplace_tiktok}
                        onCheckedChange={(checked) => handleChange("marketplace_tiktok", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_tiktok ? "default" : "outline"}>
                        {site.marketplace_tiktok ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_shein">SHEIN</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données SHEIN dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_shein"
                        checked={formData.marketplace_shein}
                        onCheckedChange={(checked) => handleChange("marketplace_shein", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_shein ? "default" : "outline"}>
                        {site.marketplace_shein ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketplace_lcdp">LCDP</Label>
                      <p className="text-sm text-muted-foreground">Afficher les données LCDP dans les analyses</p>
                    </div>
                    {isEditing ? (
                      <Switch
                        id="marketplace_lcdp"
                        checked={formData.marketplace_lcdp}
                        onCheckedChange={(checked) => handleChange("marketplace_lcdp", checked)}
                      />
                    ) : (
                      <Badge variant={site.marketplace_lcdp ? "default" : "outline"}>
                        {site.marketplace_lcdp ? "Activé" : "Désactivé"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketplace_autres">Autres Marketplaces</Label>
                    <p className="text-sm text-muted-foreground">
                      Afficher les données des autres marketplaces dans les analyses
                    </p>
                  </div>
                  {isEditing ? (
                    <Switch
                      id="marketplace_autres"
                      checked={formData.marketplace_autres}
                      onCheckedChange={(checked) => handleChange("marketplace_autres", checked)}
                    />
                  ) : (
                    <Badge variant={site.marketplace_autres ? "default" : "outline"}>
                      {site.marketplace_autres ? "Activé" : "Désactivé"}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Exemples de configuration</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Site e-commerce standard :</strong> Amazon et Cdiscount activés
                  </p>
                  <p>
                    <strong>Site pharmaceutique :</strong> DocMorris activé
                  </p>
                  <p>
                    <strong>Site mode et lifestyle :</strong> TikTok, SHEIN et LCDP activés
                  </p>
                  <p>
                    <strong>Site multi-canal :</strong> Toutes les marketplaces activées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
