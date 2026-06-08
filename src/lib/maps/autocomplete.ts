import { loadMapsApi } from './loader'

export interface PlaceSuggestion {
  placeId: string
  description: string
}

const SE_ASIA_REGION_CODES = ['SG', 'MY', 'TH', 'ID', 'PH', 'VN']

export async function getPlacePredictions(
  input: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return []

  try {
    await loadMapsApi()
    const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

    const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      sessionToken,
      includedRegionCodes: SE_ASIA_REGION_CODES,
    })

    return response.suggestions
      .map(s => s.placePrediction)
      .filter((p): p is google.maps.places.PlacePrediction => p !== null)
      .map(p => ({
        placeId: p.placeId,
        description: p.text.text,
      }))
  } catch {
    return []
  }
}

export function createSessionToken(): google.maps.places.AutocompleteSessionToken {
  return new google.maps.places.AutocompleteSessionToken()
}
