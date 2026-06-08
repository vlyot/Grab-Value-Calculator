import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { MapsApiError } from './types'

let initialized = false
let loadPromise: Promise<typeof google.maps> | null = null

export function loadMapsApi(): Promise<typeof google.maps> {
  if (loadPromise) return loadPromise

  if (!initialized) {
    setOptions({
      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      v: 'weekly',
    })
    initialized = true
  }

  // Load both maps and places libraries together
  loadPromise = Promise.all([importLibrary('maps'), importLibrary('places')])
    .then(() => google.maps)
    .catch((err: unknown) => {
      loadPromise = null
      throw new MapsApiError(
        'LOAD_FAILED',
        `Failed to load Google Maps SDK: ${err instanceof Error ? err.message : String(err)}`,
      )
    })

  return loadPromise
}
