import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import clsx from "clsx"

interface ReductionConfigProps {
  actif: boolean
  montant: number
  type: "pourcentage" | "euro"
  duree: number
  onActifChange: (checked: boolean) => void
  onMontantChange: (val: number) => void
  onTypeChange: (val: "pourcentage" | "euro") => void
  onDureeChange: (val: number) => void
  className?: string
}

export function ReductionConfig({
  actif,
  montant,
  type,
  duree,
  onActifChange,
  onMontantChange,
  onTypeChange,
  onDureeChange,
  className,
}: ReductionConfigProps) {
  return (
    <div className={clsx("p-6 bg-white rounded-lg border", className)}>
      <div className="flex items-center mb-6">
        <Switch id="bonReductionActif" checked={actif} onCheckedChange={onActifChange} />
        <Label htmlFor="bonReductionActif" className="ml-3 text-lg font-medium">
          Activer le bon de réduction
        </Label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="montantReduction">Montant de la réduction</Label>
          <Input
            id="montantReduction"
            type="number"
            min="1"
            value={montant}
            onChange={e => onMontantChange(Number.parseInt(e.target.value))}
            className="w-full"
            disabled={!actif}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="typeReduction">Type de réduction</Label>
          <Select value={type} onValueChange={onTypeChange} disabled={!actif}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pourcentage">Pourcentage (%)</SelectItem>
              <SelectItem value="euro">Montant (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dureeValidite">Durée de validité (jours)</Label>
          <Input
            id="dureeValidite"
            type="number"
            min="1"
            value={duree}
            onChange={e => onDureeChange(Number.parseInt(e.target.value))}
            className="w-full"
            disabled={!actif}
          />
        </div>
      </div>
    </div>
  )
} 