import { describe, it, expect } from 'vitest'
import { scoreEffortSaved, scoreCostEfficiency, scoreTimeEfficiency } from '@/lib/scoring/dimensions'

describe('scoreEffortSaved', () => {
  it('returns 0 when all transit inputs are zero', () => {
    const result = scoreEffortSaved({
      transitWalkingMetres: 0,
      transitWaitingMins: 0,
      transitTransfers: 0,
    })
    expect(result.score).toBe(0)
  })

  it('returns 100 when all inputs are at maximum anchors', () => {
    const result = scoreEffortSaved({
      transitWalkingMetres: 1500,
      transitWaitingMins: 15,
      transitTransfers: 3,
    })
    expect(result.score).toBe(100)
  })

  it('weights sub-params at 40/35/25 percent correctly', () => {
    // Only walking at max = 40% of 100 = 40
    const walkOnly = scoreEffortSaved({
      transitWalkingMetres: 1500,
      transitWaitingMins: 0,
      transitTransfers: 0,
    })
    expect(walkOnly.score).toBeCloseTo(40, 1)

    // Only wait at max = 35% of 100 = 35
    const waitOnly = scoreEffortSaved({
      transitWalkingMetres: 0,
      transitWaitingMins: 15,
      transitTransfers: 0,
    })
    expect(waitOnly.score).toBeCloseTo(35, 1)

    // Only transfers at max = 25% of 100 = 25
    const transfersOnly = scoreEffortSaved({
      transitWalkingMetres: 0,
      transitWaitingMins: 0,
      transitTransfers: 3,
    })
    expect(transfersOnly.score).toBeCloseTo(25, 1)
  })

  it('DimensionResult subScores contains all three keyed sub-param scores', () => {
    const result = scoreEffortSaved({
      transitWalkingMetres: 750,
      transitWaitingMins: 7.5,
      transitTransfers: 1,
    })
    expect(result.subScores).toHaveProperty('walk')
    expect(result.subScores).toHaveProperty('wait')
    expect(result.subScores).toHaveProperty('transfers')
  })
})

describe('scoreCostEfficiency', () => {
  it('derives fare-per-km from fare and distance', () => {
    // fare=8, distance=4km → $2/km, which is between worst(2.50) and best(0.80)
    const result = scoreCostEfficiency({
      grabFare: 8,
      partySize: 1,
      grabDistanceKm: 4,
      grabEtaMins: 20,
    })
    // farePerKm score for $2/km: (2.50-2.00)/(2.50-0.80)*100 ≈ 29.4
    expect(result.subScores.farePerKm).toBeCloseTo(29.4, 0)
  })

  it('divides fare by party size for per-person scoring', () => {
    const solo = scoreCostEfficiency({
      grabFare: 12,
      partySize: 1,
      grabDistanceKm: 5,
      grabEtaMins: 15,
    })
    const group = scoreCostEfficiency({
      grabFare: 12,
      partySize: 4,
      grabDistanceKm: 5,
      grabEtaMins: 15,
    })
    // Group of 4 → $3/person (much better score than $12/person solo)
    expect(group.subScores.perPerson).toBeGreaterThan(solo.subScores.perPerson)
  })

  it('returns low score for expensive short ride', () => {
    // $15 for 2km, 5 mins → fare/km=7.5 (worst), fare/min=3.0 (worst)
    const result = scoreCostEfficiency({
      grabFare: 15,
      partySize: 1,
      grabDistanceKm: 2,
      grabEtaMins: 5,
    })
    expect(result.score).toBeLessThan(20)
  })

  it('returns high score for cheap long ride split by group', () => {
    // $10, 10km, 30min, 4 people → fare/km=1.0, per-person=$2.50, fare/min=0.33
    const result = scoreCostEfficiency({
      grabFare: 10,
      partySize: 4,
      grabDistanceKm: 10,
      grabEtaMins: 30,
    })
    expect(result.score).toBeGreaterThan(60)
  })
})

describe('scoreTimeEfficiency', () => {
  it('returns 0 when grab is slower than transit', () => {
    const result = scoreTimeEfficiency({
      grabEtaMins: 30,
      transitTimeMins: 20,
      transitWaitingMins: 0,
    })
    expect(result.score).toBe(0)
  })

  it('weights time delta at 60 percent of dimension', () => {
    // delta only at max (20 min saved), no waiting → 60% of 100 = 60
    const result = scoreTimeEfficiency({
      grabEtaMins: 10,
      transitTimeMins: 30,
      transitWaitingMins: 0,
    })
    expect(result.score).toBeCloseTo(60, 1)
  })

  it('DimensionResult subScores contains delta and wait keys', () => {
    const result = scoreTimeEfficiency({
      grabEtaMins: 15,
      transitTimeMins: 30,
      transitWaitingMins: 8,
    })
    expect(result.subScores).toHaveProperty('delta')
    expect(result.subScores).toHaveProperty('wait')
  })
})
