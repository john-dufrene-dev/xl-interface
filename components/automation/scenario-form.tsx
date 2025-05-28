"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteSelector } from "@/components/site-selector"
import { Switch } from "@/components/ui/switch"
import { MailPreview } from "@/components/automation/mail-preview"
import { ReductionConfig } from "./reduction-config"

// Modifier le type RelanceStep pour ajouter les UTMs spécifiques au bouton
type RelanceStep = {
  id: string
  delai: number
  delaiUnite: "heures" | "jours"
  titreMail?: string
  sujet: string
  texteApercu?: string
  contenu: string // Gardé pour compatibilité
  contenuHaut?: string
  contenuBas?: string
  imageUrl?: string
  bannerLink?: string // Lien de la bannière
  utmSource?: string // utm_source
  utmMedium?: string // utm_medium
  utmCampaign?: string // utm_campaign
  utmTerm?: string // utm_term
  utmContent?: string // utm_content
  buttonLink?: string // Lien du bouton
  buttonUtmSource?: string // utm_source spécifique au bouton
  buttonUtmMedium?: string // utm_medium spécifique au bouton
  buttonUtmCampaign?: string // utm_campaign spécifique au bouton
  buttonUtmTerm?: string // utm_term spécifique au bouton
  buttonUtmContent?: string // utm_content spécifique au bouton
  texteButton?: string // Texte du bouton
  bonReductionActif?: boolean
  montantReduction?: number
  typeReduction?: "pourcentage" | "euro"
  dureeValidite?: number
}

// Modifier le type Scenario pour ajouter les UTMs spécifiques au bouton
type Scenario = {
  id: string
  nom: string
  siteId: string
  siteName: string
  titreMail?: string
  sujetMail?: string
  texteApercu?: string
  contenuMailHaut?: string
  contenuMailBas?: string
  imageUrl?: string
  bannerLink?: string // Lien de la bannière
  utmSource?: string // utm_source
  utmMedium?: string // utm_medium
  utmCampaign?: string // utm_campaign
  utmTerm?: string // utm_term
  utmContent?: string // utm_content
  buttonLink?: string // Lien du bouton
  buttonUtmSource?: string // utm_source spécifique au bouton
  buttonUtmMedium?: string // utm_medium spécifique au bouton
  buttonUtmCampaign?: string // utm_campaign spécifique au bouton
  buttonUtmTerm?: string // utm_term spécifique au bouton
  buttonUtmContent?: string // utm_content spécifique au bouton
  texteButton?: string
  bonReductionActif?: boolean
  montantReduction?: number
  typeReduction?: "pourcentage" | "euro"
  dureeValidite?: number
  criteres: {
    delaiCreation: number
    delaiCreationUnite: "heures" | "jours"
    statut: "non_traite" | "tous"
  }
  etapes: RelanceStep[]
  actif: boolean
  dateCreation: string
  statistiques: {
    totalPaniers: number
    paniersRelances: number
    paniersConvertis: number
    tauxConversion: number
  }
}

type ScenarioFormProps = {
  scenario: Scenario | null
  onCancel: () => void
  onSubmit: (scenario: Scenario) => void
}

