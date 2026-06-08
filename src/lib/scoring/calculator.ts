import type { CalculatorInputs, ScoreResult, ScoreBand } from '@/types/calculator'
import { WEIGHT_EFFORT, WEIGHT_COST, WEIGHT_TIME } from './constants'
import { scoreEffortSaved, scoreCostEfficiency, scoreTimeEfficiency } from './dimensions'

/**
 * Maps a numeric score (0–100) to its label and badge variant.
 */
export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return { label: 'Excellent value', variant: 'excellent' }
  if (score >= 60) return { label: 'Good value',      variant: 'good'      }
  if (score >= 40) return { label: 'Decent',           variant: 'decent'    }
  if (score >= 20) return { label: 'Poor value',       variant: 'poor'      }
  return               { label: 'Not worth it',      variant: 'bad'       }
}

/**
 * Top-level entry point. Calls all three dimension scorers, applies the
 * 0.50/0.30/0.20 weights, rounds to one decimal, and attaches derived stats.
 */
export function calculateScore(inputs: CalculatorInputs): ScoreResult {
  const effort = scoreEffortSaved({
    transitWalkingMetres: inputs.transitWalkingMetres,
    transitWaitingMins:   inputs.transitWaitingMins,
    transitTransfers:     inputs.transitTransfers,
  })

  const cost = scoreCostEfficiency({
    grabFare:       inputs.grabFare,
    partySize:      inputs.partySize,
    grabDistanceKm: inputs.grabDistanceKm,
    grabEtaMins:    inputs.grabEtaMins,
  })

  const time = scoreTimeEfficiency({
    grabEtaMins:        inputs.grabEtaMins,
    transitTimeMins:    inputs.transitTimeMins,
    transitWaitingMins: inputs.transitWaitingMins,
  })

  const raw =
    effort.score * WEIGHT_EFFORT +
    cost.score   * WEIGHT_COST   +
    time.score   * WEIGHT_TIME

  const finalScore = Math.round(raw * 10) / 10

  return {
    finalScore,
    band: getScoreBand(finalScore),
    effort,
    cost,
    time,
    derived: {
      farePerKm:     inputs.grabDistanceKm > 0 ? Math.round((inputs.grabFare / inputs.grabDistanceKm) * 100) / 100 : 0,
      perPersonCost: inputs.partySize > 0 ? Math.round((inputs.grabFare / inputs.partySize) * 100) / 100 : inputs.grabFare,
      farePerMinute: inputs.grabEtaMins > 0 ? Math.round((inputs.grabFare / inputs.grabEtaMins) * 100) / 100 : 0,
      timeSavedMins: Math.max(0, inputs.transitTimeMins - inputs.grabEtaMins),
    },
  }
}
