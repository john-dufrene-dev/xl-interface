"use client"

import React from "react"
import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Tag, FileDown, ShoppingBag, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Types
type ProduitDetail = {
  id: string
  id_product: string
  id_site: string
  name: string
  description: string | null
  short_description: string | null
  long_description: string | null
  url: string | null
  image: string | null
  images: string[] | null
  reference: string | null
  ean13: string | null
  price: number
  price_excl_tax: number
  purchase_price: number
  tax_value: number
  is_discounted: boolean
  promo_price: number
  date_promo_from: string | null
  date_promo_to: string | null
  created_at: string
  updated_at: string
  category_default: string | null
  category_1: string | null
  category_2: string | null
  category_3: string | null
  category_4: string | null
  category_5: string | null
  quantity: number
  weight: number | null
  composition: string | null
  usage_advice: boolean
  brand: string | null
  min_sale_qty: number
  max_sale_qty: number
  status: string
}

export default function ProduitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const [produit, setProduit] = useState<ProduitDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageModal, setImageModal] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Simuler le chargement des données
  useEffect(() => {
    setTimeout(() => {
      setProduit({
        id: id,
        id_product: "PROD123",
        id_site: "1",
        name: "Smartphone XYZ",
        description:
          "Un smartphone haut de gamme avec des fonctionnalités avancées. Écran OLED de 6,5 pouces, processeur octa-core, 8 Go de RAM, 128 Go de stockage, appareil photo 48 MP, batterie 4500 mAh avec charge rapide.",
        short_description: "Smartphone haut de gamme, écran OLED, 8Go RAM.",
        long_description: "Ce smartphone offre une expérience utilisateur exceptionnelle grâce à son écran OLED, son processeur puissant et sa grande capacité de stockage.",
        url: "/produits/smartphone-xyz",
        image: "/placeholder.svg",
        images: ["/placeholder.svg", "/placeholder.svg"],
        reference: "REF-S123",
        ean13: "1234567890123",
        price: 999.99,
        price_excl_tax: 833.33,
        purchase_price: 700.00,
        tax_value: 20.0,
        is_discounted: true,
        promo_price: 899.99,
        date_promo_from: "2023-05-01T00:00:00",
        date_promo_to: "2023-05-31T23:59:59",
        created_at: "2023-01-15T10:30:00",
        updated_at: "2023-05-01T09:15:00",
        category_default: "Électronique",
        category_1: "Smartphones",
        category_2: "Haut de gamme",
        category_3: null,
        category_4: null,
        category_5: null,
        quantity: 42,
        weight: 0.18,
        composition: "Plastique, verre, lithium",
        usage_advice: true,
        brand: "SuperTech",
        min_sale_qty: 1,
        max_sale_qty: 5,
        status: "Actif",
      })
      setLoading(false)
    }, 500)
  }, [id])

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Chargement du produit...</h3>
        </div>
      </div>
    )
  }

  if (!produit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Produit non trouvé</h3>
          <Button variant="link" onClick={() => router.push("/produits")} className="mt-2">
            Retour à la liste des produits
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/produits")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{produit.name}</h1>
            <p className="text-muted-foreground">Référence: {produit.reference || "Non définie"}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Modale d'agrandissement d'image */}
      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setImageModal(null)}>
          <img src={imageModal} alt="Agrandissement" className="max-h-[90vh] max-w-[90vw] rounded shadow-lg" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Colonne gauche : images + infos principales */}
        <div className="md:col-span-6 space-y-6">
          {/* Bloc Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-2">
                {produit.images && produit.images.length > 0 ? (
                  produit.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={produit.name}
                      className="h-32 w-32 object-cover rounded-md border cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setImageModal(img)}
                    />
                  ))
                ) : (
                  <div className="h-32 w-32 rounded-md bg-muted flex items-center justify-center">
                    <Tag className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bloc Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Nom :</span> {produit.name}
                <button type="button" className="ml-1 p-1 hover:bg-gray-200 rounded" title="Copier le nom"
                  onClick={() => handleCopy(produit.name, 'name')}>
                  {copied === 'name' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Marque :</span> {produit.brand || "-"}
                {produit.brand && (
                  <button type="button" className="ml-1 p-1 hover:bg-gray-200 rounded" title="Copier la marque"
                    onClick={() => handleCopy(produit.brand!, 'brand')}>
                    {copied === 'brand' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Référence :</span> {produit.reference}
                {produit.reference && (
                  <button type="button" className="ml-1 p-1 hover:bg-gray-200 rounded" title="Copier la référence"
                    onClick={() => handleCopy(produit.reference!, 'reference')}>
                    {copied === 'reference' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">EAN13 :</span> {produit.ean13}
                {produit.ean13 && (
                  <button type="button" className="ml-1 p-1 hover:bg-gray-200 rounded" title="Copier l'EAN13"
                    onClick={() => handleCopy(produit.ean13!, 'ean13')}>
                    {copied === 'ean13' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">ID Produit :</span> {produit.id_product}
                <button type="button" className="ml-1 p-1 hover:bg-gray-200 rounded" title="Copier l'ID Produit"
                  onClick={() => handleCopy(produit.id_product, 'id_product')}>
                  {copied === 'id_product' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Statut :</span>
                <Badge variant={produit.status === "Actif" ? "outline" : "outline"} className={produit.status === "Actif" ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-gray-100 text-gray-800 border-gray-200"}>{produit.status === "Actif" ? "Oui" : "Non"}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Médicament OTC :</span>
                <Badge variant={produit.usage_advice ? "outline" : "outline"} className={produit.usage_advice ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-gray-100 text-gray-800 border-gray-200"}>{produit.usage_advice ? "Oui" : "Non"}</Badge>
              </div>
              <div><span className="font-semibold">ID Site :</span> {produit.id_site}</div>
              <div>
                <span className="font-semibold">Lien produit :</span> {produit.url && (
                  <Link href={produit.url} target="_blank" className="text-blue-600 underline ml-1">Voir la page</Link>
                )}
              </div>
              <div>
                <span className="font-semibold">Dates :</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Créé le</span>
                    <p>{format(new Date(produit.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Mis à jour le</span>
                    <p>{format(new Date(produit.updated_at), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloc Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Descriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-semibold">Description courte :</span> {produit.short_description}</div>
              <div><span className="font-semibold">Description longue :</span> {produit.long_description}</div>
            </CardContent>
          </Card>

          {/* Bloc Composition & Conseils */}
          <Card>
            <CardHeader>
              <CardTitle>Composition & Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-semibold">Composition :</span> {produit.composition}</div>
              <div><span className="font-semibold">Conseils d'utilisation :</span> {produit.long_description || "-"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite : stock, catégories, prix */}
        <div className="md:col-span-4 space-y-6">
          {/* Bloc Stock & vente */}
          <Card>
            <CardHeader>
              <CardTitle>Stock & vente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-semibold">Quantité en stock :</span> {produit.quantity}</div>
              <div><span className="font-semibold">Poids :</span> {produit.weight ? `${produit.weight} kg` : "-"}</div>
              <div><span className="font-semibold">Quantité minimale pour la vente :</span> {produit.min_sale_qty}</div>
              <div><span className="font-semibold">Quantité maximale pour la vente :</span> {produit.max_sale_qty}</div>
            </CardContent>
          </Card>

          {/* Bloc Catégories */}
          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-x-2 mt-1">
                {produit.category_default && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {produit.category_default}
                  </Badge>
                )}
                {produit.category_1 && <Badge variant="outline">{produit.category_1}</Badge>}
                {produit.category_2 && <Badge variant="outline">{produit.category_2}</Badge>}
                {produit.category_3 && <Badge variant="outline">{produit.category_3}</Badge>}
                {produit.category_4 && <Badge variant="outline">{produit.category_4}</Badge>}
                {produit.category_5 && <Badge variant="outline">{produit.category_5}</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Bloc Prix & Promotions */}
          <Card>
            <CardHeader>
              <CardTitle>Prix & Promotions</CardTitle>
              <CardDescription>Informations tarifaires et promotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Prix HT</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(produit.price_excl_tax)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Prix TTC</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(produit.price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Prix d'achat</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(produit.purchase_price)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>TVA</span>
                  <span>{produit.tax_value}%</span>
                </div>
              </div>
              <div className="space-y-2">
                {produit.is_discounted ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Prix promotionnel</span>
                      <span className="font-bold text-red-600">
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(produit.promo_price)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Réduction</span>
                      <span className="text-red-600">
                        -{Math.round((1 - produit.promo_price / produit.price) * 100)}%
                      </span>
                    </div>
                    {produit.date_promo_from && produit.date_promo_to && (
                      <div className="flex justify-between items-center">
                        <span>Période promo</span>
                        <span>
                          du {format(new Date(produit.date_promo_from), "dd/MM/yyyy", { locale: fr })} au {format(new Date(produit.date_promo_to), "dd/MM/yyyy", { locale: fr })}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground">Aucune promotion en cours</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
