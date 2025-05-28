"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart,
  Package,
  Users,
  ShoppingBag,
  Home,
  TrendingUp,
  BarChart,
  Globe,
  ChevronDown,
  ChevronRight,
  Search,
  History,
  SearchX,
  Award,
  Gift,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

const routes = [
  {
    label: "Accueil",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "Gestion",
    links: [
      {
        label: "Produits",
        href: "/produits",
        icon: Package,
      },
      {
        label: "Commandes",
        href: "/commandes",
        icon: ShoppingCart,
      },
      {
        label: "Clients",
        href: "/clients",
        icon: Users,
      },
      {
        label: "Paniers",
        href: "/paniers",
        icon: ShoppingBag,
      },
      {
        label: "Sites",
        href: "/sites",
        icon: Globe,
      },
      {
        label: "Recherche",
        href: "/recherche",
        icon: Search,
      },
      {
        label: "Recherche sans résultats",
        href: "/recherche-sans-resultats",
        icon: SearchX,
      },
      {
        label: "Historique produits",
        href: "/historique-produits",
        icon: History,
      },
    ],
  },
  {
    title: "Statistiques",
    links: [
      {
        label: "Analyse des ventes",
        href: "/analyse-ca",
        icon: BarChart,
      },
      {
        label: "Analyse des produits",
        href: "/statistiques",
        icon: TrendingUp,
      },
      {
        label: "Analyse de la recherche",
        href: "/analyse-recherche",
        icon: Search,
      },
      {
        label: "Analyse évolutive des produits",
        href: "/analyse-produits",
        icon: History,
      },
      {
        label: "Analyse des offres gagnantes",
        href: "/analyse-offres-gagnantes",
        icon: Award,
      },
    ],
  },
  {
    title: "Metrics",
    links: [],
  },
  {
    title: "Automation",
    links: [
      {
        label: "Relance Paniers",
        href: "/automation/relance-paniers",
        icon: ShoppingBag,
      },
      {
        label: "Anniversaire",
        href: "/automation/anniversaire",
        icon: Gift,
      },
      {
        label: "Newsletter",
        href: "/automation/newsletter",
        icon: Mail,
      },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    Gestion: true,
    Statistiques: true,
    Metrics: true,
    Automation: true,
  })

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-10">
          <h1 className="text-2xl font-bold">
            Dashboard <span className="text-primary">E-commerce</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            if (route.title) {
              return (
                <div key={route.title} className="mb-2">
                  <button
                    onClick={() => toggleSection(route.title!)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                  >
                    <span>{route.title === "Automation" ? "Emails" : route.title}</span>
                    {openSections[route.title!] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  {openSections[route.title!] && (
                    <div className="mt-1 ml-2 space-y-1">
                      {route.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition",
                            pathname === link.href || pathname.startsWith(`${link.href}/`)
                              ? "bg-slate-100 dark:bg-slate-800 text-primary"
                              : "text-slate-600 dark:text-slate-300",
                          )}
                        >
                          <div className="flex items-center flex-1">
                            <link.icon className={cn("h-5 w-5 mr-3")} />
                            {link.label || link.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition",
                  pathname === route.href || pathname.startsWith(`${route.href}/`)
                    ? "bg-slate-100 dark:bg-slate-800 text-primary"
                    : "text-slate-600 dark:text-slate-300",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
