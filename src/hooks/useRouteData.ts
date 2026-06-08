import { useState, useCallback } from 'react'
import { fetchBothRoutes } from '@/lib/maps/directions'
import { parseRouteData } from '@/lib/maps/parseRouteData'
import { MapsApiError } from '@/lib/maps/types'
import type { CalculatorInputs } from '@/types/calculator'

export type RouteDataStatus = 'idle' | 'loading' | 'success' | 'error'

type SetFieldFn = (field: keyof CalculatorInputs, value: string | number | boolean) => void

export function useRouteData(setField: SetFieldFn) {
  const [status, setStatus] = useState<RouteDataStatus>('idle')
  const [error, setError] = useState<MapsApiError | null>(null)

  const fetchRouteData = useCallback(
    async (origin: string, destination: string) => {
      setStatus('loading')
      setError(null)
      try {
        const { driving, transit } = await fetchBothRoutes(origin, destination)
        const fields = parseRouteData(driving, transit)
        setField('grabDistanceKm', fields.grabDistanceKm)
        setField('grabEtaMins', fields.grabEtaMins)
        setField('transitTimeMins', fields.transitTimeMins)
        setField('transitWalkingMetres', fields.transitWalkingMetres)
        setField('transitWaitingMins', fields.transitWaitingMins)
        setField('transitTransfers', fields.transitTransfers)
        setStatus('success')
      } catch (err) {
        const mapsError =
          err instanceof MapsApiError
            ? err
            : new MapsApiError('UNKNOWN_ERROR', 'An unexpected error occurred')
        setError(mapsError)
        setStatus('error')
      }
    },
    [setField],
  )

  const clearRouteError = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return { status, error, fetchRouteData, clearRouteError }
}
