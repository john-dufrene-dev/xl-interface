"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Newsletter, NewsletterTemplate } from "./newsletter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Info, Mail, Smartphone, Tablet, Eye } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { SiteSelector } from "@/components/site-selector"
import { MailPreview } from "@/components/automation/mail-preview"

// Schéma de validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  siteId: z.string().min(1, { message: "Veuillez sélectionner un site" }),
  subject: z.string().min(5, { message: "L'objet doit contenir au moins 5 caractères" }),
  preheader: z.string().min(1, { message: "Le pré-en-tête est requis" }),
  titreMail: z.string().min(2, { message: "Le titre du mail est requis" }),
  texteApercu: z.string().min(2, { message: "Le texte d'aperçu est requis" }),
  imageUrl: z.string().url({ message: "L'URL de l'image est requise" }),
  bannerLink: z.string().url({ message: "Le lien de la bannière est requis" }).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  buttonLink: z.string().url({ message: "Le lien du bouton est requis" }).optional(),
  buttonUtmSource: z.string().optional(),
  buttonUtmMedium: z.string().optional(),
  buttonUtmCampaign: z.string().optional(),
  buttonUtmTerm: z.string().optional(),
  buttonUtmContent: z.string().optional(),
  texteButton: z.string().min(2, { message: "Le texte du bouton est requis" }),
  contenuMailHaut: z.string().min(2, { message: "Le contenu haut est requis" }),
  contenuMailBas: z.string().min(2, { message: "Le contenu bas est requis" }),
  criteria: z.object({
    subscribed: z.boolean(),
  }),
  reduction: z.object({
    actif: z.boolean(),
    montant: z.number().min(1, { message: "Le montant doit être au moins 1" }),
    type: z.enum(["%", "€"]),
    duree: z.number().min(1, { message: "La durée doit être au moins 1 jour" }),
  }),
  referenceNewsletterId: z.string().optional(),
})

const categoryOptions = [
  { id: "vetements", label: "Vêtements" },
  { id: "chaussures", label: "Chaussures" },
  { id: "accessoires", label: "Accessoires" },
  { id: "electronique", label: "Électronique" },
  { id: "maison", label: "Maison & Déco" },
  { id: "beaute", label: "Beauté & Bien-être" },
]

const interestOptions = [
  { id: "mode", label: "Mode" },
  { id: "sport", label: "Sport" },
  { id: "technologie", label: "Technologie" },
  { id: "cuisine", label: "Cuisine" },
  { id: "voyage", label: "Voyage" },
  { id: "lecture", label: "Lecture" },
]

const lastPurchaseOptions = [
  { value: 30, label: "Moins de 30 jours" },
  { value: 90, label: "Moins de 3 mois" },
  { value: 180, label: "Moins de 6 mois" },
  { value: 365, label: "Moins d'un an" },
  { value: null, label: "Tous les clients" },
]

// Templates de newsletter
const newsletterTemplates = [
  {
    id: "simple" as NewsletterTemplate,
    name: "Simple",
    description: "Un design épuré avec une mise en page simple",
    preview: "/placeholder.svg?height=100&width=200&query=template simple newsletter",
  },
  {
    id: "promotionnel" as NewsletterTemplate,
    name: "Promotionnel",
    description: "Idéal pour mettre en avant des offres et promotions",
    preview: "/placeholder.svg?height=100&width=200&query=template promotionnel newsletter",
  },
  {
    id: "informatif" as NewsletterTemplate,
    name: "Informatif",
    description: "Parfait pour les actualités et articles de fond",
    preview: "/placeholder.svg?height=100&width=200&query=template informatif newsletter",
  },
]

interface NewsletterFormProps {
  newsletter?: Newsletter | null
  onSave: (newsletter: Newsletter) => void
  onCancel: () => void
}

