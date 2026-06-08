// ─── Effort Saved anchors ───────────────────────────────────────────────────
export const WALK_DIST_MIN = 0      // metres
export const WALK_DIST_MAX = 1500   // metres

export const WAIT_TIME_MIN = 0      // minutes
export const WAIT_TIME_MAX = 15     // minutes

export const TRANSFERS_MIN = 0
export const TRANSFERS_MAX = 3

// ─── Cost Efficiency anchors ─────────────────────────────────────────────────
export const FARE_PER_KM_WORST = 2.50   // SGD/km → score 0
export const FARE_PER_KM_BEST  = 0.80   // SGD/km → score 100

export const PER_PERSON_WORST = 15      // SGD → score 0
export const PER_PERSON_BEST  = 0       // SGD → score 100

export const FARE_PER_MIN_WORST = 0.50  // SGD/min → score 0
export const FARE_PER_MIN_BEST  = 0.10  // SGD/min → score 100

// ─── Time Efficiency anchors ─────────────────────────────────────────────────
export const TIME_DELTA_MIN = 0    // minutes saved → score 0
export const TIME_DELTA_MAX = 20   // minutes saved → score 100

// ─── Dimension weights ───────────────────────────────────────────────────────
export const WEIGHT_EFFORT = 0.50
export const WEIGHT_COST   = 0.30
export const WEIGHT_TIME   = 0.20

// ─── Sub-param weights within each dimension ─────────────────────────────────
export const EFFORT_WEIGHTS = {
  walk:      0.40,
  wait:      0.35,
  transfers: 0.25,
} as const

export const COST_WEIGHTS = {
  farePerKm:  0.40,
  perPerson:  0.35,
  farePerMin: 0.25,
} as const

export const TIME_WEIGHTS = {
  delta: 0.60,
  wait:  0.40,
} as const
