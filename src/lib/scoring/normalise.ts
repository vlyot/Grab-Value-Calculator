import {
  WALK_DIST_MIN, WALK_DIST_MAX,
  WAIT_TIME_MIN, WAIT_TIME_MAX,
  TRANSFERS_MIN, TRANSFERS_MAX,
  FARE_PER_KM_WORST, FARE_PER_KM_BEST,
  PER_PERSON_WORST, PER_PERSON_BEST,
  FARE_PER_MIN_WORST, FARE_PER_MIN_BEST,
  TIME_DELTA_MIN, TIME_DELTA_MAX,
} from './constants'

/**
 * Linearly maps `value` between `worstAnchor` and `bestAnchor` to a 0–100
 * score. Clamps output so values outside the anchor range never exceed bounds.
 * Handles inverted ranges (where lower is better) via anchor order — pass
 * worstAnchor > bestAnchor to invert.
 */
export function clampNormalise(
  value: number,
  worstAnchor: number,
  bestAnchor: number,
): number {
  if (worstAnchor === bestAnchor) return 0
  const raw = ((value - worstAnchor) / (bestAnchor - worstAnchor)) * 100
  return Math.min(100, Math.max(0, raw))
}

/** Transit walking distance → 0–100. More walking saved = higher score. */
export function scoreWalkingDistanceSaved(metres: number): number {
  return clampNormalise(metres, WALK_DIST_MIN, WALK_DIST_MAX)
}

/** Transit waiting time → 0–100. More waiting avoided = higher score. */
export function scoreWaitingTimeAvoided(mins: number): number {
  return clampNormalise(mins, WAIT_TIME_MIN, WAIT_TIME_MAX)
}

/** Transit transfers → 0–100. More transfers avoided = higher score. */
export function scoreTransfersAvoided(transfers: number): number {
  return clampNormalise(transfers, TRANSFERS_MIN, TRANSFERS_MAX)
}

/** Fare per km → 0–100. Cheaper per km = higher score (inverted range). */
export function scoreFarePerKm(farePerKm: number): number {
  return clampNormalise(farePerKm, FARE_PER_KM_WORST, FARE_PER_KM_BEST)
}

/** Per-person cost → 0–100. Lower per-person cost = higher score (inverted). */
export function scorePerPersonCost(perPersonCost: number): number {
  return clampNormalise(perPersonCost, PER_PERSON_WORST, PER_PERSON_BEST)
}

/** Fare per minute → 0–100. Lower cost per minute = higher score (inverted). */
export function scoreFarePerMinute(farePerMin: number): number {
  return clampNormalise(farePerMin, FARE_PER_MIN_WORST, FARE_PER_MIN_BEST)
}

/**
 * Minutes saved by taking Grab vs transit → 0–100.
 * Negative delta (Grab is slower) clamps to 0.
 */
export function scoreTimeDelta(grabMins: number, transitMins: number): number {
  const saved = Math.max(0, transitMins - grabMins)
  return clampNormalise(saved, TIME_DELTA_MIN, TIME_DELTA_MAX)
}
