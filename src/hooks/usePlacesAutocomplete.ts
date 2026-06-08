import { useState, useRef, useCallback, useEffect } from 'react'
import { getPlacePredictions, createSessionToken, type PlaceSuggestion } from '@/lib/maps/autocomplete'
import { loadMapsApi } from '@/lib/maps/loader'

const DEBOUNCE_MS = 300

export function usePlacesAutocomplete(countryCodes: string[] = ['SG']) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mapsReadyRef = useRef(false)

  useEffect(() => {
    loadMapsApi()
      .then(() => {
        mapsReadyRef.current = true
        sessionTokenRef.current = createSessionToken()
      })
      .catch(() => {})
  }, [])

  const resetSession = useCallback(() => {
    if (mapsReadyRef.current) {
      sessionTokenRef.current = createSessionToken()
    }
  }, [])

  const countryCodesRef = useRef(countryCodes)
  countryCodesRef.current = countryCodes

  const handleInputChange = useCallback((value: string) => {
    setQuery(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (!value.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      if (!mapsReadyRef.current) {
        await loadMapsApi().catch(() => null)
      }
      if (!sessionTokenRef.current) return
      const predictions = await getPlacePredictions(value, sessionTokenRef.current, countryCodesRef.current)
      setSuggestions(predictions)
      setIsOpen(predictions.length > 0)
    }, DEBOUNCE_MS)
  }, [])

  const handleSelect = useCallback(
    (suggestion: PlaceSuggestion) => {
      setQuery(suggestion.description)
      setSuggestions([])
      setIsOpen(false)
      resetSession()
    },
    [resetSession],
  )

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    query,
    suggestions,
    isOpen,
    handleInputChange,
    handleSelect,
    closeDropdown,
    resetSession,
  }
}
