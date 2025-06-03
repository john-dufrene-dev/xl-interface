"use client"

import React, { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Package, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Types
type CommandeItem = {
  id: string
  id_order: string
  id_product: string
  name: string
  unit_price: number
  quantity: number
  reference: string
  price_ht: number
  price_ttc: number
  tva: string
  image_url: string
}

type CommandeDetail = {
  id: string
  id_order: string
  reference: string
  id_contact: string
  id_cart: string
  currency: string
  current_state: string
  payment: string
  module: string
  shipping_number: string
  total_discounts: number
  total_discounts_tax_incl: number
  total_discounts_tax_excl: number
  total_paid: number
  total_paid_tax_incl: number
  total_paid_tax_excl: number
  total_paid_real: number
  total_products: number
  total_products_wt: number
  total_shipping: number
  total_shipping_tax_incl: number
  total_shipping_tax_excl: number
  created_at: string
  updated_at: string
  id_site: string
  is_ca_itek: boolean
  is_marketplace: boolean
  is_amazon: boolean
  is_tiktok: boolean
  is_cdiscount: boolean
  is_docmorris: boolean
  is_lcdp: boolean
  is_shein: boolean
  is_izyshop: boolean
  is_other_marketplaces: boolean
  contact: {
    id: string
    firstname: string
    lastname: string
    email: string
    company: string
    address: string
    zip: string
    city: string
    country: string
    phonenumber: string
  }
  items: CommandeItem[]
  shipping_carrier_site?: string
  shipping_carrier_mapped?: string
  current_state_mapped?: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CommandeDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [commande, setCommande] = useState<CommandeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const orderId = use(params).id

  // Fonction pour obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "payé":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "expédié":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "livré":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "en attente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "annulé":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setCommande({
        id: orderId,
        id_order: "ORD123456",
        reference: "REF-A123",
        id_contact: "CONT456",
        id_cart: "CART123",
        currency: "EUR",
        current_state: "payé",
        payment: "carte",
        module: "stripe",
        shipping_number: "TRACK123456",
        total_discounts: 0,
        total_discounts_tax_incl: 0,
        total_discounts_tax_excl: 0,
        total_paid: 129.99,
        total_paid_tax_incl: 129.99,
        total_paid_tax_excl: 108.33,
        total_paid_real: 129.99,
        total_products: 119.99,
        total_products_wt: 119.99,
        total_shipping: 10.0,
        total_shipping_tax_incl: 10.0,
        total_shipping_tax_excl: 8.33,
        created_at: "2023-05-15T10:30:00",
        updated_at: "2023-05-15T10:35:00",
        id_site: "1",
        is_ca_itek: true,
        is_marketplace: false,
        is_amazon: false,
        is_tiktok: false,
        is_cdiscount: false,
        is_docmorris: false,
        is_lcdp: false,
        is_shein: false,
        is_izyshop: false,
        is_other_marketplaces: false,
        contact: {
          id: "CONT456",
          firstname: "Jean",
          lastname: "Dupont",
          email: "jean.dupont@example.com",
          company: "Entreprise ABC",
          address: "123 Rue de Paris",
          zip: "75001",
          city: "Paris",
          country: "France",
          phonenumber: "01 23 45 67 89",
        },
        items: [
          {
            id: "1",
            id_order: "ORD123456",
            id_product: "PROD789",
            name: "Smartphone XYZ",
            unit_price: 99.99,
            quantity: 1,
            reference: "REF-S123",
            price_ht: 83.33,
            price_ttc: 99.99,
            tva: "20%",
            image_url: "/placeholder.svg",
          },
          {
            id: "2",
            id_order: "ORD123456",
            id_product: "PROD456",
            name: "Coque de protection",
            unit_price: 10.0,
            quantity: 2,
            reference: "REF-C456",
            price_ht: 8.33,
            price_ttc: 10.0,
            tva: "20%",
            image_url: "/placeholder.svg",
          },
        ],
        shipping_carrier_site: "Colissimo Livraison à Domicile",
        shipping_carrier_mapped: "Colissimo",
        current_state_mapped: "En cours de préparation",
      })
      setLoading(false)
    }, 500)
  }, [orderId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Chargement de la commande...</h3>
        </div>
      </div>
    )
  }

  if (!commande) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Commande non trouvée</h3>
          <Button variant="link" onClick={() => router.push("/commandes")} className="mt-2">
            Retour à la liste des commandes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/commandes")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Commande #{commande.reference}</h1>
            <p className="text-muted-foreground">
              Passée le {format(new Date(commande.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du client</CardTitle>
            <CardDescription>Détails du contact associé à la commande</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>
                {commande.contact.firstname} {commande.contact.lastname}
              </p>
              <p>{commande.contact.email}</p>
              <p>{commande.contact.phonenumber}</p>
            </div>

            {commande.contact.company && (
              <div>
                <h3 className="font-semibold">Entreprise</h3>
                <p>{commande.contact.company}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p>{commande.contact.address}</p>
              <p>
                {commande.contact.zip} {commande.contact.city}
              </p>
              <p>{commande.contact.country}</p>
            </div>

            <div>
              <h3 className="font-semibold">Provenance</h3>
              <div className="space-y-2">
                {commande.is_ca_itek && <p>CA Itek</p>}
                {commande.is_amazon && <p>Amazon</p>}
                {commande.is_tiktok && <p>TikTok</p>}
                {commande.is_cdiscount && <p>Cdiscount</p>}
                {commande.is_docmorris && <p>DocMorris</p>}
                {commande.is_lcdp && <p>LCDP</p>}
                {commande.is_shein && <p>Shein</p>}
                {commande.is_izyshop && <p>Izyshop</p>}
                {commande.is_other_marketplaces && <p>Autres marketplaces</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Détails de la commande</CardTitle>
              <Badge className={`${getStatusColor(commande.current_state)}`}>
                {commande.current_state.charAt(0).toUpperCase() + commande.current_state.slice(1)}
              </Badge>
            </div>
            <CardDescription>Informations de paiement et livraison</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Paiement</h3>
              <p>Méthode: {commande.payment.charAt(0).toUpperCase() + commande.payment.slice(1)}</p>
              <p>Module: {commande.module}</p>
            </div>

            <div>
              <h3 className="font-semibold">Site</h3>
              <p>Site {commande.id_site}</p>
            </div>

            {commande.shipping_number && (
              <div>
                <h3 className="font-semibold">Livraison</h3>
                <p>Numéro de suivi: {commande.shipping_number}</p>
              </div>
            )}

            <div className="pt-4">
              <div className="flex justify-between">
                <span>Total produits (HT)</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    commande.total_products,
                  )}
                </span>
              </div>
              {commande.total_discounts > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Remises</span>
                  <span>
                    -
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      commande.total_discounts,
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frais de livraison (HT)</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    commande.total_shipping_tax_excl,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>TVA</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    commande.total_paid_tax_incl - commande.total_paid_tax_excl,
                  )}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total (TTC)</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(commande.total_paid)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations techniques</CardTitle>
          <CardDescription>Détails techniques de la commande</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Identifiants */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Identifiants</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">ID :</span> {commande.id}</div>
                <div><span className="font-medium">ID Commande :</span> {commande.id_order}</div>
                <div><span className="font-medium">Référence :</span> {commande.reference}</div>
                <div><span className="font-medium">ID Contact :</span> {commande.id_contact}</div>
                <div><span className="font-medium">ID Panier :</span> {commande.id_cart}</div>
              </div>
            </div>
            {/* Dates */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Dates</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Créée le :</span> {format(new Date(commande.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}</div>
                <div><span className="font-medium">Mise à jour le :</span> {format(new Date(commande.updated_at), "dd/MM/yyyy HH:mm", { locale: fr })}</div>
              </div>
            </div>
            {/* Détails financiers */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Détails financiers</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Total payé :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_paid)}</div>
                <div><span className="font-medium">Total payé (TTC) :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_paid_tax_incl)}</div>
                <div><span className="font-medium">Total payé (HT) :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_paid_tax_excl)}</div>
                <div><span className="font-medium">Total payé réel :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_paid_real)}</div>
              </div>
            </div>
            {/* Remises */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Remises</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Total remises :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_discounts)}</div>
                <div><span className="font-medium">Remises (TTC) :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_discounts_tax_incl)}</div>
                <div><span className="font-medium">Remises (HT) :</span> {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(commande.total_discounts_tax_excl)}</div>
              </div>
            </div>
            {/* Provenance */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 col-span-1 md:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-2 text-gray-700">Provenance</h4>
              <div className="flex flex-wrap gap-2">
                {commande.is_ca_itek && <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">CA Itek</span>}
                {commande.is_amazon && <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">Amazon</span>}
                {commande.is_tiktok && <span className="px-2 py-1 rounded bg-pink-100 text-pink-800 text-xs font-medium">TikTok</span>}
                {commande.is_cdiscount && <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">Cdiscount</span>}
                {commande.is_docmorris && <span className="px-2 py-1 rounded bg-teal-100 text-teal-800 text-xs font-medium">DocMorris</span>}
                {commande.is_lcdp && <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-medium">LCDP</span>}
                {commande.is_shein && <span className="px-2 py-1 rounded bg-fuchsia-100 text-fuchsia-800 text-xs font-medium">Shein</span>}
                {commande.is_izyshop && <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-medium">Izyshop</span>}
                {commande.is_other_marketplaces && <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-medium">Autres marketplaces</span>}
              </div>
            </div>
            {/* Paiement */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Paiement</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Méthode :</span> {commande.payment}</div>
                <div><span className="font-medium">Module :</span> {commande.module}</div>
              </div>
            </div>
            {/* Transporteur */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Transporteur</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Transporteur du site :</span> {commande.shipping_carrier_site || "-"}</div>
                <div><span className="font-medium">Transporteur mappé :</span> {commande.shipping_carrier_mapped || "-"}</div>
              </div>
            </div>
            {/* Statut de la commande */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">Statut de la commande</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Statut du site :</span> {commande.current_state}</div>
                <div><span className="font-medium">Statut mappé :</span> {commande.current_state_mapped || "-"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Source de la commande</CardTitle>
          <CardDescription>Origine de la commande</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg border ${commande.is_ca_itek ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">CA Itek</p>
              <p>{commande.is_ca_itek ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_marketplace ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">Marketplace</p>
              <p>{commande.is_marketplace ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_amazon ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">Amazon</p>
              <p>{commande.is_amazon ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_tiktok ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">TikTok</p>
              <p>{commande.is_tiktok ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_cdiscount ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">Cdiscount</p>
              <p>{commande.is_cdiscount ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_docmorris ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">DocMorris</p>
              <p>{commande.is_docmorris ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_lcdp ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">LCDP</p>
              <p>{commande.is_lcdp ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_shein ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">Shein</p>
              <p>{commande.is_shein ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_izyshop ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">IzyShop</p>
              <p>{commande.is_izyshop ? "Oui" : "Non"}</p>
            </div>
            <div
              className={`p-4 rounded-lg border ${commande.is_other_marketplaces ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
            >
              <p className="font-medium">Autres marketplaces</p>
              <p>{commande.is_other_marketplaces ? "Oui" : "Non"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Articles commandés</CardTitle>
          <CardDescription>Liste des produits de la commande</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commande.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md bg-muted">
                      {item.image_url ? (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.reference}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(
                      item.unit_price,
                    )}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.currency }).format(
                      item.unit_price * item.quantity,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
