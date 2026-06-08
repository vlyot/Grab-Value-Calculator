import { MapPinIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CalculatorInputs } from '@/types/calculator'
import type { RouteDataStatus } from '@/hooks/useRouteData'
import { cn } from '@/lib/utils'

interface Props {
  inputs: CalculatorInputs
  errors: Partial<Record<keyof CalculatorInputs, string>>
  setField: (field: keyof CalculatorInputs, value: string | number | boolean) => void
  routeStatus: RouteDataStatus
}

function AutoFilledInput({
  id,
  label,
  value,
  error,
  onChange,
  autoFilled,
  step,
  placeholder,
}: {
  id: string
  label: string
  value: number
  error?: string
  onChange: (val: number) => void
  autoFilled: boolean
  step: string
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        {autoFilled && (
          <MapPinIcon className="h-3 w-3 text-emerald-500" aria-label="Auto-filled from Maps" />
        )}
      </div>
      <Input
        id={id}
        type="number"
        min="0"
        step={step}
        placeholder={placeholder}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        aria-invalid={!!error}
        className={cn(autoFilled && 'bg-emerald-50/50')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function GrabDetailsSection({ inputs, errors, setField, routeStatus }: Props) {
  const autoFilled = routeStatus === 'success'

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Grab Details</h2>
      <p className="text-xs text-gray-400">
        {autoFilled
          ? 'Distance and ETA auto-filled from Maps — enter your fare below'
          : 'Enter fare, then select pickup and dropoff to auto-fill distance & ETA'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="grabFare">Fare (SGD)</Label>
          <Input
            id="grabFare"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 12.50"
            value={inputs.grabFare || ''}
            onChange={e => setField('grabFare', parseFloat(e.target.value) || 0)}
            aria-invalid={!!errors.grabFare}
          />
          {errors.grabFare && (
            <p className="text-xs text-red-500">{errors.grabFare}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="partySize">Party size</Label>
          <Select
            value={String(inputs.partySize)}
            onValueChange={val => setField('partySize', parseInt(val))}
          >
            <SelectTrigger id="partySize" className="w-full">
              <SelectValue placeholder="Select party size" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? 'person' : 'people'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.partySize && (
            <p className="text-xs text-red-500">{errors.partySize}</p>
          )}
        </div>

        <AutoFilledInput
          id="grabDistanceKm"
          label="Route distance (km)"
          value={inputs.grabDistanceKm}
          error={errors.grabDistanceKm}
          onChange={val => setField('grabDistanceKm', val)}
          autoFilled={autoFilled}
          step="0.1"
          placeholder="e.g. 5.2"
        />

        <AutoFilledInput
          id="grabEtaMins"
          label="ETA (mins)"
          value={inputs.grabEtaMins}
          error={errors.grabEtaMins}
          onChange={val => setField('grabEtaMins', val)}
          autoFilled={autoFilled}
          step="1"
          placeholder="e.g. 15"
        />
      </div>
    </div>
  )
}
