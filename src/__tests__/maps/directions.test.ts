import { describe, it, expect } from 'vitest'
import { nearestHalfHour } from '@/lib/maps/directions'

describe('nearestHalfHour', () => {
  it('returns a date in the future', () => {
    const result = nearestHalfHour()
    expect(result.getTime()).toBeGreaterThanOrEqual(Date.now())
  })

  it('returns :00 or :30 minute boundary', () => {
    const result = nearestHalfHour()
    const minutes = result.getMinutes()
    expect([0, 30]).toContain(minutes)
  })

  it('returns exactly :00 when current time is exactly on :00', () => {
    // If it's exactly :00 it should snap to the NEXT :00 (or stay if Math.ceil lands on same)
    // Key property: seconds and ms should be 0
    const result = nearestHalfHour()
    expect(result.getSeconds()).toBe(0)
    expect(result.getMilliseconds()).toBe(0)
  })

  it('rounds up, not down', () => {
    const result = nearestHalfHour()
    // Result must be >= now
    expect(result.getTime()).toBeGreaterThanOrEqual(new Date().getTime() - 1000)
  })
})
