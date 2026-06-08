import { describe, it, expect } from 'vitest'
import { encodeInputs, decodeInputs } from '@/lib/shareUrl'
import type { CalculatorInputs } from '@/types/calculator'

const base: CalculatorInputs = {
  pickupLocation: 'Orchard MRT',
  dropoffLocation: 'Marina Bay Sands',
  isGrabSaver: true,
  saverDate: '2025-06-15',
  saverTime: '09:00',
  grabFare: 12.5,
  partySize: 2,
  grabDistanceKm: 5.2,
  grabEtaMins: 8,
  transitTimeMins: 25,
  transitWalkingMetres: 600,
  transitWaitingMins: 4,
  transitTransfers: 1,
}

describe('saverDate / saverTime URL encoding', () => {
  it('encodes saverDate as sd key', () => {
    const params = encodeInputs(base)
    expect(params.get('sd')).toBe('2025-06-15')
  })

  it('encodes saverTime as st key', () => {
    const params = encodeInputs(base)
    expect(params.get('st')).toBe('09:00')
  })

  it('skips sd/st when both are empty strings', () => {
    const params = encodeInputs({ ...base, saverDate: '', saverTime: '' })
    expect(params.has('sd')).toBe(false)
    expect(params.has('st')).toBe(false)
  })

  it('round-trips saverDate and saverTime through encode/decode', () => {
    const params = encodeInputs(base)
    const decoded = decodeInputs(params)
    expect(decoded?.saverDate).toBe('2025-06-15')
    expect(decoded?.saverTime).toBe('09:00')
  })

  it('defaults saverDate and saverTime to empty string when not in URL', () => {
    const params = new URLSearchParams('gf=8&gd=2&ge=6&tt=15')
    const decoded = decodeInputs(params)
    expect(decoded?.saverDate).toBe('')
    expect(decoded?.saverTime).toBe('')
  })
})
