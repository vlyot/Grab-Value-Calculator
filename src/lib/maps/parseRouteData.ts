import { MapsApiError, type AutoPopulatedFields } from './types'

export function parseRouteData(
  driving: google.maps.DirectionsResult,
  transit: google.maps.DirectionsResult,
): AutoPopulatedFields {
  const drivingLeg = driving.routes?.[0]?.legs?.[0]
  const transitLeg = transit.routes?.[0]?.legs?.[0]

  if (!drivingLeg || !transitLeg) {
    throw new MapsApiError('UNKNOWN_ERROR', 'Unexpected API response shape: missing routes or legs')
  }

  // Driving fields
  const grabDistanceKm = Math.round((drivingLeg.distance!.value / 1000) * 10) / 10
  const grabEtaMins = Math.round(drivingLeg.duration!.value / 60)

  // Transit total time
  const transitTimeMins = Math.round(transitLeg.duration!.value / 60)

  const steps = transitLeg.steps ?? []

  // Sum walking metres across all WALKING steps
  const transitWalkingMetres = steps
    .filter(s => s.travel_mode === 'WALKING')
    .reduce((sum, s) => sum + (s.distance?.value ?? 0), 0)

  // Transfer count = number of TRANSIT steps - 1 (min 0)
  const transitStepCount = steps.filter(s => s.travel_mode === 'TRANSIT').length
  const transitTransfers = Math.max(0, transitStepCount - 1)

  // Waiting time = total - walking time - transit ride time (residual method)
  const totalSecs = transitLeg.duration!.value
  const walkingSecs = steps
    .filter(s => s.travel_mode === 'WALKING')
    .reduce((sum, s) => sum + (s.duration?.value ?? 0), 0)
  const transitRideSecs = steps
    .filter(s => s.travel_mode === 'TRANSIT')
    .reduce((sum, s) => sum + (s.duration?.value ?? 0), 0)
  const transitWaitingMins = Math.max(0, Math.round((totalSecs - walkingSecs - transitRideSecs) / 60))

  return {
    grabDistanceKm,
    grabEtaMins,
    transitTimeMins,
    transitWalkingMetres,
    transitWaitingMins,
    transitTransfers,
  }
}
