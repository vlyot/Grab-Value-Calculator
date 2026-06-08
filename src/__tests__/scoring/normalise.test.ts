import { describe, it, expect } from 'vitest'
import {
  clampNormalise,
  scoreWalkingDistanceSaved,
  scoreWaitingTimeAvoided,
  scoreTransfersAvoided,
  scoreFarePerKm,
  scorePerPersonCost,
  scoreFarePerMinute,
  scoreTimeDelta,
} from '@/lib/scoring/normalise'

describe('clampNormalise', () => {
  it('returns 0 when value equals worst anchor', () => {
    expect(clampNormalise(0, 0, 100)).toBe(0)
  })

  it('returns 100 when value equals best anchor', () => {
    expect(clampNormalise(100, 0, 100)).toBe(100)
  })

  it('clamps to 0 when value exceeds worst anchor (below range)', () => {
    expect(clampNormalise(-10, 0, 100)).toBe(0)
  })

  it('clamps to 100 when value exceeds best anchor (above range)', () => {
    expect(clampNormalise(200, 0, 100)).toBe(100)
  })

  it('returns 50 for midpoint between anchors', () => {
    expect(clampNormalise(50, 0, 100)).toBe(50)
  })

  it('handles inverted range (lower value = higher score)', () => {
    // worst=2.50, best=0.80 — value at worst should return 0
    expect(clampNormalise(2.50, 2.50, 0.80)).toBe(0)
    expect(clampNormalise(0.80, 2.50, 0.80)).toBe(100)
  })
})

describe('scoreWalkingDistanceSaved', () => {
  it('returns 0 for zero metres walked', () => {
    expect(scoreWalkingDistanceSaved(0)).toBe(0)
  })

  it('returns 100 at 1500 metres', () => {
    expect(scoreWalkingDistanceSaved(1500)).toBe(100)
  })

  it('clamps to 100 beyond 1500 metres', () => {
    expect(scoreWalkingDistanceSaved(2000)).toBe(100)
  })

  it('returns 50 at 750 metres', () => {
    expect(scoreWalkingDistanceSaved(750)).toBeCloseTo(50, 1)
  })
})

describe('scoreWaitingTimeAvoided', () => {
  it('returns 0 for zero waiting', () => {
    expect(scoreWaitingTimeAvoided(0)).toBe(0)
  })

  it('returns 100 at 15 minutes', () => {
    expect(scoreWaitingTimeAvoided(15)).toBe(100)
  })

  it('clamps to 100 beyond 15 minutes', () => {
    expect(scoreWaitingTimeAvoided(20)).toBe(100)
  })
})

describe('scoreTransfersAvoided', () => {
  it('returns 0 for zero transfers', () => {
    expect(scoreTransfersAvoided(0)).toBe(0)
  })

  it('returns 100 at three or more transfers', () => {
    expect(scoreTransfersAvoided(3)).toBe(100)
    expect(scoreTransfersAvoided(5)).toBe(100)
  })
})

describe('scoreFarePerKm', () => {
  it('returns 0 at $2.50 per km (worst)', () => {
    expect(scoreFarePerKm(2.50)).toBe(0)
  })

  it('returns 100 at $0.80 per km (best)', () => {
    expect(scoreFarePerKm(0.80)).toBe(100)
  })

  it('clamps to 0 for values above worst anchor', () => {
    expect(scoreFarePerKm(5.00)).toBe(0)
  })

  it('clamps to 100 for values below best anchor', () => {
    expect(scoreFarePerKm(0.50)).toBe(100)
  })
})

describe('scorePerPersonCost', () => {
  it('returns 100 at $0 per person', () => {
    expect(scorePerPersonCost(0)).toBe(100)
  })

  it('returns 0 at $15 per person', () => {
    expect(scorePerPersonCost(15)).toBe(0)
  })

  it('clamps to 0 beyond $15', () => {
    expect(scorePerPersonCost(20)).toBe(0)
  })
})

describe('scoreFarePerMinute', () => {
  it('returns 0 at $0.50 per minute', () => {
    expect(scoreFarePerMinute(0.50)).toBe(0)
  })

  it('returns 100 at $0.10 per minute', () => {
    expect(scoreFarePerMinute(0.10)).toBe(100)
  })
})

describe('scoreTimeDelta', () => {
  it('returns 0 when grab is slower than transit', () => {
    expect(scoreTimeDelta(30, 20)).toBe(0)
  })

  it('returns 0 when grab and transit are equal', () => {
    expect(scoreTimeDelta(20, 20)).toBe(0)
  })

  it('returns 100 when grab saves 20+ minutes', () => {
    expect(scoreTimeDelta(10, 30)).toBe(100)
    expect(scoreTimeDelta(5, 40)).toBe(100)
  })

  it('returns 50 when grab saves exactly 10 minutes', () => {
    expect(scoreTimeDelta(10, 20)).toBeCloseTo(50, 1)
  })
})
