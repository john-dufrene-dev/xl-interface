"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

// Mettre à jour le type MailPreviewProps pour inclure les nouveaux champs UTM du bouton
type MailPreviewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mail: {
    titreMail?: string
    sujet?: string // Objet du mail
    texteApercu?: string
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
    contenuHaut?: string
    contenuBas?: string
    texteButton?: string
    // Autres champs
    colorPrimary?: string
    colorSecondary?: string
    logoUrl?: string
    unsubscribeLink?: string
    termsLink?: string
    contactFormLink?: string
    legalNoticeLink?: string
  }
}

// Fonction pour construire une URL avec des paramètres UTM
const buildUtmUrl = (baseUrl: string, utmParams: Record<string, string | undefined>) => {
  if (!baseUrl) return ""

  const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`)

  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}

// Mettre à jour la fonction MailPreview pour utiliser les UTMs spécifiques au bouton
export function MailPreview({ open, onOpenChange, mail }: MailPreviewProps) {
  // Construire l'URL de la bannière avec UTMs
  const bannerUrl = mail.bannerLink
    ? buildUtmUrl(mail.bannerLink, {
        utm_source: mail.utmSource,
        utm_medium: mail.utmMedium,
        utm_campaign: mail.utmCampaign,
        utm_term: mail.utmTerm,
        utm_content: mail.utmContent,
      })
    : ""

  // Construire l'URL du bouton avec UTMs spécifiques au bouton
  const buttonUrl = mail.buttonLink
    ? buildUtmUrl(mail.buttonLink, {
        utm_source: mail.buttonUtmSource || mail.utmSource || "email",
        utm_medium: mail.buttonUtmMedium || "button",
        utm_campaign: mail.buttonUtmCampaign || mail.utmCampaign || "campaign",
        utm_term: mail.buttonUtmTerm || mail.utmTerm || "",
        utm_content: mail.buttonUtmContent || "cta_button",
      })
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Prévisualisation du mail</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>Aperçu du mail tel qu'il sera envoyé aux clients</DialogDescription>
        </DialogHeader>

        <div className="border rounded-md overflow-hidden bg-white">
          {/* En-tête du mail */}
          <div className="border-b p-4 bg-gray-50" style={{ backgroundColor: mail.colorSecondary || "#f3f4f6" }}>
            {mail.logoUrl && (
              <div className="mb-3 text-center">
                <img
                  src={mail.logoUrl || "/placeholder.svg"}
                  alt="Logo"
                  className="h-10 max-w-[200px] inline-block object-contain"
                />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-sm text-gray-700">De: Votre Boutique &lt;contact@boutique.com&gt;</div>
              <div className="text-xs text-gray-500">Aujourd'hui, 14:30</div>
            </div>
            <div className="font-medium mb-1">À: client@example.com</div>
            <div className="font-bold text-lg">{mail.sujet || "Sujet du mail"}</div>
            <div className="text-sm text-gray-500 mt-1">{mail.texteApercu || "Aperçu du mail..."}</div>
          </div>

          {/* Corps du mail */}
          <div className="p-0">
            {/* Titre du mail (généralement dans l'en-tête du mail) */}
            {mail.titreMail && (
              <div className="bg-gray-100 p-3 text-center text-sm text-gray-500 border-b">{mail.titreMail}</div>
            )}

            {/* Image principale */}
            {mail.imageUrl && (
              <div className="w-full">
                {bannerUrl ? (
                  <a href={bannerUrl} target="_blank" rel="noopener noreferrer">
                    <img src={mail.imageUrl || "/placeholder.svg"} alt="Bannière" className="w-full h-auto" />
                  </a>
                ) : (
                  <img src={mail.imageUrl || "/placeholder.svg"} alt="Bannière" className="w-full h-auto" />
                )}
              </div>
            )}

            {/* Contenu du mail (partie haute) */}
            <div className="p-6">
              <div className="text-gray-800 mb-6">{mail.contenuHaut || "Contenu du mail (partie haute)..."}</div>

              {/* Bouton d'action */}
              <div className="text-center my-6">
                {buttonUrl ? (
                  <a href={buttonUrl} target="_blank" rel="noopener noreferrer">
                    <button
                      className="hover:opacity-90 text-white font-bold py-2 px-6 rounded"
                      style={{ backgroundColor: mail.colorPrimary || "#3b82f6" }}
                    >
                      {mail.texteButton || "Voir mon panier"}
                    </button>
                  </a>
                ) : (
                  <button
                    className="hover:opacity-90 text-white font-bold py-2 px-6 rounded"
                    style={{ backgroundColor: mail.colorPrimary || "#3b82f6" }}
                  >
                    {mail.texteButton || "Voir mon panier"}
                  </button>
                )}
              </div>

              {/* Contenu du mail (partie basse) */}
              <div className="text-gray-800 mt-6">{mail.contenuBas || "Contenu du mail (partie basse)..."}</div>
            </div>

            {/* Pied de page du mail */}
            <div className="bg-gray-100 p-4 text-center text-xs text-gray-500 border-t">
              <p className="mb-2">© 2023 Votre Boutique. Tous droits réservés.</p>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                {mail.unsubscribeLink && (
                  <a href={mail.unsubscribeLink} className="text-blue-600 underline">
                    Se désinscrire
                  </a>
                )}
                {mail.termsLink && (
                  <a href={mail.termsLink} className="text-blue-600 underline">
                    CGV
                  </a>
                )}
                {mail.contactFormLink && (
                  <a href={mail.contactFormLink} className="text-blue-600 underline">
                    Contact
                  </a>
                )}
                {mail.legalNoticeLink && (
                  <a href={mail.legalNoticeLink} className="text-blue-600 underline">
                    Mentions légales
                  </a>
                )}
              </div>
              <p>
                Pour vous désinscrire de nos communications,{" "}
                <a href={mail.unsubscribeLink || "#"} className="text-blue-600 underline">
                  cliquez ici
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
