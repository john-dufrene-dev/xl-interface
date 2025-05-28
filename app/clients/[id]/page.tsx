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

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [commandes, setCommandes] = useState<CommandeClient[]>([])
  const [loading, setLoading] = useState(true)

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
        id: params.id,
        id_contact: "CONT456",
        company: "Entreprise ABC",
        siret: "12345678901234",
        ape: "5829C",
        firstname: "Jean",
        lastname: "Dupont",
        email: "jean.dupont@example.com",
        birthday: "1985-06-15",
        newsletter: true,
        optin: true,
        website: "www.example.com",
        created_at: "2023-05-15T10:30:00",
        updated_at: "2023-05-15T10:35:00",
        phonenumber: "01 23 45 67 89",
        address: "123 Rue de Paris",
        zip: "75001",
        city: "Paris",
        country: "France",
        state: null,
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

      setLoading(false)
    }, 500)
  }, [params.id])

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

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Coordonnées et préférences du client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {client.civility} {client.firstname} {client.lastname}
                  </span>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{client.phonenumber}</span>
                </div>

                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Site {client.id_site}</span>
                </div>

                {client.birthday && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Né(e) le {format(new Date(client.birthday), "dd MMMM yyyy", { locale: fr })}</span>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex items-center mb-2">
                    <Badge
                      variant="outline"
                      className={client.newsletter ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {client.newsletter ? "Inscrit à la newsletter" : "Non inscrit à la newsletter"}
                    </Badge>
                  </div>

                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={client.optin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {client.optin
                        ? "Accepte les communications marketing"
                        : "N'accepte pas les communications marketing"}
                    </Badge>
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

            <Card>
              <CardHeader>
                <CardTitle>Adresse</CardTitle>
                <CardDescription>Adresse de facturation et livraison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <p>{client.address}</p>
                    <p>
                      {client.zip} {client.city}
                    </p>
                    <p>{client.country}</p>
                  </div>
                </div>

                {client.company && (
                  <div className="pt-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{client.company}</span>
                    </div>

                    {client.siret && (
                      <div className="ml-6 mt-1">
                        <p>SIRET: {client.siret}</p>
                      </div>
                    )}

                    {client.ape && (
                      <div className="ml-6 mt-1">
                        <p>Code APE: {client.ape}</p>
                      </div>
                    )}

                    {client.website && (
                      <div className="ml-6 mt-1">
                        <p>Site web: {client.website}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exporter CSV
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
              <CardDescription>Liste des commandes passées par ce client</CardDescription>
            </CardHeader>
            <CardContent>
              {commandes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commandes.map((commande) => (
                      <TableRow key={commande.id}>
                        <TableCell className="font-medium">{commande.reference}</TableCell>
                        <TableCell>{format(new Date(commande.created_at), "dd/MM/yyyy", { locale: fr })}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(commande.current_state)}`}>
                            {commande.current_state.charAt(0).toUpperCase() + commande.current_state.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                            commande.total_paid,
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/commandes/${commande.id}`)}>
                            <Package className="mr-2 h-4 w-4" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Aucune commande</h3>
                  <p className="text-muted-foreground">Ce client n'a pas encore passé de commande.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
