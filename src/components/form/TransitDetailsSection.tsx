import { MapPinIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  isInt = false,
}: {
  id: string
  label: string
  value: number
  error?: string
  onChange: (val: number) => void
  autoFilled: boolean
  step: string
  placeholder: string
  isInt?: boolean
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
        onChange={e =>
          onChange(isInt ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)
        }
        aria-invalid={!!error}
        className={cn(autoFilled && 'bg-emerald-50/50')}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export function TransitDetailsSection({ inputs, errors, setField, routeStatus }: Props) {
  const autoFilled = routeStatus === 'success'

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Transit Alternative</h2>
      <p className="text-xs text-gray-400">
        {autoFilled
          ? 'Transit details auto-filled from Maps transit directions'
          : 'Select pickup and dropoff to auto-fill transit details'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AutoFilledInput
          id="transitTimeMins"
          label="Total transit time (mins)"
          value={inputs.transitTimeMins}
          error={errors.transitTimeMins}
          onChange={val => setField('transitTimeMins', val)}
          autoFilled={autoFilled}
          step="1"
          placeholder="e.g. 35"
        />

        <AutoFilledInput
          id="transitWalkingMetres"
          label="Walking distance (m)"
          value={inputs.transitWalkingMetres}
          error={errors.transitWalkingMetres}
          onChange={val => setField('transitWalkingMetres', val)}
          autoFilled={autoFilled}
          step="10"
          placeholder="e.g. 650"
        />

        <AutoFilledInput
          id="transitWaitingMins"
          label="Waiting time (mins)"
          value={inputs.transitWaitingMins}
          error={errors.transitWaitingMins}
          onChange={val => setField('transitWaitingMins', val)}
          autoFilled={autoFilled}
          step="1"
          placeholder="e.g. 8"
        />

        <AutoFilledInput
          id="transitTransfers"
          label="Number of transfers"
          value={inputs.transitTransfers}
          error={errors.transitTransfers}
          onChange={val => setField('transitTransfers', val)}
          autoFilled={autoFilled}
          step="1"
          placeholder="e.g. 1"
          isInt
        />
      </div>
    </div>
  )
}
