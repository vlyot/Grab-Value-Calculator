import { describe, it, expect } from 'vitest'
import { parseSaverDeparture } from '@/hooks/useRouteData'

describe('parseSaverDeparture', () => {
  it('returns a Date when both date and time are provided', () => {
    const result = parseSaverDeparture('2025-06-15', '09:00')
    expect(result).toBeInstanceOf(Date)
    expect(result?.getFullYear()).toBe(2025)
    expect(result?.getMonth()).toBe(5) // June = 5 (0-indexed)
    expect(result?.getDate()).toBe(15)
  })

  it('returns undefined when saverDate is empty', () => {
    expect(parseSaverDeparture('', '09:00')).toBeUndefined()
  })

  it('returns undefined when saverTime is empty', () => {
    expect(parseSaverDeparture('2025-06-15', '')).toBeUndefined()
  })

  it('returns undefined when both are empty', () => {
    expect(parseSaverDeparture('', '')).toBeUndefined()
  })

  it('returns undefined for malformed date string', () => {
    expect(parseSaverDeparture('not-a-date', '09:00')).toBeUndefined()
  })
})
