"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, ShoppingCart, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
type PanierItem = {
  id: string
  id_cart: string
  id_product: string
  name: string
  price: number
  quantity: number
  reference: string
  price_ht: number
  price_ttc: number
  tva: number
  image_url: string
}

type PanierDetail = {
  id: string
  id_cart: string
  id_contact: string
  amount: number
  total_products: number
  total_paid_tax_excl: number
  total_products_wt: number
  total_tax_vat: number
  created_at: string
  updated_at: string
  id_site: string
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
  items: PanierItem[]
}

export default function PanierDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [panier, setPanier] = useState<PanierDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Simuler le chargement des données
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setPanier({
        id: params.id,
        id_cart: "CART123",
        id_contact: "CONT456",
        amount: 129.99,
        total_products: 129.99,
        total_paid_tax_excl: 108.33,
        total_products_wt: 129.99,
        total_tax_vat: 21.66,
        created_at: "2023-05-15T10:30:00",
        updated_at: "2023-05-15T10:35:00",
        id_site: "1",
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
            id_cart: "CART123",
            id_product: "PROD789",
            name: "Smartphone XYZ",
            price: 99.99,
            quantity: 1,
            reference: "REF-S123",
            price_ht: 83.33,
            price_ttc: 99.99,
            tva: 20,
            image_url: "/placeholder.svg",
          },
          {
            id: "2",
            id_cart: "CART123",
            id_product: "PROD456",
            name: "Coque de protection",
            price: 15.0,
            quantity: 2,
            reference: "REF-C456",
            price_ht: 12.5,
            price_ttc: 15.0,
            tva: 20,
            image_url: "/placeholder.svg",
          },
        ],
      })
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Chargement du panier...</h3>
        </div>
      </div>
    )
  }

  if (!panier) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Panier non trouvé</h3>
          <Button variant="link" onClick={() => router.push("/paniers")} className="mt-2">
            Retour à la liste des paniers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/paniers")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panier #{panier.id_cart}</h1>
          <p className="text-muted-foreground">
            Créé le {format(new Date(panier.created_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du client</CardTitle>
            <CardDescription>Détails du contact associé au panier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p>
                {panier.contact.firstname} {panier.contact.lastname}
              </p>
              <p>{panier.contact.email}</p>
              <p>{panier.contact.phonenumber}</p>
            </div>

            {panier.contact.company && (
              <div>
                <h3 className="font-semibold">Entreprise</h3>
                <p>{panier.contact.company}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p>{panier.contact.address}</p>
              <p>
                {panier.contact.zip} {panier.contact.city}
              </p>
              <p>{panier.contact.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résumé du panier</CardTitle>
            <CardDescription>Montants et informations de paiement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total produits (HT)</span>
              <span>
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                  panier.total_paid_tax_excl,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(panier.total_tax_vat)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total (TTC)</span>
              <span>
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(panier.amount)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles du panier</CardTitle>
          <CardDescription>Liste des produits ajoutés au panier</CardDescription>
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
              {panier.items.map((item) => (
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
                          <ShoppingCart className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.reference}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(item.price)}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                      item.price * item.quantity,
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
