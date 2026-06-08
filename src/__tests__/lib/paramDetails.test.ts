import { describe, it, expect } from 'vitest'
import { PARAM_DETAILS } from '@/lib/scoring/paramDetails'
import type { CalculatorInputs } from '@/types/calculator'

const base: CalculatorInputs = {
  pickupLocation: '',
  dropoffLocation: '',
  isGrabSaver: false,
  saverDate: '',
  saverTime: '',
  grabFare: 12,
  partySize: 2,
  grabDistanceKm: 4,
  grabEtaMins: 10,
  transitTimeMins: 30,
  transitWalkingMetres: 840,
  transitWaitingMins: 7,
  transitTransfers: 2,
}

describe('PARAM_DETAILS', () => {
  it('walk rawValueFn extracts transitWalkingMetres', () => {
    expect(PARAM_DETAILS.walk.rawValueFn(base)).toBe(840)
  })

  it('wait rawValueFn extracts transitWaitingMins', () => {
    expect(PARAM_DETAILS.wait.rawValueFn(base)).toBe(7)
  })

  it('transfers rawValueFn extracts transitTransfers', () => {
    expect(PARAM_DETAILS.transfers.rawValueFn(base)).toBe(2)
  })

  it('farePerKm rawValueFn divides grabFare by grabDistanceKm', () => {
    expect(PARAM_DETAILS.farePerKm.rawValueFn(base)).toBe(3) // 12/4
  })

  it('farePerKm rawValueFn returns 0 when distance is zero', () => {
    expect(PARAM_DETAILS.farePerKm.rawValueFn({ ...base, grabDistanceKm: 0 })).toBe(0)
  })

  it('perPerson rawValueFn divides grabFare by partySize', () => {
    expect(PARAM_DETAILS.perPerson.rawValueFn(base)).toBe(6) // 12/2
  })

  it('farePerMin rawValueFn divides grabFare by grabEtaMins', () => {
    expect(PARAM_DETAILS.farePerMin.rawValueFn(base)).toBe(1.2) // 12/10
  })

  it('farePerMin rawValueFn returns 0 when eta is zero', () => {
    expect(PARAM_DETAILS.farePerMin.rawValueFn({ ...base, grabEtaMins: 0 })).toBe(0)
  })

  it('delta rawValueFn computes transitTimeMins - grabEtaMins', () => {
    expect(PARAM_DETAILS.delta.rawValueFn(base)).toBe(20) // 30-10
  })

  it('delta rawValueFn clamps negative time savings to 0', () => {
    expect(PARAM_DETAILS.delta.rawValueFn({ ...base, grabEtaMins: 40 })).toBe(0)
  })

  it('all params have a unit, worstLabel, bestLabel, and tip', () => {
    for (const [key, detail] of Object.entries(PARAM_DETAILS)) {
      expect(typeof detail.unit, `${key}.unit`).toBe('string')
      expect(detail.worstLabel, `${key}.worstLabel`).toBeTruthy()
      expect(detail.bestLabel, `${key}.bestLabel`).toBeTruthy()
      expect(detail.tip, `${key}.tip`).toBeTruthy()
    }
  })
})
