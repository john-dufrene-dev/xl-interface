"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Calendar, ShoppingBag, Package, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

// Types
type ClientDetail = {
  id: string
  id_contact: string
  company: string | null
  siret: string | null
  ape: string | null
  firstname: string
  lastname: string
  email: string
  birthday: string | null
  newsletter: boolean
  optin: boolean
  website: string | null
  created_at: string
  updated_at: string
  phonenumber: string
  address: string
  zip: string
  city: string
  country: string
  state: string | null
  civility: string | null
  id_site: string
}

type CommandeClient = {
  id: string
  reference: string
  total_paid: number
  current_state: string
  created_at: string
}

// 1. Ajouter un type PanierClient

type PanierClient = {
  id: string
  date: string
  transporteur: string
  total: number
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [commandes, setCommandes] = useState<CommandeClient[]>([])
  const [loading, setLoading] = useState(true)

  // 2. Ajouter un état pour les paniers et simuler des données
  const [paniers, setPaniers] = useState<PanierClient[]>([])

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

  // Simuler le chargement des données
  useEffect(() => {
    // Dans un cas réel, vous feriez un appel API ici
    setTimeout(() => {
      setClient({
        id: id,
        id_contact: "CONT456",
        company: "Entreprise ABC",
        siret: "12345678901234",
        ape: "5829C",
        firstname: "Jean",
        lastname: "Dupont",
        email: "jean.dupont@example.com",
        birthday: "1983-04-12",
        newsletter: true,
        optin: true,
        website: "www.entreprise-abc.com",
        created_at: "2023-05-15T10:30:00",
        updated_at: "2023-05-15T10:35:00",
        phonenumber: "01 23 45 67 89",
        address: "123 Rue de Paris",
        zip: "75001",
        city: "Paris",
        country: "France",
        state: "Ile-de-France",
        civility: "M.",
        id_site: "1",
      })

      setCommandes([
        {
          id: "1",
          reference: "REF-A123",
          total_paid: 129.99,
          current_state: "payé",
          created_at: "2023-05-15T10:30:00",
        },
        {
          id: "2",
          reference: "REF-B456",
          total_paid: 249.5,
          current_state: "expédié",
          created_at: "2023-04-20T14:20:00",
        },
        {
          id: "3",
          reference: "REF-C789",
          total_paid: 75.0,
          current_state: "livré",
          created_at: "2023-03-13T09:15:00",
        },
      ])

      setPaniers([
        {
          id: "936214",
          date: "2025-07-09 15:24:07",
          transporteur: "Livraison Mondial Relay",
          total: 21.32,
        },
      ])

      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Chargement du profil client...</h3>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium">Client non trouvé</h3>
          <Button variant="link" onClick={() => router.push("/clients")} className="mt-2">
            Retour à la liste des clients
          </Button>
        </div>
      </div>
    )
  }

  // 3. Réorganisation du rendu principal

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.push("/clients")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {client.civility} {client.firstname} {client.lastname}
          </h1>
          <p className="text-muted-foreground">
            Client depuis le {format(new Date(client.created_at), "dd MMMM yyyy", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Colonne Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <span><b>Titre de civilité :</b> {client.civility}</span>
              <span><b>Âge :</b> {client.birthday ? `${new Date().getFullYear() - new Date(client.birthday).getFullYear()} ans (${format(new Date(client.birthday), "dd/MM/yyyy")})` : "—"}</span>
              <span><b>Date d'inscription :</b> {format(new Date(client.created_at), "dd/MM/yyyy", { locale: fr })}</span>
              <span><b>Dernière visite :</b> 10/07/2025</span>
              <span><b>Place parmi les meilleurs clients :</b> 5ème</span>
              <span><b>Langue :</b> Français</span>
              <span><b>Newsletter :</b> <Badge variant="outline" className={client.newsletter && client.optin ? "bg-green-100 text-green-800 px-2 py-0.5 text-xs w-fit" : "bg-red-100 text-red-800 px-2 py-0.5 text-xs w-fit"}>{client.newsletter && client.optin ? "Oui" : "Non"}</Badge></span>
              <span><b>Dernière mise à jour :</b> {format(new Date(client.updated_at), "dd/MM/yyyy", { locale: fr })}</span>
              <span><b>Actif :</b> <Badge variant="outline" className={true ? "bg-green-100 text-green-800 px-2 py-0.5 text-xs w-fit" : "bg-red-100 text-red-800 px-2 py-0.5 text-xs w-fit"}>Oui</Badge></span>
            </div>
          </CardContent>
        </Card>
        {/* Colonne Adresse */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-1">
              <span><b>Client :</b> Jean Dupont</span>
              <span><b>Numéro d'identification fiscale :</b> FR12345678901</span>
              <span><b>Alias de l'adresse :</b> Bureau principal</span>
              <span><b>Prénom :</b> Jean</span>
              <span><b>Nom :</b> Dupont</span>
              <span><b>Société :</b> Entreprise ABC</span>
              <span><b>Numéro de TVA :</b> FR12345678901</span>
              <span><b>Adresse :</b> 123 Rue de Paris</span>
              <span><b>Adresse (2) :</b> 2ème étage</span>
              <span><b>Code postal :</b> 75001</span>
              <span><b>Ville :</b> Paris</span>
              <span><b>Pays :</b> France</span>
              <span><b>Téléphone :</b> 01 23 45 67 89</span>
              <span><b>Téléphone mobile :</b> 06 12 34 56 78</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
          <CardDescription>
            <span className="mr-4">Commandes valides : <Badge className="bg-green-100 text-green-800">{commandes.length}</Badge> pour un montant total de <b>{commandes.length > 0 ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(commandes.reduce((acc, c) => acc + c.total_paid, 0)) : "0 €"}</b></span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead>Total payé</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell>{commande.id}</TableCell>
                  <TableCell>{format(new Date(commande.created_at), "dd/MM/yyyy", { locale: fr })}</TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(commande.current_state)}>
                      {commande.current_state.charAt(0).toUpperCase() + commande.current_state.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(commande.total_paid)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Package className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section Paniers */}
      <Card>
        <CardHeader>
          <CardTitle>Paniers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transporteur</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paniers.map((panier) => (
                <TableRow key={panier.id}>
                  <TableCell>{panier.id}</TableCell>
                  <TableCell>{panier.date}</TableCell>
                  <TableCell>{panier.transporteur}</TableCell>
                  <TableCell>{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(panier.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Package className="h-4 w-4" />
                    </Button>
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
