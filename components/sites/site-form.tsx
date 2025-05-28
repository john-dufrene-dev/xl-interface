"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

// Types
type SiteFormData = {
  name: string
  url: string
  api_key: string
  status: "active" | "inactive" | "maintenance"
}

type SiteFormProps = {
  initialData?: SiteFormData
  onSubmit: (data: SiteFormData) => void
  onCancel: () => void
}

export function SiteForm({ initialData, onSubmit, onCancel }: SiteFormProps) {
  const [formData, setFormData] = useState<SiteFormData>(
    initialData || {
      name: "",
      url: "",
      api_key: "",
      status: "active",
    },
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof SiteFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Effacer l'erreur si le champ est rempli
    if (value && errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du site est requis"
    }

    if (!formData.url.trim()) {
      newErrors.url = "L'URL du site est requise"
    } else if (!/^https?:\/\/\S+$/.test(formData.url)) {
      newErrors.url = "L'URL doit commencer par http:// ou https://"
    }

    if (!formData.api_key.trim()) {
      newErrors.api_key = "La clé API est requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom du site</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Entrez le nom du site"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="url">URL du site</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://www.exemple.com"
          />
          {errors.url && <p className="text-sm text-red-500">{errors.url}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="api_key">Clé API</Label>
          <Input
            id="api_key"
            value={formData.api_key}
            onChange={(e) => handleChange("api_key", e.target.value)}
            placeholder="Entrez la clé API"
          />
          {errors.api_key && <p className="text-sm text-red-500">{errors.api_key}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value as "active" | "inactive" | "maintenance")}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionnez un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </DialogFooter>
    </form>
  )
}
