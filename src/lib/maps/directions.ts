import { loadMapsApi } from './loader'
import { MapsApiError, type MapsApiErrorCode } from './types'

export function nearestHalfHour(): Date {
  const now = new Date()
  const ms = now.getTime()
  const halfHourMs = 30 * 60 * 1000
  return new Date(Math.ceil(ms / halfHourMs) * halfHourMs)
}

function statusToCode(status: string): MapsApiErrorCode {
  const map: Record<string, MapsApiErrorCode> = {
    NOT_FOUND: 'NOT_FOUND',
    ZERO_RESULTS: 'ZERO_RESULTS',
    MAX_WAYPOINTS_EXCEEDED: 'MAX_WAYPOINTS_EXCEEDED',
    INVALID_REQUEST: 'INVALID_REQUEST',
    REQUEST_DENIED: 'REQUEST_DENIED',
    OVER_DAILY_LIMIT: 'OVER_DAILY_LIMIT',
    OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  }
  return map[status] ?? 'UNKNOWN_ERROR'
}

async function routeWithService(
  request: google.maps.DirectionsRequest,
): Promise<google.maps.DirectionsResult> {
  await loadMapsApi()
  const service = new google.maps.DirectionsService()
  return new Promise((resolve, reject) => {
    service.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        resolve(result)
      } else {
        reject(
          new MapsApiError(
            statusToCode(status),
            `Directions API returned ${status}`,
          ),
        )
      }
    })
  })
}

export async function fetchDrivingRoute(
  origin: string,
  destination: string,
): Promise<google.maps.DirectionsResult> {
  return routeWithService({
    origin,
    destination,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  })
}

export async function fetchTransitRoute(
  origin: string,
  destination: string,
): Promise<google.maps.DirectionsResult> {
  return routeWithService({
    origin,
    destination,
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC,
    transitOptions: {
      departureTime: nearestHalfHour(),
      routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS,
    },
  })
}

export async function fetchBothRoutes(
  origin: string,
  destination: string,
): Promise<{ driving: google.maps.DirectionsResult; transit: google.maps.DirectionsResult }> {
  const [driving, transit] = await Promise.all([
    fetchDrivingRoute(origin, destination),
    fetchTransitRoute(origin, destination),
  ])
  return { driving, transit }
}
