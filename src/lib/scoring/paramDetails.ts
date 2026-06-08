import type { CalculatorInputs } from '@/types/calculator'

export interface ParamDetail {
  unit: string
  rawValueFn: (inputs: CalculatorInputs) => number
  worstLabel: string
  bestLabel: string
  tip: string
}

export const PARAM_DETAILS: Record<string, ParamDetail> = {
  walk: {
    unit: 'm',
    rawValueFn: i => i.transitWalkingMetres,
    worstLabel: '1500m+',
    bestLabel: '0m',
    tip: 'Less walking saved by Grab means a lower score here',
  },
  wait: {
    unit: 'min',
    rawValueFn: i => i.transitWaitingMins,
    worstLabel: '15min+',
    bestLabel: '0min',
    tip: 'Longer platform waits make Grab more worthwhile',
  },
  transfers: {
    unit: '',
    rawValueFn: i => i.transitTransfers,
    worstLabel: '3+',
    bestLabel: '0',
    tip: 'More transfers avoided = more effort saved by taking Grab',
  },
  farePerKm: {
    unit: 'SGD/km',
    rawValueFn: i => (i.grabDistanceKm > 0 ? i.grabFare / i.grabDistanceKm : 0),
    worstLabel: '$2.50/km',
    bestLabel: '$0.80/km',
    tip: 'Longer trips tend to have better fare-per-km efficiency',
  },
  perPerson: {
    unit: 'SGD',
    rawValueFn: i => (i.partySize > 0 ? i.grabFare / i.partySize : i.grabFare),
    worstLabel: '$15',
    bestLabel: '$0',
    tip: 'Splitting with more passengers improves this score',
  },
  farePerMin: {
    unit: 'SGD/min',
    rawValueFn: i => (i.grabEtaMins > 0 ? i.grabFare / i.grabEtaMins : 0),
    worstLabel: '$0.50/min',
    bestLabel: '$0.10/min',
    tip: 'A quicker ride or lower fare both improve time-cost efficiency',
  },
  delta: {
    unit: 'min saved',
    rawValueFn: i => Math.max(0, i.transitTimeMins - i.grabEtaMins),
    worstLabel: '0min',
    bestLabel: '20min+',
    tip: 'The more time Grab saves over transit, the better this score',
  },
}
