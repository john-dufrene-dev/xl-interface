export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre dashboard de gestion e-commerce</p>
      </div>

      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Bienvenue sur votre plateforme de gestion</h2>
          <p className="text-muted-foreground">
            Utilisez la barre de navigation à gauche pour accéder aux différentes sections de votre dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
