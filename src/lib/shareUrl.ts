import type { CalculatorInputs } from '@/types/calculator'

// Short param keys to keep URLs readable
const KEYS = {
  pu:  'pickupLocation',
  do:  'dropoffLocation',
  gs:  'isGrabSaver',
  sd:  'saverDate',
  st:  'saverTime',
  gf:  'grabFare',
  ps:  'partySize',
  gd:  'grabDistanceKm',
  ge:  'grabEtaMins',
  tt:  'transitTimeMins',
  tw:  'transitWalkingMetres',
  twa: 'transitWaitingMins',
  tx:  'transitTransfers',
} as const satisfies Record<string, keyof CalculatorInputs>

type ParamKey = keyof typeof KEYS

const NUMERIC_FIELDS = new Set<keyof CalculatorInputs>([
  'grabFare', 'partySize', 'grabDistanceKm', 'grabEtaMins',
  'transitTimeMins', 'transitWalkingMetres', 'transitWaitingMins', 'transitTransfers',
])

export function encodeInputs(inputs: CalculatorInputs): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, field] of Object.entries(KEYS) as [ParamKey, keyof CalculatorInputs][]) {
    const value = inputs[field]
    if (typeof value === 'boolean') {
      params.set(key, value ? '1' : '0')
    } else if (typeof value === 'string' && value === '') {
      // Skip empty strings — don't pollute URL
    } else {
      params.set(key, String(value))
    }
  }
  return params
}

export function decodeInputs(params: URLSearchParams): CalculatorInputs | null {
  // Return null if none of the expected keys are present
  if (!Array.from(Object.keys(KEYS) as ParamKey[]).some(k => params.has(k))) return null

  const result: Partial<CalculatorInputs> = {}

  for (const [key, field] of Object.entries(KEYS) as [ParamKey, keyof CalculatorInputs][]) {
    const raw = params.get(key)
    if (raw === null) continue

    if (field === 'isGrabSaver') {
      ;(result as Record<string, unknown>)[field] = raw === '1'
    } else if (NUMERIC_FIELDS.has(field)) {
      const n = parseFloat(raw)
      ;(result as Record<string, unknown>)[field] = isNaN(n) ? 0 : n
    } else {
      ;(result as Record<string, unknown>)[field] = raw
    }
  }

  // Fill any missing fields with defaults
  const defaults: CalculatorInputs = {
    pickupLocation: '',
    dropoffLocation: '',
    isGrabSaver: false,
    saverDate: '',
    saverTime: '',
    grabFare: 0,
    partySize: 1,
    grabDistanceKm: 0,
    grabEtaMins: 0,
    transitTimeMins: 0,
    transitWalkingMetres: 0,
    transitWaitingMins: 0,
    transitTransfers: 0,
  }

  return { ...defaults, ...result } as CalculatorInputs
}

export function buildShareUrl(inputs: CalculatorInputs): string {
  const params = encodeInputs(inputs)
  const { origin, pathname } = window.location
  return `${origin}${pathname}?${params.toString()}`
}
