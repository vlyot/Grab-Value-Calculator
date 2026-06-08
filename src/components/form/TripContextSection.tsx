import { useRef, useState } from 'react'
import { XIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LocationAutocomplete } from './LocationAutocomplete'
import { Input } from '@/components/ui/input'
import type { CalculatorInputs } from '@/types/calculator'
import type { RouteDataStatus } from '@/hooks/useRouteData'

const COUNTRIES = [
  { code: 'SG', label: 'Singapore' },
  { code: 'MY', label: 'Malaysia' },
  { code: 'TH', label: 'Thailand' },
  { code: 'ID', label: 'Indonesia' },
  { code: 'PH', label: 'Philippines' },
  { code: 'VN', label: 'Vietnam' },
]

interface Props {
  inputs: CalculatorInputs
  setField: (field: keyof CalculatorInputs, value: string | number | boolean) => void
  onRouteReady: (origin: string, destination: string, saverDate?: string, saverTime?: string) => void
  routeStatus: RouteDataStatus
}

export function TripContextSection({ inputs, setField, onRouteReady, routeStatus }: Props) {
  const confirmedPickup = useRef<string>('')
  const confirmedDropoff = useRef<string>('')
  const [countryCode, setCountryCode] = useState('SG')

  function tryTriggerFetch(saverDate?: string, saverTime?: string) {
    if (confirmedPickup.current && confirmedDropoff.current) {
      onRouteReady(confirmedPickup.current, confirmedDropoff.current, saverDate, saverTime)
    }
  }

  function onPickupConfirm(description: string) {
    setField('pickupLocation', description)
    confirmedPickup.current = description
    confirmedDropoff.current = ''
    setField('dropoffLocation', '')
    tryTriggerFetch(inputs.isGrabSaver ? inputs.saverDate : undefined, inputs.isGrabSaver ? inputs.saverTime : undefined)
  }

  function onDropoffConfirm(description: string) {
    setField('dropoffLocation', description)
    confirmedDropoff.current = description
    tryTriggerFetch(inputs.isGrabSaver ? inputs.saverDate : undefined, inputs.isGrabSaver ? inputs.saverTime : undefined)
  }

  function clearLocations() {
    setField('pickupLocation', '')
    setField('dropoffLocation', '')
    confirmedPickup.current = ''
    confirmedDropoff.current = ''
  }

  const hasLocations = !!(inputs.pickupLocation || inputs.dropoffLocation)
  const isLoading = routeStatus === 'loading'
  const countryCodes = [countryCode]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Trip Context</h2>
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger size="sm" className="w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(c => (
              <SelectItem key={c.code} value={c.code} className="text-xs">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LocationAutocomplete
          id="pickupLocation"
          label="Pickup location"
          placeholder="e.g. Orchard MRT"
          value={inputs.pickupLocation}
          onConfirm={onPickupConfirm}
          disabled={isLoading}
          countryCodes={countryCodes}
        />
        <LocationAutocomplete
          id="dropoffLocation"
          label="Dropoff location"
          placeholder="e.g. Marina Bay Sands"
          value={inputs.dropoffLocation}
          onConfirm={onDropoffConfirm}
          disabled={isLoading}
          countryCodes={countryCodes}
        />
      </div>

      {hasLocations && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearLocations}
            disabled={isLoading}
            className="h-7 px-2 text-xs text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-3 w-3 mr-1" />
            Clear locations
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Switch
          id="isGrabSaver"
          checked={inputs.isGrabSaver}
          onCheckedChange={checked => {
            setField('isGrabSaver', checked)
            // Re-fetch with/without saver departure when toggling
            if (checked) {
              tryTriggerFetch(inputs.saverDate, inputs.saverTime)
            } else {
              tryTriggerFetch()
            }
          }}
        />
        <Label htmlFor="isGrabSaver" className="cursor-pointer">
          Grab Saver
        </Label>
        {inputs.isGrabSaver && (
          <Badge className="bg-green-100 text-green-800 border-green-200">Saver</Badge>
        )}
      </div>

      {inputs.isGrabSaver && (
        <div className="rounded-lg border border-dashed border-green-300 bg-green-50/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Saver Schedule</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="saverDate" className="text-xs text-gray-600">
                Date <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                id="saverDate"
                type="date"
                value={inputs.saverDate}
                onChange={e => {
                  const newDate = e.target.value
                  setField('saverDate', newDate)
                  if (newDate && inputs.saverTime) tryTriggerFetch(newDate, inputs.saverTime)
                }}
                className="text-sm h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="saverTime" className="text-xs text-gray-600">
                Time <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                id="saverTime"
                type="time"
                value={inputs.saverTime}
                onChange={e => {
                  const newTime = e.target.value
                  setField('saverTime', newTime)
                  if (inputs.saverDate && newTime) tryTriggerFetch(inputs.saverDate, newTime)
                }}
                className="text-sm h-8"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Sets the departure time for transit comparison. Defaults to now if left empty.
          </p>
        </div>
      )}
    </div>
  )
}
