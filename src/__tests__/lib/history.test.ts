import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadHistory,
  saveHistory,
  addHistoryEntry,
  clearHistory,
} from '@/lib/history'
import type { CalculatorInputs, ScoreResult } from '@/types/calculator'

const inputs: CalculatorInputs = {
  pickupLocation: 'A',
  dropoffLocation: 'B',
  isGrabSaver: false,
  saverDate: '',
  saverTime: '',
  grabFare: 10,
  partySize: 1,
  grabDistanceKm: 4,
  grabEtaMins: 12,
  transitTimeMins: 25,
  transitWalkingMetres: 300,
  transitWaitingMins: 5,
  transitTransfers: 1,
}

const result: ScoreResult = {
  finalScore: 72.5,
  band: { label: 'Good value', variant: 'good' },
  effort: { score: 80, subScores: {} },
  cost: { score: 65, subScores: {} },
  time: { score: 70, subScores: {} },
  derived: { farePerKm: 2.5, perPersonCost: 10, farePerMinute: 0.83, timeSavedMins: 13 },
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('loadHistory', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadHistory()).toEqual([])
  })

  it('returns empty array on corrupt JSON', () => {
    localStorage.setItem('grab-history', 'not-json{{{')
    expect(loadHistory()).toEqual([])
  })

  it('returns parsed entries when data is valid', () => {
    const entry = { id: '1', timestamp: 1000, inputs, finalScore: 72.5, bandLabel: 'Good value' }
    saveHistory([entry])
    expect(loadHistory()).toEqual([entry])
  })
})

describe('addHistoryEntry', () => {
  it('prepends new entry to the list', () => {
    const first = addHistoryEntry(inputs, result)
    const second = addHistoryEntry({ ...inputs, grabFare: 20 }, { ...result, finalScore: 50 })
    expect(second[0].finalScore).toBe(50)
    expect(second[1].finalScore).toBe(first[0].finalScore)
  })

  it('persists to localStorage', () => {
    addHistoryEntry(inputs, result)
    expect(localStorage.getItem('grab-history')).not.toBeNull()
  })

  it('stores correct finalScore and bandLabel', () => {
    const list = addHistoryEntry(inputs, result)
    expect(list[0].finalScore).toBe(72.5)
    expect(list[0].bandLabel).toBe('Good value')
  })

  it('caps list at 10 entries', () => {
    for (let i = 0; i < 11; i++) {
      addHistoryEntry({ ...inputs, grabFare: i }, { ...result, finalScore: i })
    }
    expect(loadHistory()).toHaveLength(10)
  })

  it('assigns a unique id to each entry', () => {
    const a = addHistoryEntry(inputs, result)
    const b = addHistoryEntry(inputs, result)
    expect(b[0].id).not.toBe(a[0].id)
  })
})

describe('clearHistory', () => {
  it('removes the grab-history key from localStorage', () => {
    addHistoryEntry(inputs, result)
    clearHistory()
    expect(localStorage.getItem('grab-history')).toBeNull()
    expect(loadHistory()).toEqual([])
  })
})