export default function NewsletterForm({ newsletter, onSave, onCancel }: NewsletterFormProps) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: newsletter
      ? {
          name: newsletter.name,
          siteId: newsletter.siteId,
          subject: newsletter.subject,
          preheader: newsletter.preheader || "",
          titreMail: newsletter.titreMail || "",
          texteApercu: newsletter.texteApercu || "",
          imageUrl: newsletter.imageUrl || "",
          bannerLink: newsletter.bannerLink || undefined,
          utmSource: newsletter.utmSource || undefined,
          utmMedium: newsletter.utmMedium || undefined,
          utmCampaign: newsletter.utmCampaign || undefined,
          utmTerm: newsletter.utmTerm || undefined,
          utmContent: newsletter.utmContent || undefined,
          buttonLink: newsletter.buttonLink || undefined,
          buttonUtmSource: newsletter.buttonUtmSource || undefined,
          buttonUtmMedium: newsletter.buttonUtmMedium || undefined,
          buttonUtmCampaign: newsletter.buttonUtmCampaign || undefined,
          buttonUtmTerm: newsletter.buttonUtmTerm || undefined,
          buttonUtmContent: newsletter.buttonUtmContent || undefined,
          texteButton: newsletter.texteButton || "",
          contenuMailHaut: newsletter.contenuMailHaut || "",
          contenuMailBas: newsletter.contenuMailBas || "",
          criteria: {
            subscribed: newsletter.criteria.subscribed ?? true,
          },
          reduction: newsletter.reduction || {
            actif: false,
            montant: 0,
            type: "%",
            duree: 0,
          },
          referenceNewsletterId: newsletter.referenceNewsletterId || "",
        }
      : {
          name: "",
          siteId: "",
          subject: "",
          preheader: "",
          titreMail: "",
          texteApercu: "",
          imageUrl: "",
          bannerLink: undefined,
          utmSource: undefined,
          utmMedium: undefined,
          utmCampaign: undefined,
          utmTerm: undefined,
          utmContent: undefined,
          buttonLink: undefined,
          buttonUtmSource: undefined,
          buttonUtmMedium: undefined,
          buttonUtmCampaign: undefined,
          buttonUtmTerm: undefined,
          buttonUtmContent: undefined,
          texteButton: "",
          contenuMailHaut: "",
          contenuMailBas: "",
          criteria: {
            subscribed: true,
          },
          reduction: {
            actif: false,
            montant: 0,
            type: "%",
            duree: 0,
          },
          referenceNewsletterId: "",
        },
  })

  // Gérer la soumission du formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const savedNewsletter: Newsletter = {
      id: newsletter?.id || "temp-id",
      ...values,
      preheader: values.preheader,
      createdAt: newsletter?.createdAt || new Date().toISOString(),
      lastSent: newsletter?.lastSent || null,
      nextSend: newsletter?.nextSend || null,
      stats: newsletter?.stats || {
        sent: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
      },
      actif: true,
    }
    onSave(savedNewsletter)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Informations de base */}
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Informations de base</CardTitle>
            <CardDescription>Configurez les paramètres généraux de votre newsletter</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:items-end">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la newsletter</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Newsletter mensuelle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Site</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <SiteSelector value={field.value} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Choix du template */}
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Template de newsletter</CardTitle>
            <CardDescription>Choisissez parmi nos 3 templates prédéfinis</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
          </CardContent>
        </Card>

        {/* Section Configuration du mail principal (bannière, utms, bouton, utms bouton) */}
        <Card className="border shadow-sm">
          <CardHeader className="bg-muted/50 pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-base font-medium">Configuration du mail principal</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewDialogOpen(true)}
              disabled={!form.watch("subject")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Visualiser
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objet du mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Joyeux Anniversaire ! Un cadeau vous attend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="texteApercu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte d'aperçu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pour célébrer votre anniversaire, nous vous offrons une réduction exceptionnelle !" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="titreMail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Joyeux Anniversaire de la part de Site Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bannière principale */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image du mail</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Ex: https://placehold.co/600x200/4f46e5/ffffff?text=Joyeux+Anniversaire" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" className="shrink-0">Parcourir</Button>
                  </div>
                  {field.value && (
                    <div className="mt-2 border rounded-md p-2 max-w-xs">
                      <img src={field.value || 'https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Site+Principal'} alt="Aperçu" className="max-w-full h-auto" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2 border-t mt-4">
              <FormField
                control={form.control}
                name="bannerLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block">Lien de la bannière</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://www.votresite.com/promo-anniversaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* UTMs de la bannière */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <FormLabel>Paramètres UTM</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form.setValue("utmSource", "email")
                    form.setValue("utmMedium", "banner")
                    form.setValue("utmCampaign", "newsletter")
                    form.setValue("utmTerm", "")
                    form.setValue("utmContent", "banner_image")
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="utmSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Source</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_source" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utmMedium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Medium</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_medium" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utmCampaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Campaign</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_campaign" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utmTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Term</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_term (optionnel)" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utmContent"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs">Content</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_content" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Contenu haut et bas */}
            <FormField
              control={form.control}
              name="contenuMailHaut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu du mail (partie haute)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Contenu haut de votre newsletter..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contenuMailBas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu du mail (partie basse)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Contenu bas de votre newsletter..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Bouton d'action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="texteButton"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texte du bouton</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Profiter de mon cadeau" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="buttonLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien du bouton</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://www.votresite.com/offre-anniversaire" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* UTMs du bouton */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <FormLabel>Paramètres UTM du bouton</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form.setValue("buttonUtmSource", "email")
                    form.setValue("buttonUtmMedium", "button")
                    form.setValue("buttonUtmCampaign", "newsletter")
                    form.setValue("buttonUtmTerm", "")
                    form.setValue("buttonUtmContent", "cta_button")
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="buttonUtmSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Source</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_source" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonUtmMedium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Medium</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_medium" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonUtmCampaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Campaign</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_campaign" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonUtmTerm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Term</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_term (optionnel)" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonUtmContent"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs">Content</FormLabel>
                      <FormControl>
                        <Input placeholder="utm_content" className="mt-1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Configuration du bon de réduction */}
        <Card className="border shadow-sm">
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Configuration du bon de réduction</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="reductionActif"
                  checked={form.watch("reduction.actif")}
                  onCheckedChange={checked => form.setValue("reduction.actif", checked)}
                />
                <label htmlFor="reductionActif" className="font-medium">Activer le bon de réduction</label>
              </div>
              <div className="text-sm text-muted-foreground">
                {form.watch("reduction.actif") ? "Bon de réduction actif" : "Bon de réduction désactivé"}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="reduction.montant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de l'offre</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reduction.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'offre</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="%">%</option>
                        <option value="€">€</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reduction.duree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée de validité (jours)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Critères d'inscription */}
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Critères d'inscription</CardTitle>
            <CardDescription>Définissez votre audience cible</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium">Audience : tous les inscrits à la newsletter</p>
                <p className="text-xs text-blue-600 mt-1">
                  Cette newsletter sera envoyée à tous les utilisateurs inscrits.
                </p>
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="criteria.subscribed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>État d'inscription</FormLabel>
                    <div className="mt-2 mb-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Sélectionnez les clients qui sont inscrits à votre newsletter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Pour s'inscrire à cette newsletter, le client ne doit pas avoir déjà reçu ce mail ou ne pas l'avoir ouvert.
              </p>
              <FormField
                control={form.control}
                name="referenceNewsletterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sélectionner une newsletter de référence</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || "none"}
                        defaultValue="none"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Aucune" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune</SelectItem>
                          <SelectItem value="1">Newsletter mensuelle (15/01/2023)</SelectItem>
                          <SelectItem value="2">Promotions spéciales (20/02/2023)</SelectItem>
                          <SelectItem value="3">Actualités du secteur (10/03/2023)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button variant="outline" onClick={onCancel} type="button">
            Annuler
          </Button>
          <Button type="submit">{newsletter ? "Mettre à jour" : "Créer la newsletter"}</Button>
          <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="default" onClick={() => setPreviewDialogOpen(true)}>
                Envoyer la newsletter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Résumé de la newsletter</DialogTitle>
                <DialogDescription>
                  Résumé des critères d'inscription : tous les inscrits à la newsletter.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div className="text-sm text-muted-foreground">Nombre d'inscrits à l'envoi</div>
                  <div className="font-medium">1000</div>
                  <div className="text-sm text-muted-foreground">Scénario</div>
                  <div className="font-medium">Non ouvert</div>
                  <div className="text-sm text-muted-foreground">Informations pertinentes</div>
                  <div className="font-medium">Newsletter mensuelle</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)} type="button">Annuler</Button>
                <Button type="button" onClick={() => { setPreviewDialogOpen(false); /* ici tu peux déclencher l'envoi réel */ }}>Confirmer l'envoi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  )
}
