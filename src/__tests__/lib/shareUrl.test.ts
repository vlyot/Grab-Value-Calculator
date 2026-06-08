import { describe, it, expect, beforeEach, vi } from 'vitest'
import { encodeInputs, decodeInputs, buildShareUrl } from '@/lib/shareUrl'
import type { CalculatorInputs } from '@/types/calculator'

const base: CalculatorInputs = {
  pickupLocation: 'Orchard MRT',
  dropoffLocation: 'Marina Bay Sands',
  isGrabSaver: false,
  saverDate: '',
  saverTime: '',
  grabFare: 12.5,
  partySize: 2,
  grabDistanceKm: 5.2,
  grabEtaMins: 8,
  transitTimeMins: 25,
  transitWalkingMetres: 600,
  transitWaitingMins: 4,
  transitTransfers: 1,
}

describe('encodeInputs', () => {
  it('serialises all non-empty fields as query params', () => {
    const params = encodeInputs(base)
    // saverDate/saverTime are empty strings so they are skipped
    const keys = ['pu', 'do', 'gs', 'gf', 'ps', 'gd', 'ge', 'tt', 'tw', 'twa', 'tx']
    for (const k of keys) {
      expect(params.has(k)).toBe(true)
    }
  })

  it('skips empty saverDate and saverTime in URL', () => {
    const params = encodeInputs({ ...base, saverDate: '', saverTime: '' })
    expect(params.has('sd')).toBe(false)
    expect(params.has('st')).toBe(false)
  })

  it('encodes saverDate and saverTime when set', () => {
    const params = encodeInputs({ ...base, saverDate: '2025-06-15', saverTime: '09:00' })
    expect(params.get('sd')).toBe('2025-06-15')
    expect(params.get('st')).toBe('09:00')
  })

  it('encodes isGrabSaver=false as gs=0', () => {
    expect(encodeInputs({ ...base, isGrabSaver: false }).get('gs')).toBe('0')
  })

  it('encodes isGrabSaver=true as gs=1', () => {
    expect(encodeInputs({ ...base, isGrabSaver: true }).get('gs')).toBe('1')
  })

  it('encodes numeric fields as strings', () => {
    const params = encodeInputs(base)
    expect(params.get('gf')).toBe('12.5')
    expect(params.get('ps')).toBe('2')
  })
})

describe('decodeInputs', () => {
  it('returns null for empty URLSearchParams', () => {
    expect(decodeInputs(new URLSearchParams())).toBeNull()
  })

  it('round-trips with encodeInputs', () => {
    const params = encodeInputs(base)
    const decoded = decodeInputs(params)
    expect(decoded).toEqual(base)
  })

  it('coerces numeric string fields to numbers', () => {
    const params = new URLSearchParams('gf=7.5&gd=3&ge=10&tt=20&tw=500&twa=3&tx=0&ps=1')
    const decoded = decodeInputs(params)
    expect(typeof decoded?.grabFare).toBe('number')
    expect(decoded?.grabFare).toBe(7.5)
  })

  it('coerces gs=1 to isGrabSaver=true', () => {
    const params = new URLSearchParams('gs=1&gf=5&gd=2&ge=5&tt=10&tw=0&twa=0&tx=0&ps=1')
    expect(decodeInputs(params)?.isGrabSaver).toBe(true)
  })

  it('fills missing fields with defaults', () => {
    const params = new URLSearchParams('gf=8&gd=2&ge=6&tt=15')
    const decoded = decodeInputs(params)
    expect(decoded?.partySize).toBe(1)
    expect(decoded?.isGrabSaver).toBe(false)
    expect(decoded?.pickupLocation).toBe('')
  })

  it('handles NaN gracefully by defaulting to 0', () => {
    const params = new URLSearchParams('gf=abc&gd=2&ge=5&tt=10')
    const decoded = decodeInputs(params)
    expect(decoded?.grabFare).toBe(0)
  })
})

describe('buildShareUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:5173', pathname: '/' },
    })
  })

  it('starts with the window origin', () => {
    const url = buildShareUrl(base)
    expect(url.startsWith('http://localhost:5173/')).toBe(true)
  })

  it('includes query params', () => {
    const url = buildShareUrl(base)
    expect(url).toContain('?')
    expect(url).toContain('gf=')
  })
})
