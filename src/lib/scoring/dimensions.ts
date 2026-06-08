import type { DimensionResult, EffortInputs, CostInputs, TimeInputs } from '@/types/calculator'
import { EFFORT_WEIGHTS, COST_WEIGHTS, TIME_WEIGHTS } from './constants'
import {
  scoreWalkingDistanceSaved,
  scoreWaitingTimeAvoided,
  scoreTransfersAvoided,
  scoreFarePerKm,
  scorePerPersonCost,
  scoreFarePerMinute,
  scoreTimeDelta,
} from './normalise'

/**
 * Combines walking (40%), waiting (35%), transfers (25%) into a weighted
 * 0–100 score. Returns composite score plus all three sub-scores.
 */
export function scoreEffortSaved(inputs: EffortInputs): DimensionResult {
  const walk      = scoreWalkingDistanceSaved(inputs.transitWalkingMetres)
  const wait      = scoreWaitingTimeAvoided(inputs.transitWaitingMins)
  const transfers = scoreTransfersAvoided(inputs.transitTransfers)

  const score =
    walk      * EFFORT_WEIGHTS.walk +
    wait      * EFFORT_WEIGHTS.wait +
    transfers * EFFORT_WEIGHTS.transfers

  return {
    score,
    subScores: { walk, wait, transfers },
  }
}

/**
 * Derives fare/km, per-person cost, and fare/min from raw inputs, then
 * combines at 40/35/25% weights. Safe-guards against division by zero.
 */
export function scoreCostEfficiency(inputs: CostInputs): DimensionResult {
  const farePerKm  = inputs.grabDistanceKm > 0 ? inputs.grabFare / inputs.grabDistanceKm : 0
  const perPerson  = inputs.partySize > 0 ? inputs.grabFare / inputs.partySize : inputs.grabFare
  const farePerMin = inputs.grabEtaMins > 0 ? inputs.grabFare / inputs.grabEtaMins : 0

  const farePerKmScore  = scoreFarePerKm(farePerKm)
  const perPersonScore  = scorePerPersonCost(perPerson)
  const farePerMinScore = scoreFarePerMinute(farePerMin)

  const score =
    farePerKmScore  * COST_WEIGHTS.farePerKm +
    perPersonScore  * COST_WEIGHTS.perPerson +
    farePerMinScore * COST_WEIGHTS.farePerMin

  return {
    score,
    subScores: { farePerKm: farePerKmScore, perPerson: perPersonScore, farePerMin: farePerMinScore },
  }
}

/**
 * Combines time delta (60%) and waiting time avoided (40%). The waiting time
 * raw value is the same transit waiting input shared with Effort Saved.
 */
export function scoreTimeEfficiency(inputs: TimeInputs): DimensionResult {
  const delta = scoreTimeDelta(inputs.grabEtaMins, inputs.transitTimeMins)
  const wait  = scoreWaitingTimeAvoided(inputs.transitWaitingMins)

  const score =
    delta * TIME_WEIGHTS.delta +
    wait  * TIME_WEIGHTS.wait

  return {
    score,
    subScores: { delta, wait },
  }
}
