import { useRef } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { LocationAutocomplete } from './LocationAutocomplete'
import type { CalculatorInputs } from '@/types/calculator'
import type { RouteDataStatus } from '@/hooks/useRouteData'

interface Props {
  inputs: CalculatorInputs
  setField: (field: keyof CalculatorInputs, value: string | number | boolean) => void
  onRouteReady: (origin: string, destination: string) => void
  routeStatus: RouteDataStatus
}

export function TripContextSection({ inputs, setField, onRouteReady, routeStatus }: Props) {
  const confirmedPickup = useRef<string>('')
  const confirmedDropoff = useRef<string>('')

  function tryTriggerFetch() {
    if (confirmedPickup.current && confirmedDropoff.current) {
      onRouteReady(confirmedPickup.current, confirmedDropoff.current)
    }
  }

  function onPickupConfirm(description: string) {
    setField('pickupLocation', description)
    confirmedPickup.current = description
    confirmedDropoff.current = '' // require dropoff re-confirmation to avoid stale pair
    setField('dropoffLocation', '')
    tryTriggerFetch()
  }

  function onDropoffConfirm(description: string) {
    setField('dropoffLocation', description)
    confirmedDropoff.current = description
    tryTriggerFetch()
  }

  const isLoading = routeStatus === 'loading'

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Trip Context</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LocationAutocomplete
          id="pickupLocation"
          label="Pickup location"
          placeholder="e.g. Orchard MRT"
          value={inputs.pickupLocation}
          onConfirm={onPickupConfirm}
          disabled={isLoading}
        />
        <LocationAutocomplete
          id="dropoffLocation"
          label="Dropoff location"
          placeholder="e.g. Marina Bay Sands"
          value={inputs.dropoffLocation}
          onConfirm={onDropoffConfirm}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="isGrabSaver"
          checked={inputs.isGrabSaver}
          onCheckedChange={checked => setField('isGrabSaver', checked)}
        />
        <Label htmlFor="isGrabSaver" className="cursor-pointer">
          Grab Saver
        </Label>
        {inputs.isGrabSaver && (
          <Badge className="bg-green-100 text-green-800 border-green-200">Saver</Badge>
        )}
      </div>
    </div>
  )
}