export function ScenarioForm({ scenario, onCancel, onSubmit }: ScenarioFormProps) {
  // Mettre à jour l'état initial pour inclure les nouveaux champs UTM du bouton
  const [formData, setFormData] = useState<Partial<Scenario>>(
    scenario || {
      nom: "",
      siteId: "",
      titreMail: "",
      sujetMail: "",
      texteApercu: "",
      contenuMailHaut: "",
      contenuMailBas: "",
      imageUrl: "",
      bannerLink: "",
      utmSource: "email",
      utmMedium: "banner",
      utmCampaign: "cart_recovery",
      utmTerm: "",
      utmContent: "banner_image",
      buttonLink: "",
      buttonUtmSource: "email",
      buttonUtmMedium: "button",
      buttonUtmCampaign: "cart_recovery",
      buttonUtmTerm: "",
      buttonUtmContent: "cta_button",
      texteButton: "Voir mon panier",
      bonReductionActif: false,
      montantReduction: 10,
      typeReduction: "pourcentage",
      dureeValidite: 7,
      criteres: {
        delaiCreation: 1,
        delaiCreationUnite: "jours",
        statut: "non_traite",
      },
      etapes: [],
      actif: true,
    },
  )
  const [mailPreviewOpen, setMailPreviewOpen] = useState(false)
  // Mettre à jour le type de previewMail pour inclure les nouveaux champs UTM du bouton
  const [previewMail, setPreviewMail] = useState<{
    titreMail?: string
    sujet?: string
    texteApercu?: string
    imageUrl?: string
    bannerLink?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    utmTerm?: string
    utmContent?: string
    buttonLink?: string
    buttonUtmSource?: string
    buttonUtmMedium?: string
    buttonUtmCampaign?: string
    buttonUtmTerm?: string
    buttonUtmContent?: string
    contenuHaut?: string
    contenuBas?: string
    texteButton?: string
  }>({})
  const [previewingStep, setPreviewingStep] = useState<string | null>(null)

  // Mettre à jour la fonction handleAddStep pour inclure les nouveaux champs UTM du bouton
  const handleAddStep = () => {
    const newStepIndex = formData.etapes?.length || 0
    const newStep: RelanceStep = {
      id: `step-${Date.now()}`,
      delai: 4,
      delaiUnite: "heures",
      titreMail: "",
      sujet: "",
      texteApercu: "",
      contenu: "",
      contenuHaut: "",
      contenuBas: "",
      imageUrl: "",
      bannerLink: "",
      utmSource: "email",
      utmMedium: "banner",
      utmCampaign: `cart_recovery_step${newStepIndex + 1}`,
      utmTerm: "",
      utmContent: `banner_step${newStepIndex + 1}`,
      buttonLink: "",
      buttonUtmSource: "email",
      buttonUtmMedium: "button",
      buttonUtmCampaign: `cart_recovery_step${newStepIndex + 1}`,
      buttonUtmContent: `cta_step${newStepIndex + 1}`,
      texteButton: "Voir mon panier",
      bonReductionActif: false,
      montantReduction: 10,
      typeReduction: "pourcentage",
      dureeValidite: 7,
    }

    setFormData({
      ...formData,
      etapes: [...(formData.etapes || []), newStep],
    })
  }

  const handleRemoveStep = (stepId: string) => {
    setFormData({
      ...formData,
      etapes: (formData.etapes || []).filter((step) => step.id !== stepId),
    })
  }

  const updateStep = (stepId: string, field: keyof RelanceStep, value: any) => {
    setFormData({
      ...formData,
      etapes: (formData.etapes || []).map((step) => (step.id === stepId ? { ...step, [field]: value } : step)),
    })
    return true // Pour permettre le chaînage dans le bouton Réinitialiser
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous pourriez ajouter une validation
    onSubmit(formData as Scenario)
  }

  // Mettre à jour la fonction handlePreviewMainMail pour inclure les nouveaux champs UTM du bouton
  const handlePreviewMainMail = () => {
    setPreviewMail({
      titreMail: formData.titreMail,
      sujet: formData.sujetMail,
      texteApercu: formData.texteApercu,
      imageUrl: formData.imageUrl,
      bannerLink: formData.bannerLink,
      utmSource: formData.utmSource,
      utmMedium: formData.utmMedium,
      utmCampaign: formData.utmCampaign,
      utmTerm: formData.utmTerm,
      utmContent: formData.utmContent,
      buttonLink: formData.buttonLink,
      buttonUtmSource: formData.buttonUtmSource,
      buttonUtmMedium: formData.buttonUtmMedium,
      buttonUtmCampaign: formData.buttonUtmCampaign,
      buttonUtmTerm: formData.buttonUtmTerm,
      buttonUtmContent: formData.buttonUtmContent,
      contenuHaut: formData.contenuMailHaut,
      contenuBas: formData.contenuMailBas,
      texteButton: formData.texteButton,
    })
    setPreviewingStep(null)
    setMailPreviewOpen(true)
  }

  // Mettre à jour la fonction handlePreviewStepMail pour inclure les nouveaux champs UTM du bouton
  const handlePreviewStepMail = (stepId: string) => {
    const step = formData.etapes?.find((s) => s.id === stepId)
    if (step) {
      setPreviewMail({
        titreMail: step.titreMail,
        sujet: step.sujet,
        texteApercu: step.texteApercu,
        imageUrl: step.imageUrl,
        bannerLink: step.bannerLink,
        utmSource: step.utmSource,
        utmMedium: step.utmMedium,
        utmCampaign: step.utmCampaign,
        utmTerm: step.utmTerm,
        utmContent: step.utmContent,
        buttonLink: step.buttonLink,
        buttonUtmSource: step.buttonUtmSource,
        buttonUtmMedium: step.utmMedium,
        buttonUtmCampaign: step.buttonUtmCampaign,
        buttonUtmTerm: step.buttonUtmTerm,
        buttonUtmContent: step.buttonUtmContent,
        contenuHaut: step.contenuHaut || step.contenu,
        contenuBas: step.contenuBas,
        texteButton: step.texteButton,
      })
      setPreviewingStep(stepId)
      setMailPreviewOpen(true)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{scenario ? "Modifier le scénario" : "Créer un nouveau scénario"}</CardTitle>
          <CardDescription>Configurez les paramètres de votre scénario de relance de paniers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Section 1: Informations de base */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base font-medium">Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="nom" className="flex-none">
                    Nom du scénario
                  </Label>
                  <div className="flex-grow">
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder="Ex: Relance standard"
                      required
                      className="w-full h-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="siteId" className="flex-none">
                    Site concerné
                  </Label>
                  <div className="flex-grow">
                    <SiteSelector
                      value={formData.siteId || ""}
                      onChange={(value) => setFormData({ ...formData, siteId: value || "" })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
                />
                <Label htmlFor="actif">Activer ce scénario</Label>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Critères d'inscription */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base font-medium">Critères d'inscription</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delaiCreation">Délai avant envoi du premier mail de relance panier</Label>
                <div className="flex gap-2">
                  <Input
                    id="delaiCreation"
                    type="number"
                    min="1"
                    value={formData.criteres?.delaiCreation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          delaiCreation: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-24"
                    required
                  />
                  <Select
                    value={formData.criteres?.delaiCreationUnite}
                    onValueChange={(value: "heures" | "jours") =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          delaiCreationUnite: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heures">Heures</SelectItem>
                      <SelectItem value="jours">Jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Ce délai détermine quand le premier mail sera envoyé après l'abandon du panier.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section pour la configuration du bon de réduction */}
          {/* Section 3: Configuration du mail principal */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-3 flex flex-row justify-between items-center">
              <CardTitle className="text-base font-medium">Configuration du mail principal</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviewMainMail}
                disabled={!formData.sujetMail}
              >
                <Eye className="mr-2 h-4 w-4" />
                Visualiser
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sujetMail">Objet du mail</Label>
                  <Input
                    id="sujetMail"
                    value={formData.sujetMail}
                    onChange={(e) => setFormData({ ...formData, sujetMail: e.target.value })}
                    placeholder="Ex: Votre panier vous attend sur notre site !"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="texteApercu">Texte d'aperçu</Label>
                  <Input
                    id="texteApercu"
                    value={formData.texteApercu}
                    onChange={(e) => setFormData({ ...formData, texteApercu: e.target.value })}
                    placeholder="Ex: Découvrez les articles que vous avez sélectionnés..."
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="titreMail">Titre du mail</Label>
                <Input
                  id="titreMail"
                  value={formData.titreMail}
                  onChange={(e) => setFormData({ ...formData, titreMail: e.target.value })}
                  placeholder="Ex: Newsletter de votre boutique préférée"
                  required
                />
              </div>
              <div className="space-y-4">
                <Label htmlFor="imageUrl">Image du mail</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Ex: https://placehold.co/600x200/4f46e5/ffffff?text=Banner+Mail"
                  />
                  <Button type="button" variant="outline" className="shrink-0">
                    Parcourir
                  </Button>
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 border rounded-md p-2 max-w-xs">
                    <img
                      src={formData.imageUrl || "https://placehold.co/600x200/e2e8f0/1e293b"}
                      alt="Aperçu"
                      className="max-w-full h-auto"
                    />
                  </div>
                )}

                <div className="pt-2 border-t mt-4">
                  <Label htmlFor="bannerLink" className="mb-2 block">
                    Lien de la bannière
                  </Label>
                  <Input
                    id="bannerLink"
                    value={formData.bannerLink || ""}
                    onChange={(e) => setFormData({ ...formData, bannerLink: e.target.value })}
                    placeholder="Ex: https://www.votresite.com/promo"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Paramètres UTM</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          utmSource: "email",
                          utmMedium: "banner",
                          utmCampaign: "cart_recovery",
                          utmTerm: "",
                          utmContent: "banner_image",
                        })
                      }
                    >
                      Réinitialiser
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="utmSource" className="text-xs">
                        Source
                      </Label>
                      <Input
                        id="utmSource"
                        value={formData.utmSource || "email"}
                        onChange={(e) => setFormData({ ...formData, utmSource: e.target.value })}
                        placeholder="utm_source"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="utmMedium" className="text-xs">
                        Medium
                      </Label>
                      <Input
                        id="utmMedium"
                        value={formData.utmMedium || "banner"}
                        onChange={(e) => setFormData({ ...formData, utmMedium: e.target.value })}
                        placeholder="utm_medium"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="utmCampaign" className="text-xs">
                        Campaign
                      </Label>
                      <Input
                        id="utmCampaign"
                        value={formData.utmCampaign || "cart_recovery"}
                        onChange={(e) => setFormData({ ...formData, utmCampaign: e.target.value })}
                        placeholder="utm_campaign"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="utmTerm" className="text-xs">
                        Term
                      </Label>
                      <Input
                        id="utmTerm"
                        value={formData.utmTerm || ""}
                        onChange={(e) => setFormData({ ...formData, utmTerm: e.target.value })}
                        placeholder="utm_term (optionnel)"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="utmContent" className="text-xs">
                        Content
                      </Label>
                      <Input
                        id="utmContent"
                        value={formData.utmContent || "banner_image"}
                        onChange={(e) => setFormData({ ...formData, utmContent: e.target.value })}
                        placeholder="utm_content"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contenuMailHaut">Contenu du mail (partie haute)</Label>
                  <Textarea
                    id="contenuMailHaut"
                    value={formData.contenuMailHaut}
                    onChange={(e) => setFormData({ ...formData, contenuMailHaut: e.target.value })}
                    placeholder="Contenu du mail de relance (partie haute)..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contenuMailBas">Contenu du mail (partie basse)</Label>
                  <Textarea
                    id="contenuMailBas"
                    value={formData.contenuMailBas}
                    onChange={(e) => setFormData({ ...formData, contenuMailBas: e.target.value })}
                    placeholder="Contenu du mail de relance (partie basse)..."
                    rows={4}
                    required
                  />
                </div>
                {/* Ajouter la section de configuration des UTMs pour le bouton dans le mail principal */}
                {/* Remplacer la section existante du bouton par celle-ci: */}
                <div className="space-y-2">
                  <Label htmlFor="texteButton">Texte du bouton</Label>
                  <Input
                    id="texteButton"
                    value={formData.texteButton}
                    onChange={(e) => setFormData({ ...formData, texteButton: e.target.value })}
                    placeholder="Ex: Voir mon panier"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Lien du bouton</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink || ""}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="Ex: https://www.votresite.com/panier"
                  />
                </div>

                <div className="pt-2 border-t mt-4 md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Paramètres UTM du bouton</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          buttonUtmSource: "email",
                          buttonUtmMedium: "button",
                          buttonUtmCampaign: "cart_recovery",
                          buttonUtmTerm: "",
                          buttonUtmContent: "cta_button",
                        })
                      }
                    >
                      Réinitialiser
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="buttonUtmSource" className="text-xs">
                        Source
                      </Label>
                      <Input
                        id="buttonUtmSource"
                        value={formData.buttonUtmSource || "email"}
                        onChange={(e) => setFormData({ ...formData, buttonUtmSource: e.target.value })}
                        placeholder="utm_source"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonUtmMedium" className="text-xs">
                        Medium
                      </Label>
                      <Input
                        id="buttonUtmMedium"
                        value={formData.buttonUtmMedium || "button"}
                        onChange={(e) => setFormData({ ...formData, buttonUtmMedium: e.target.value })}
                        placeholder="utm_medium"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonUtmCampaign" className="text-xs">
                        Campaign
                      </Label>
                      <Input
                        id="buttonUtmCampaign"
                        value={formData.buttonUtmCampaign || "cart_recovery"}
                        onChange={(e) => setFormData({ ...formData, buttonUtmCampaign: e.target.value })}
                        placeholder="utm_campaign"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="buttonUtmTerm" className="text-xs">
                        Term
                      </Label>
                      <Input
                        id="buttonUtmTerm"
                        value={formData.buttonUtmTerm || ""}
                        onChange={(e) => setFormData({ ...formData, buttonUtmTerm: e.target.value })}
                        placeholder="utm_term (optionnel)"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="buttonUtmContent" className="text-xs">
                        Content
                      </Label>
                      <Input
                        id="buttonUtmContent"
                        value={formData.buttonUtmContent || "cta_button"}
                        onChange={(e) => setFormData({ ...formData, buttonUtmContent: e.target.value })}
                        placeholder="utm_content"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t mt-4">
                <h3 className="text-lg font-medium mb-4">Configuration du bon de réduction</h3>

                <ReductionConfig
                  actif={formData.bonReductionActif || false}
                  montant={formData.montantReduction || 10}
                  type={formData.typeReduction || "pourcentage"}
                  duree={formData.dureeValidite || 7}
                  onActifChange={checked => setFormData({ ...formData, bonReductionActif: checked })}
                  onMontantChange={val => setFormData({ ...formData, montantReduction: val })}
                  onTypeChange={val => setFormData({ ...formData, typeReduction: val })}
                  onDureeChange={val => setFormData({ ...formData, dureeValidite: val })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Étapes de relance */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-3 flex flex-row justify-between items-center">
              <CardTitle className="text-base font-medium">Étapes de relance</CardTitle>
              <Button type="button" variant="outline" onClick={handleAddStep}>
                <Plus className="mr-2 h-4 w-4" /> Ajouter une étape
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Chaque étape correspond à l'envoi d'un nouveau mail de relance. Le délai configuré détermine quand le
                mail sera envoyé après l'étape précédente. Les mails sont envoyés uniquement si le panier n'a pas été
                traité entre-temps.
              </p>

              {formData.etapes && formData.etapes.length > 0 ? (
                <div className="space-y-6">
                  {formData.etapes.map((step, index) => (
                    <Card key={step.id} className="border border-gray-200">
                      <CardHeader className="bg-muted/30 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Mail de relance {index + 1}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewStepMail(step.id)}
                              disabled={!step.sujet}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualiser
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveStep(step.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-6">
                        {/* Timing */}
                        <div className="p-3 bg-muted/20 rounded-md">
                          <h4 className="font-medium mb-2">Timing d'envoi</h4>
                          <div className="flex gap-2 items-center">
                            <Input
                              id={`delai-${step.id}`}
                              type="number"
                              min="1"
                              value={step.delai}
                              onChange={(e) => updateStep(step.id, "delai", Number.parseInt(e.target.value))}
                              className="w-24"
                              required
                            />
                            <Select
                              value={step.delaiUnite}
                              onValueChange={(value: "heures" | "jours") => updateStep(step.id, "delaiUnite", value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="heures">Heures</SelectItem>
                                <SelectItem value="jours">Jours</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                              {index === 0 ? "après l'abandon du panier" : "après l'étape précédente"}
                            </span>
                          </div>
                        </div>

                        {/* Contenu du mail */}
                        <div>
                          <h4 className="font-medium mb-3">Contenu du mail</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`sujet-${step.id}`}>Objet du mail</Label>
                              <Input
                                id={`sujet-${step.id}`}
                                value={step.sujet}
                                onChange={(e) => updateStep(step.id, "sujet", e.target.value)}
                                placeholder="Ex: Votre panier vous attend !"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`texteApercu-${step.id}`}>Texte d'aperçu</Label>
                              <Input
                                id={`texteApercu-${step.id}`}
                                value={step.texteApercu || ""}
                                onChange={(e) => updateStep(step.id, "texteApercu", e.target.value)}
                                placeholder="Ex: Découvrez les articles que vous avez sélectionnés..."
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor={`titreMail-${step.id}`}>Titre du mail</Label>
                            <Input
                              id={`titreMail-${step.id}`}
                              value={step.titreMail || ""}
                              onChange={(e) => updateStep(step.id, "titreMail", e.target.value)}
                              placeholder="Ex: Newsletter de votre boutique préférée"
                              required
                            />
                          </div>
                          <div className="space-y-2 mt-4">
                            <Label htmlFor={`imageUrl-${step.id}`}>Image du mail</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`imageUrl-${step.id}`}
                                value={step.imageUrl || ""}
                                onChange={(e) => updateStep(step.id, "imageUrl", e.target.value)}
                                placeholder="Ex: https://placehold.co/600x200/4f46e5/ffffff?text=Mail+Etape"
                              />
                              <Button type="button" variant="outline" className="shrink-0">
                                Parcourir
                              </Button>
                            </div>
                            {step.imageUrl && (
                              <div className="mt-2 border rounded-md p-2 max-w-xs">
                                <img
                                  src={step.imageUrl || "https://placehold.co/600x200/e2e8f0/1e293b"}
                                  alt="Aperçu"
                                  className="max-w-full h-auto"
                                />
                              </div>
                            )}
                          </div>
                          <div className="pt-2 border-t mt-4">
                            <Label htmlFor={`bannerLink-${step.id}`} className="mb-2 block">
                              Lien de la bannière
                            </Label>
                            <Input
                              id={`bannerLink-${step.id}`}
                              value={step.bannerLink || ""}
                              onChange={(e) => updateStep(step.id, "bannerLink", e.target.value)}
                              placeholder="Ex: https://www.votresite.com/promo"
                            />
                          </div>

                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-2">
                              <Label>Paramètres UTM</Label>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateStep(step.id, "utmSource", "email") &&
                                  updateStep(step.id, "utmMedium", "banner") &&
                                  updateStep(step.id, "utmCampaign", `cart_recovery_step${index + 1}`) &&
                                  updateStep(step.id, "utmTerm", "") &&
                                  updateStep(step.id, "utmContent", `banner_step${index + 1}`)
                                }
                              >
                                Réinitialiser
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor={`utmSource-${step.id}`} className="text-xs">
                                  Source
                                </Label>
                                <Input
                                  id={`utmSource-${step.id}`}
                                  value={step.utmSource || "email"}
                                  onChange={(e) => updateStep(step.id, "utmSource", e.target.value)}
                                  placeholder="utm_source"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`utmMedium-${step.id}`} className="text-xs">
                                  Medium
                                </Label>
                                <Input
                                  id={`utmMedium-${step.id}`}
                                  value={step.utmMedium || "banner"}
                                  onChange={(e) => updateStep(step.id, "utmMedium", e.target.value)}
                                  placeholder="utm_medium"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`utmCampaign-${step.id}`} className="text-xs">
                                  Campaign
                                </Label>
                                <Input
                                  id={`utmCampaign-${step.id}`}
                                  value={step.utmCampaign || `cart_recovery_step${index + 1}`}
                                  onChange={(e) => updateStep(step.id, "utmCampaign", e.target.value)}
                                  placeholder="utm_campaign"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`utmTerm-${step.id}`} className="text-xs">
                                  Term
                                </Label>
                                <Input
                                  id={`utmTerm-${step.id}`}
                                  value={step.utmTerm || ""}
                                  onChange={(e) => updateStep(step.id, "utmTerm", e.target.value)}
                                  placeholder="utm_term (optionnel)"
                                  className="mt-1"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor={`utmContent-${step.id}`} className="text-xs">
                                  Content
                                </Label>
                                <Input
                                  id={`utmContent-${step.id}`}
                                  value={step.utmContent || `banner_step${index + 1}`}
                                  onChange={(e) => updateStep(step.id, "utmContent", e.target.value)}
                                  placeholder="utm_content"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor={`contenuHaut-${step.id}`}>Contenu du mail (partie haute)</Label>
                              <Textarea
                                id={`contenuHaut-${step.id}`}
                                value={step.contenuHaut || step.contenu || ""}
                                onChange={(e) => updateStep(step.id, "contenuHaut", e.target.value)}
                                placeholder="Contenu du mail de relance (partie haute)..."
                                rows={4}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`contenuBas-${step.id}`}>Contenu du mail (partie basse)</Label>
                              <Textarea
                                id={`contenuBas-${step.id}`}
                                value={step.contenuBas || ""}
                                onChange={(e) => updateStep(step.id, "contenuBas", e.target.value)}
                                placeholder="Contenu du mail de relance (partie basse)..."
                                rows={4}
                                required
                              />
                            </div>
                            {/* Ajouter la section de configuration des UTMs pour le bouton dans chaque étape */}
                            {/* Remplacer la section existante du bouton dans chaque étape par celle-ci: */}
                            <div className="space-y-2">
                              <Label htmlFor={`texteButton-${step.id}`}>Texte du bouton</Label>
                              <Input
                                id={`texteButton-${step.id}`}
                                value={step.texteButton || ""}
                                onChange={(e) => updateStep(step.id, "texteButton", e.target.value)}
                                placeholder="Ex: Voir mon panier"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`buttonLink-${step.id}`}>Lien du bouton</Label>
                              <Input
                                id={`buttonLink-${step.id}`}
                                value={step.buttonLink || ""}
                                onChange={(e) => updateStep(step.id, "buttonLink", e.target.value)}
                                placeholder="Ex: https://www.votresite.com/panier"
                              />
                            </div>

                            <div className="pt-2 border-t mt-4">
                              <div className="flex justify-between items-center mb-2">
                                <Label>Paramètres UTM du bouton</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateStep(step.id, "buttonUtmSource", "email") &&
                                    updateStep(step.id, "buttonUtmMedium", "button") &&
                                    updateStep(step.id, "buttonUtmCampaign", `cart_recovery_step${index + 1}`) &&
                                    updateStep(step.id, "buttonUtmTerm", "") &&
                                    updateStep(step.id, "buttonUtmContent", `cta_step${index + 1}`)
                                  }
                                >
                                  Réinitialiser
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label htmlFor={`buttonUtmSource-${step.id}`} className="text-xs">
                                    Source
                                  </Label>
                                  <Input
                                    id={`buttonUtmSource-${step.id}`}
                                    value={step.buttonUtmSource || "email"}
                                    onChange={(e) => updateStep(step.id, "buttonUtmSource", e.target.value)}
                                    placeholder="utm_source"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`buttonUtmMedium-${step.id}`} className="text-xs">
                                    Medium
                                  </Label>
                                  <Input
                                    id={`buttonUtmMedium-${step.id}`}
                                    value={step.buttonUtmMedium || "button"}
                                    onChange={(e) => updateStep(step.id, "buttonUtmMedium", e.target.value)}
                                    placeholder="utm_medium"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`buttonUtmCampaign-${step.id}`} className="text-xs">
                                    Campaign
                                  </Label>
                                  <Input
                                    id={`buttonUtmCampaign-${step.id}`}
                                    value={step.buttonUtmCampaign || `cart_recovery_step${index + 1}`}
                                    onChange={(e) => updateStep(step.id, "buttonUtmCampaign", e.target.value)}
                                    placeholder="utm_campaign"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`buttonUtmTerm-${step.id}`} className="text-xs">
                                    Term
                                  </Label>
                                  <Input
                                    id={`buttonUtmTerm-${step.id}`}
                                    value={step.buttonUtmTerm || ""}
                                    onChange={(e) => updateStep(step.id, "buttonUtmTerm", e.target.value)}
                                    placeholder="utm_term (optionnel)"
                                    className="mt-1"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <Label htmlFor={`buttonUtmContent-${step.id}`} className="text-xs">
                                    Content
                                  </Label>
                                  <Input
                                    id={`buttonUtmContent-${step.id}`}
                                    value={step.buttonUtmContent || `cta_step${index + 1}`}
                                    onChange={(e) => updateStep(step.id, "buttonUtmContent", e.target.value)}
                                    placeholder="utm_content"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 border-t mt-4">
                          <h3 className="text-lg font-medium mb-4">Configuration du bon de réduction</h3>

                          <ReductionConfig
                            actif={step.bonReductionActif || false}
                            montant={step.montantReduction || 10}
                            type={step.typeReduction || "pourcentage"}
                            duree={step.dureeValidite || 7}
                            onActifChange={checked => updateStep(step.id, "bonReductionActif", checked)}
                            onMontantChange={val => updateStep(step.id, "montantReduction", val)}
                            onTypeChange={val => updateStep(step.id, "typeReduction", val)}
                            onDureeChange={val => updateStep(step.id, "dureeValidite", val)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">Aucune étape de relance définie</p>
                  <Button type="button" variant="outline" onClick={handleAddStep}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une étape
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">{scenario ? "Mettre à jour" : "Créer le scénario"}</Button>
        </CardFooter>
      </Card>

      <MailPreview open={mailPreviewOpen} onOpenChange={setMailPreviewOpen} mail={previewMail} />
    </form>
  )
}
