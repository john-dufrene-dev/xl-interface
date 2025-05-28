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
import { Check, Info, Mail, Smartphone, Tablet } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

// Schéma de validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  siteId: z.string().min(1, { message: "Veuillez sélectionner un site" }),
  status: z.enum(["actif", "inactif", "brouillon"]),
  subject: z.string().min(5, { message: "L'objet doit contenir au moins 5 caractères" }),
  preheader: z.string().optional(),
  content: z.string().min(10, { message: "Le contenu doit contenir au moins 10 caractères" }),
  template: z.enum(["simple", "promotionnel", "informatif"]),
  criteria: z.object({
    categories: z.array(z.string()),
    interests: z.array(z.string()),
    lastPurchase: z.number().nullable(),
  }),
})

// Options pour les formulaires
const siteOptions = [
  { value: "site1", label: "Site principal" },
  { value: "site2", label: "Site secondaire" },
]

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
  const [audienceCount, setAudienceCount] = useState<number>(0)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: newsletter
      ? {
          name: newsletter.name,
          siteId: newsletter.siteId,
          status: newsletter.status,
          subject: newsletter.subject,
          preheader: newsletter.preheader,
          content: newsletter.content,
          template: newsletter.template,
          criteria: {
            categories: newsletter.criteria.categories,
            interests: newsletter.criteria.interests,
            lastPurchase: newsletter.criteria.lastPurchase,
          },
        }
      : {
          name: "",
          siteId: "",
          status: "brouillon",
          subject: "",
          preheader: "",
          content: "",
          template: "simple",
          criteria: {
            categories: [],
            interests: [],
            lastPurchase: null,
          },
        },
  })

  // Simuler le calcul de l'audience
  useEffect(() => {
    const values = form.getValues()
    // Simulation simple: plus de critères = audience plus petite
    const baseAudience = 5000
    const categoryFactor = values.criteria.categories.length ? 0.8 : 1
    const interestFactor = values.criteria.interests.length ? 0.7 : 1
    const purchaseFactor = values.criteria.lastPurchase ? 0.6 : 1

    const calculatedAudience = Math.floor(baseAudience * categoryFactor * interestFactor * purchaseFactor)
    setAudienceCount(calculatedAudience)
  }, [form.watch("criteria")])

  // Gérer la soumission du formulaire
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const savedNewsletter: Newsletter = {
      id: newsletter?.id || "temp-id",
      ...values,
      createdAt: newsletter?.createdAt || new Date().toISOString(),
      lastSent: newsletter?.lastSent || null,
      nextSend: newsletter?.nextSend || null,
      stats: newsletter?.stats || {
        sent: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
      },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {siteOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="brouillon" />
                        </FormControl>
                        <FormLabel className="font-normal">Brouillon</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="actif" />
                        </FormControl>
                        <FormLabel className="font-normal">Actif</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="inactif" />
                        </FormControl>
                        <FormLabel className="font-normal">Inactif</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Choix du template */}
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Template de newsletter</CardTitle>
            <CardDescription>Choisissez parmi nos 3 templates prédéfinis</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {newsletterTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          field.value === template.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "hover:border-muted-foreground/20"
                        }`}
                        onClick={() => field.onChange(template.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{template.name}</div>
                          {field.value === template.id && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="mb-3">
                          <img
                            src={template.preview || "/placeholder.svg"}
                            alt={`Template ${template.name}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Contenu de l'email */}
        <Card>
          <CardHeader className="bg-muted/50 pb-3">
            <CardTitle className="text-base font-medium">Contenu de l'email</CardTitle>
            <CardDescription>Configurez le contenu de votre newsletter</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="edition" className="space-y-4">
              <TabsList>
                <TabsTrigger value="edition">Édition</TabsTrigger>
                <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              </TabsList>

              <TabsContent value="edition" className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objet de l'email</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Découvrez nos nouveautés du mois" {...field} />
                      </FormControl>
                      <FormDescription>L'objet est la première chose que vos clients verront.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preheader"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pré-en-tête</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Les dernières tendances et promotions exclusives" {...field} />
                      </FormControl>
                      <FormDescription>Texte court visible dans la boîte de réception après l'objet.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Contenu de votre newsletter..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Vous pouvez utiliser du HTML pour mettre en forme votre contenu.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="apercu">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Aperçu de votre newsletter</h3>
                    <div className="flex space-x-2 border rounded-md">
                      <Button
                        variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "tablet" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewDevice("tablet")}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg overflow-hidden mx-auto ${
                      previewDevice === "desktop"
                        ? "w-full max-w-3xl"
                        : previewDevice === "tablet"
                          ? "w-full max-w-md"
                          : "w-full max-w-xs"
                    }`}
                  >
                    <div className="bg-gray-100 p-2 border-b">
                      <div className="text-sm font-medium truncate">{form.watch("subject") || "Objet de l'email"}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {form.watch("preheader") || "Pré-en-tête de l'email"}
                      </div>
                    </div>
                    <div className="bg-white p-4" style={{ minHeight: "300px" }}>
                      <div className="prose prose-sm max-w-none">
                        {form.watch("content") ? (
                          <div dangerouslySetInnerHTML={{ __html: form.watch("content") }} />
                        ) : (
                          <p className="text-muted-foreground italic">Prévisualisez votre contenu ici...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
                <p className="text-sm text-blue-700 font-medium">Audience estimée: {audienceCount} clients</p>
                <p className="text-xs text-blue-600 mt-1">
                  Cette estimation est basée sur les critères sélectionnés ci-dessous.
                </p>
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="criteria.categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégories d'intérêt</FormLabel>
                    <div className="space-y-2">
                      {categoryOptions.map((category) => (
                        <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              onCheckedChange={(checked) => {
                                const updatedCategories = checked
                                  ? [...field.value, category.id]
                                  : field.value?.filter((value) => value !== category.id)
                                field.onChange(updatedCategories)
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{category.label}</FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormDescription>
                      Sélectionnez les catégories de produits qui intéressent vos clients.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <FormField
                control={form.control}
                name="criteria.interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centres d'intérêt</FormLabel>
                    <div className="space-y-2">
                      {interestOptions.map((interest) => (
                        <FormItem key={interest.id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(interest.id)}
                              onCheckedChange={(checked) => {
                                const updatedInterests = checked
                                  ? [...field.value, interest.id]
                                  : field.value?.filter((value) => value !== interest.id)
                                field.onChange(updatedInterests)
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{interest.label}</FormLabel>
                        </FormItem>
                      ))}
                    </div>
                    <FormDescription>Sélectionnez les centres d'intérêt de vos clients.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <FormField
                control={form.control}
                name="criteria.lastPurchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dernière commande</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "null" ? null : Number.parseInt(value))}
                      defaultValue={field.value === null ? "null" : field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une période" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lastPurchaseOptions.map((option) => (
                          <SelectItem
                            key={option.value === null ? "null" : option.value.toString()}
                            value={option.value === null ? "null" : option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Filtrez les clients en fonction de leur dernière commande.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">{newsletter ? "Mettre à jour" : "Créer la newsletter"}</Button>
        </div>
      </form>
    </Form>
  )
}
