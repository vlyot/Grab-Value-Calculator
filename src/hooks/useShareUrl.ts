import { useCallback } from 'react'
import { encodeInputs, decodeInputs, buildShareUrl } from '@/lib/shareUrl'
import type { CalculatorInputs } from '@/types/calculator'

/**
 * Returns:
 *  - `getUrlInputs()` — call once on mount; returns decoded inputs from URL or null
 *  - `updateUrl(inputs)` — push encoded inputs into the address bar (no navigation)
 *  - `copyShareUrl(inputs)` — copies the full share URL to clipboard, returns a promise
 */
export function useShareUrl() {
  const getUrlInputs = useCallback((): CalculatorInputs | null => {
    return decodeInputs(new URLSearchParams(window.location.search))
  }, [])

  const updateUrl = useCallback((inputs: CalculatorInputs) => {
    const params = encodeInputs(inputs)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [])

  const copyShareUrl = useCallback(async (inputs: CalculatorInputs): Promise<void> => {
    const url = buildShareUrl(inputs)
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for environments without clipboard API access
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  }, [])

  return { getUrlInputs, updateUrl, copyShareUrl }
}
