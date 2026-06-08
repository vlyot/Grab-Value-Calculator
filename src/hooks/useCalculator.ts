import { useState } from 'react'
import type { CalculatorInputs, ScoreResult } from '@/types/calculator'
import { calculateScore } from '@/lib/scoring/calculator'

const INITIAL_INPUTS: CalculatorInputs = {
  pickupLocation: '',
  dropoffLocation: '',
  isGrabSaver: false,
  saverDate: '',
  saverTime: '',
  grabFare: 0,
  partySize: 1,
  grabDistanceKm: 0,
  grabEtaMins: 0,
  transitTimeMins: 0,
  transitWalkingMetres: 0,
  transitWaitingMins: 0,
  transitTransfers: 0,
}

type Errors = Partial<Record<keyof CalculatorInputs, string>>

function validate(inputs: CalculatorInputs): Errors {
  const errors: Errors = {}

  if (inputs.grabFare < 0) errors.grabFare = 'Fare must be 0 or more'
  if (inputs.grabDistanceKm <= 0) errors.grabDistanceKm = 'Distance must be greater than 0'
  if (inputs.grabEtaMins <= 0) errors.grabEtaMins = 'ETA must be greater than 0'
  if (inputs.partySize < 1 || inputs.partySize > 6) errors.partySize = 'Party size must be 1–6'
  if (inputs.transitTimeMins <= 0) errors.transitTimeMins = 'Transit time must be greater than 0'
  if (inputs.transitWalkingMetres < 0) errors.transitWalkingMetres = 'Walking distance must be 0 or more'
  if (inputs.transitWaitingMins < 0) errors.transitWaitingMins = 'Waiting time must be 0 or more'
  if (inputs.transitTransfers < 0) errors.transitTransfers = 'Transfers must be 0 or more'

  return errors
}

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(INITIAL_INPUTS)
  const [errors, setErrors] = useState<Errors>({})
  const [result, setResult] = useState<ScoreResult | null>(null)

  function setField(field: keyof CalculatorInputs, value: string | number | boolean) {
    setInputs(prev => ({ ...prev, [field]: value }))
    // Clear error for this field on change
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleCalculate() {
    const newErrors = validate(inputs)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    setResult(calculateScore(inputs))
  }

  function loadInputs(newInputs: CalculatorInputs) {
    setInputs(newInputs)
    setErrors({})
    setResult(calculateScore(newInputs))
  }

  function handleReset() {
    setInputs(INITIAL_INPUTS)
    setErrors({})
    setResult(null)
  }

  return {
    inputs,
    setField,
    loadInputs,
    errors,
    result,
    hasResult: result !== null,
    handleCalculate,
    handleReset,
  }
}
