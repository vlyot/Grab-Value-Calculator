export interface CalculatorInputs {
  // Trip context (display only — not scored)
  pickupLocation: string
  dropoffLocation: string
  isGrabSaver: boolean
  saverDate: string  // 'YYYY-MM-DD', empty = unset
  saverTime: string  // 'HH:MM', empty = unset

  // Grab details
  grabFare: number
  partySize: number // 1–6
  grabDistanceKm: number
  grabEtaMins: number

  // Transit details
  transitTimeMins: number
  transitWalkingMetres: number
  transitWaitingMins: number
  transitTransfers: number
}

export interface DimensionResult {
  score: number
  subScores: Record<string, number>
}

export type ScoreBandVariant = 'excellent' | 'good' | 'decent' | 'poor' | 'bad'

export interface ScoreBand {
  label: string
  variant: ScoreBandVariant
}

export interface ScoreResult {
  finalScore: number
  band: ScoreBand
  effort: DimensionResult
  cost: DimensionResult
  time: DimensionResult
  derived: {
    farePerKm: number
    perPersonCost: number
    farePerMinute: number
    timeSavedMins: number
  }
}

export interface HistoryEntry {
  id: string
  timestamp: number
  inputs: CalculatorInputs
  finalScore: number
  bandLabel: string
}

// Sub-input shapes for dimension scorers
export interface EffortInputs {
  transitWalkingMetres: number
  transitWaitingMins: number
  transitTransfers: number
}

export interface CostInputs {
  grabFare: number
  partySize: number
  grabDistanceKm: number
  grabEtaMins: number
}

export interface TimeInputs {
  grabEtaMins: number
  transitTimeMins: number
  transitWaitingMins: number
}
