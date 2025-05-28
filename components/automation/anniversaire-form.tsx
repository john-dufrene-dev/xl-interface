"use client"

import type React from "react"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteSelector } from "@/components/site-selector"
import { Switch } from "@/components/ui/switch"
import { MailPreview } from "@/components/automation/mail-preview"

// Modifier le type Scenario pour ajouter les UTMs spécifiques au bouton
type Scenario = {
  id: string
  nom: string
  siteId: string
  siteName: string
  titreMail: string
  sujetMail: string
  texteApercu: string
  contenuMailHaut: string
  contenuMailBas: string
  imageUrl: string
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
  texteButton: string
  criteres: {
    montantOffre: number
    typeOffre: "%" | "€"
    dureeValidite: number
    actif: boolean // Ajout de la propriété pour activer/désactiver le bon de réduction
  }
  actif: boolean
  dateCreation: string
  statistiques: {
    totalClients: number
    emailsEnvoyes: number
    offresUtilisees: number
    tauxConversion: number
    caGenere: number
  }
}

type AnniversaireFormProps = {
  scenario: Scenario | null
  onCancel: () => void
  onSubmit: (scenario: Scenario) => void
}

export function AnniversaireForm({ scenario, onCancel, onSubmit }: AnniversaireFormProps) {
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
      bannerLink: "", // Lien de la bannière
      utmSource: "email", // Valeur par défaut
      utmMedium: "banner", // Valeur par défaut
      utmCampaign: "birthday", // Valeur par défaut
      utmTerm: "", // Valeur par défaut
      utmContent: "banner_image", // Valeur par défaut
      buttonLink: "", // Lien du bouton
      buttonUtmSource: "email", // Valeur par défaut pour le bouton
      buttonUtmMedium: "button", // Valeur par défaut pour le bouton
      buttonUtmCampaign: "birthday", // Valeur par défaut pour le bouton
      buttonUtmTerm: "", // Valeur par défaut pour le bouton
      buttonUtmContent: "cta_button", // Valeur par défaut pour le bouton
      texteButton: "Profiter de mon cadeau",
      criteres: {
        montantOffre: 10,
        typeOffre: "%",
        dureeValidite: 7,
        actif: true, // Valeur par défaut: activé
      },
      actif: true,
    },
  )
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

  const [mailPreviewOpen, setMailPreviewOpen] = useState(false)

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
    setMailPreviewOpen(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{scenario ? "Modifier le scénario" : "Créer un nouveau scénario"}</CardTitle>
          <CardDescription>Configurez les paramètres de votre scénario d'emails d'anniversaire</CardDescription>
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
                      placeholder="Ex: Anniversaire clients premium"
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
                      id="siteId"
                      value={formData.siteId || null}
                      onChange={(value) => setFormData({ ...formData, siteId: value || "" })}
                      className="w-full h-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Configuration du mail principal */}
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
                    placeholder="Ex: 🎂 Joyeux Anniversaire ! Un cadeau vous attend"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="texteApercu">Texte d'aperçu</Label>
                  <Input
                    id="texteApercu"
                    value={formData.texteApercu}
                    onChange={(e) => setFormData({ ...formData, texteApercu: e.target.value })}
                    placeholder="Ex: Pour célébrer votre anniversaire, nous vous offrons une réduction exceptionnelle !"
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
                  placeholder="Ex: Joyeux Anniversaire de la part de notre équipe"
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
                    placeholder="Ex: https://placehold.co/600x200/4f46e5/ffffff?text=Joyeux+Anniversaire"
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
                    placeholder="Ex: https://www.votresite.com/promo-anniversaire"
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
                          utmCampaign: "birthday",
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
                        value={formData.utmCampaign || "birthday"}
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
                    placeholder="Ex: Cher(e) client(e), toute l'équipe vous souhaite un merveilleux anniversaire ! Pour célébrer cette journée spéciale avec vous, nous avons le plaisir de vous offrir un cadeau."
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
                    placeholder="Ex: Cette offre est valable pendant 7 jours. N'hésitez pas à nous contacter si vous avez des questions. Nous vous souhaitons une excellente journée d'anniversaire !"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="texteButton">Texte du bouton</Label>
                  <Input
                    id="texteButton"
                    value={formData.texteButton}
                    onChange={(e) => setFormData({ ...formData, texteButton: e.target.value })}
                    placeholder="Ex: Profiter de mon cadeau"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonLink">Lien du bouton</Label>
                  <Input
                    id="buttonLink"
                    value={formData.buttonLink || ""}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="Ex: https://www.votresite.com/offre-anniversaire"
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
                          buttonUtmCampaign: "birthday",
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
                        value={formData.buttonUtmCampaign || "birthday"}
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

          {/* Section 3: Critères d'inscription */}
          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-base font-medium">Configuration du bon de réduction</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bonReductionActif"
                    checked={formData.criteres?.actif ?? true}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          actif: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="bonReductionActif">Activer le bon de réduction</Label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formData.criteres?.actif ? "Bon de réduction actif" : "Bon de réduction désactivé"}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="montantOffre">Montant de l'offre</Label>
                  <Input
                    id="montantOffre"
                    type="number"
                    min="1"
                    value={formData.criteres?.montantOffre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          montantOffre: Number.parseFloat(e.target.value),
                        },
                      })
                    }
                    placeholder="Ex: 10"
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeOffre">Type d'offre</Label>
                  <select
                    id="typeOffre"
                    value={formData.criteres?.typeOffre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          typeOffre: e.target.value as "%" | "€",
                        },
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="%">%</option>
                    <option value="€">€</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dureeValidite">Durée de validité (jours)</Label>
                  <Input
                    id="dureeValidite"
                    type="number"
                    min="1"
                    value={formData.criteres?.dureeValidite}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteres: {
                          ...formData.criteres!,
                          dureeValidite: Number.parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                    required
                  />
                </div>
              </div>
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
