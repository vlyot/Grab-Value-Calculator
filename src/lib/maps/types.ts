export type MapsApiErrorCode =
  | 'NOT_FOUND'
  | 'ZERO_RESULTS'
  | 'MAX_WAYPOINTS_EXCEEDED'
  | 'INVALID_REQUEST'
  | 'REQUEST_DENIED'
  | 'OVER_DAILY_LIMIT'
  | 'OVER_QUERY_LIMIT'
  | 'UNKNOWN_ERROR'
  | 'LOAD_FAILED'

export class MapsApiError extends Error {
  constructor(
    public readonly code: MapsApiErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'MapsApiError'
  }
}

export interface AutoPopulatedFields {
  grabDistanceKm: number
  grabEtaMins: number
  transitTimeMins: number
  transitWalkingMetres: number
  transitWaitingMins: number
  transitTransfers: number
}
