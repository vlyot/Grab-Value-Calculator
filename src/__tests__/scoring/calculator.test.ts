import { describe, it, expect } from 'vitest'
import { calculateScore, getScoreBand } from '@/lib/scoring/calculator'
import type { CalculatorInputs } from '@/types/calculator'

const baseInputs: CalculatorInputs = {
  pickupLocation: 'Orchard MRT',
  dropoffLocation: 'Marina Bay Sands',
  isGrabSaver: false,
  grabFare: 12,
  partySize: 1,
  grabDistanceKm: 5,
  grabEtaMins: 15,
  transitTimeMins: 30,
  transitWalkingMetres: 800,
  transitWaitingMins: 8,
  transitTransfers: 1,
}

describe('getScoreBand', () => {
  it('returns Excellent value for score 80 to 100', () => {
    expect(getScoreBand(80).label).toBe('Excellent value')
    expect(getScoreBand(100).label).toBe('Excellent value')
    expect(getScoreBand(95).label).toBe('Excellent value')
  })

  it('returns Good value for score 60 to 79', () => {
    expect(getScoreBand(60).label).toBe('Good value')
    expect(getScoreBand(79).label).toBe('Good value')
  })

  it('returns Decent for score 40 to 59', () => {
    expect(getScoreBand(40).label).toBe('Decent')
    expect(getScoreBand(59).label).toBe('Decent')
  })

  it('returns Poor value for score 20 to 39', () => {
    expect(getScoreBand(20).label).toBe('Poor value')
    expect(getScoreBand(39).label).toBe('Poor value')
  })

  it('returns Not worth it for score 0 to 19', () => {
    expect(getScoreBand(0).label).toBe('Not worth it')
    expect(getScoreBand(19).label).toBe('Not worth it')
  })

  it('returns correct variant string for each band', () => {
    expect(getScoreBand(90).variant).toBe('excellent')
    expect(getScoreBand(70).variant).toBe('good')
    expect(getScoreBand(50).variant).toBe('decent')
    expect(getScoreBand(30).variant).toBe('poor')
    expect(getScoreBand(10).variant).toBe('bad')
  })
})

describe('calculateScore', () => {
  it('returns finalScore between 0 and 100 inclusive', () => {
    const result = calculateScore(baseInputs)
    expect(result.finalScore).toBeGreaterThanOrEqual(0)
    expect(result.finalScore).toBeLessThanOrEqual(100)
  })

  it('applies 50/30/20 weights to dimension scores', () => {
    // grabFare=0 → per-person=0 (score 100), farePerKm=0 (score 100), farePerMin=0 (score 100)
    // transit 30 min vs grab 5 min → saves 25 mins (≥20 = score 100)
    // walk=1500m, wait=15min, transfers=3 → all at max anchors
    const maxInputs: CalculatorInputs = {
      ...baseInputs,
      grabFare: 0,
      grabDistanceKm: 1,
      grabEtaMins: 5,
      transitTimeMins: 30,
      transitWalkingMetres: 1500,
      transitWaitingMins: 15,
      transitTransfers: 3,
    }
    const result = calculateScore(maxInputs)
    expect(result.finalScore).toBe(100)
  })

  it('returns 0 for a zero-value trip', () => {
    const worstInputs: CalculatorInputs = {
      ...baseInputs,
      grabFare: 15,
      grabDistanceKm: 1,     // $15/km → worst
      grabEtaMins: 30,       // grab much slower than transit
      transitTimeMins: 20,
      transitWalkingMetres: 0,
      transitWaitingMins: 0,
      transitTransfers: 0,
    }
    const result = calculateScore(worstInputs)
    expect(result.finalScore).toBe(0)
  })

  it('derived object contains all four stat fields', () => {
    const result = calculateScore(baseInputs)
    expect(result.derived).toHaveProperty('farePerKm')
    expect(result.derived).toHaveProperty('perPersonCost')
    expect(result.derived).toHaveProperty('farePerMinute')
    expect(result.derived).toHaveProperty('timeSavedMins')
  })

  it('calculates farePerKm correctly in derived stats', () => {
    const result = calculateScore({ ...baseInputs, grabFare: 12, grabDistanceKm: 4 })
    expect(result.derived.farePerKm).toBe(3)
  })

  it('divides fare by party size for per-person cost in derived stats', () => {
    const result = calculateScore({ ...baseInputs, grabFare: 12, partySize: 4 })
    expect(result.derived.perPersonCost).toBe(3)
  })

  it('calculates timeSavedMins as max(0, transit - grab)', () => {
    const saved = calculateScore({ ...baseInputs, grabEtaMins: 10, transitTimeMins: 30 })
    expect(saved.derived.timeSavedMins).toBe(20)

    const slower = calculateScore({ ...baseInputs, grabEtaMins: 40, transitTimeMins: 30 })
    expect(slower.derived.timeSavedMins).toBe(0)
  })

  it('score band label matches finalScore', () => {
    const result = calculateScore(baseInputs)
    const expected = getScoreBand(result.finalScore)
    expect(result.band.label).toBe(expected.label)
    expect(result.band.variant).toBe(expected.variant)
  })
})
