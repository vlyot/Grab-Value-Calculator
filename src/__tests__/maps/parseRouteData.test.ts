import { describe, it, expect } from 'vitest'
import { parseRouteData } from '@/lib/maps/parseRouteData'
import { MapsApiError } from '@/lib/maps/types'

// Helpers to build minimal mock DirectionsResult shapes
function makeDrivingResult(distanceMetres: number, durationSecs: number): google.maps.DirectionsResult {
  return {
    routes: [{
      legs: [{
        distance: { value: distanceMetres, text: '' },
        duration: { value: durationSecs, text: '' },
        steps: [],
      }],
    }],
  } as unknown as google.maps.DirectionsResult
}

function makeStep(mode: 'WALKING' | 'TRANSIT', distanceM: number, durationSecs: number) {
  return {
    travel_mode: mode,
    distance: { value: distanceM, text: '' },
    duration: { value: durationSecs, text: '' },
  }
}

function makeTransitResult(
  totalSecs: number,
  steps: ReturnType<typeof makeStep>[],
): google.maps.DirectionsResult {
  return {
    routes: [{
      legs: [{
        distance: { value: 0, text: '' },
        duration: { value: totalSecs, text: '' },
        steps,
      }],
    }],
  } as unknown as google.maps.DirectionsResult
}

describe('parseRouteData', () => {
  it('extracts grabDistanceKm from driving legs distance', () => {
    const driving = makeDrivingResult(5400, 900)
    const transit = makeTransitResult(1800, [makeStep('TRANSIT', 5000, 1500)])
    const result = parseRouteData(driving, transit)
    expect(result.grabDistanceKm).toBe(5.4)
  })

  it('extracts grabEtaMins from driving legs duration', () => {
    const driving = makeDrivingResult(5000, 930) // 15.5 min → rounds to 16
    const transit = makeTransitResult(1800, [makeStep('TRANSIT', 5000, 1500)])
    const result = parseRouteData(driving, transit)
    expect(result.grabEtaMins).toBe(16)
  })

  it('extracts transitTimeMins from transit legs duration', () => {
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(2700, [makeStep('TRANSIT', 5000, 2400)])
    const result = parseRouteData(driving, transit)
    expect(result.transitTimeMins).toBe(45)
  })

  it('sums walking metres across all WALKING steps', () => {
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(2700, [
      makeStep('WALKING', 300, 240),
      makeStep('TRANSIT', 4000, 1800),
      makeStep('WALKING', 250, 180),
    ])
    const result = parseRouteData(driving, transit)
    expect(result.transitWalkingMetres).toBe(550)
  })

  it('computes transitTransfers as TRANSIT steps minus one', () => {
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(3600, [
      makeStep('WALKING', 200, 150),
      makeStep('TRANSIT', 2000, 1200),
      makeStep('WALKING', 100, 90),
      makeStep('TRANSIT', 3000, 1500),
      makeStep('WALKING', 150, 120),
    ])
    const result = parseRouteData(driving, transit)
    expect(result.transitTransfers).toBe(1)
  })

  it('clamps transitTransfers to 0 for single transit step', () => {
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(1800, [
      makeStep('WALKING', 200, 150),
      makeStep('TRANSIT', 5000, 1500),
      makeStep('WALKING', 100, 90),
    ])
    const result = parseRouteData(driving, transit)
    expect(result.transitTransfers).toBe(0)
  })

  it('derives transitWaitingMins via residual method', () => {
    // total=30min, walk=3min, ride=20min → wait=7min
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(1800, [
      makeStep('WALKING', 300, 180),   // 3 min walk
      makeStep('TRANSIT', 5000, 1200), // 20 min ride
    ])
    const result = parseRouteData(driving, transit)
    // total=1800s, walk=180s, ride=1200s → wait=420s=7min
    expect(result.transitWaitingMins).toBe(7)
  })

  it('clamps transitWaitingMins to 0 on negative residual', () => {
    const driving = makeDrivingResult(5000, 900)
    // walk+ride exceed total (edge case from rounding)
    const transit = makeTransitResult(1000, [
      makeStep('WALKING', 300, 600),
      makeStep('TRANSIT', 5000, 600),
    ])
    const result = parseRouteData(driving, transit)
    expect(result.transitWaitingMins).toBe(0)
  })

  it('throws MapsApiError when routes array is empty', () => {
    const driving = { routes: [] } as unknown as google.maps.DirectionsResult
    const transit = makeTransitResult(1800, [])
    expect(() => parseRouteData(driving, transit)).toThrow(MapsApiError)
  })

  it('throws MapsApiError when legs array is missing', () => {
    const driving = { routes: [{}] } as unknown as google.maps.DirectionsResult
    const transit = makeTransitResult(1800, [])
    expect(() => parseRouteData(driving, transit)).toThrow(MapsApiError)
  })

  it('returns 0 transitWalkingMetres when no WALKING steps exist', () => {
    const driving = makeDrivingResult(5000, 900)
    const transit = makeTransitResult(1800, [makeStep('TRANSIT', 5000, 1500)])
    const result = parseRouteData(driving, transit)
    expect(result.transitWalkingMetres).toBe(0)
  })
})
