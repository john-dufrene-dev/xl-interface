"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Tag, FileDown, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type ProduitDetail = {
  id: string
  id_product: string
  id_site: string
  name: string
  description: string | null
  url: string | null
  image: string | null
  sku: string | null
  reference: string | null
  price: number
  price_excl_tax: number
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
}

export default function ProduitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [produit, setProduit] = useState<ProduitDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Simuler le chargement des données
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setProduit({
        id: params.id,
        id_product: "PROD123",
        id_site: "1",
        name: "Smartphone XYZ",
        description:
          "Un smartphone haut de gamme avec des fonctionnalités avancées. Écran OLED de 6,5 pouces, processeur octa-core, 8 Go de RAM, 128 Go de stockage, appareil photo 48 MP, batterie 4500 mAh avec charge rapide.",
        url: "/produits/smartphone-xyz",
        image: "/placeholder.svg",
        sku: "SKU123",
        reference: "REF-S123",
        price: 999.99,
        price_excl_tax: 833.33,
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
      })
      setLoading(false)
    }, 500)
  }, [params.id])

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

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations produit</CardTitle>
                <CardDescription>Détails et caractéristiques du produit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="h-48 w-48 rounded-md bg-muted">
                    {produit.image ? (
                      <img
                        src={produit.image || "/placeholder.svg"}
                        alt={produit.name}
                        className="h-full w-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <Tag className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Nom</h3>
                  <p>{produit.name}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{produit.description || "Aucune description"}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Identifiants</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">ID Produit</p>
                      <p>{produit.id_product}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p>{produit.sku || "Non défini"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Référence</p>
                      <p>{produit.reference || "Non définie"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ID Site</p>
                      <p>{produit.id_site}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Site</h3>
                  <p>Site {produit.id_site}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Dates</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Créé le</p>
                      <p>{format(new Date(produit.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mis à jour le</p>
                      <p>{format(new Date(produit.updated_at), "dd/MM/yyyy HH:mm", { locale: fr })}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prix et taxes</CardTitle>
                  <CardDescription>Informations de tarification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Prix public</span>
                    <span className="text-lg font-bold">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(produit.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Prix HT</span>
                    <span>
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        produit.price_excl_tax,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>TVA</span>
                    <span>{produit.tax_value}%</span>
                  </div>

                  {produit.is_discounted && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Prix promotionnel</span>
                        <span className="text-lg font-bold text-red-600">
                          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            produit.promo_price,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Réduction</span>
                        <span className="text-red-600">
                          -{Math.round((1 - produit.promo_price / produit.price) * 100)}%
                        </span>
                      </div>

                      {produit.date_promo_from && produit.date_promo_to && (
                        <div>
                          <span className="text-sm text-muted-foreground">Période de promotion:</span>
                          <p>
                            Du {format(new Date(produit.date_promo_from), "dd/MM/yyyy", { locale: fr })} au{" "}
                            {format(new Date(produit.date_promo_to), "dd/MM/yyyy", { locale: fr })}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catégories</CardTitle>
                  <CardDescription>Classification du produit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {produit.category_default && (
                      <div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {produit.category_default}
                        </Badge>
                        <span className="ml-2 text-xs text-muted-foreground">Catégorie principale</span>
                      </div>
                    )}

                    {produit.category_1 && (
                      <div>
                        <Badge variant="outline">{produit.category_1}</Badge>
                      </div>
                    )}

                    {produit.category_2 && (
                      <div>
                        <Badge variant="outline">{produit.category_2}</Badge>
                      </div>
                    )}

                    {produit.category_3 && (
                      <div>
                        <Badge variant="outline">{produit.category_3}</Badge>
                      </div>
                    )}

                    {produit.category_4 && (
                      <div>
                        <Badge variant="outline">{produit.category_4}</Badge>
                      </div>
                    )}

                    {produit.category_5 && (
                      <div>
                        <Badge variant="outline">{produit.category_5}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des prix</CardTitle>
              <CardDescription>Configurez les prix et promotions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Prix standard</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Prix HT</label>
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={produit.price_excl_tax}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          readOnly
                        />
                        <span className="ml-2">€</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Taux de TVA</label>
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={produit.tax_value}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          readOnly
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Prix TTC</label>
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={produit.price}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          readOnly
                        />
                        <span className="ml-2">€</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Prix promotionnel</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={produit.is_discounted}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        readOnly
                      />
                      <label className="ml-2">Activer la promotion</label>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Prix promotionnel TTC</label>
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={produit.promo_price}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          readOnly
                        />
                        <span className="ml-2">€</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Date de début</label>
                      <input
                        type="date"
                        value={produit.date_promo_from ? format(new Date(produit.date_promo_from), "yyyy-MM-dd") : ""}
                        className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Date de fin</label>
                      <input
                        type="date"
                        value={produit.date_promo_to ? format(new Date(produit.date_promo_to), "yyyy-MM-dd") : ""}
                        className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des catégories</CardTitle>
              <CardDescription>Associez le produit à des catégories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Catégorie principale</h3>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={produit.category_default || ""}
                  readOnly
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Électronique">Électronique</option>
                  <option value="Accessoires">Accessoires</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Catégories secondaires</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-muted-foreground">Catégorie 1</label>
                    <select
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                      value={produit.category_1 || ""}
                      readOnly
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Tablettes">Tablettes</option>
                      <option value="Ordinateurs">Ordinateurs</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Catégorie 2</label>
                    <select
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                      value={produit.category_2 || ""}
                      readOnly
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Haut de gamme">Haut de gamme</option>
                      <option value="Milieu de gamme">Milieu de gamme</option>
                      <option value="Entrée de gamme">Entrée de gamme</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Catégorie 3</label>
                    <select
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                      value={produit.category_3 || ""}
                      readOnly
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="Nouveautés">Nouveautés</option>
                      <option value="Promotions">Promotions</option>
                      <option value="Meilleures ventes">Meilleures ventes</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
