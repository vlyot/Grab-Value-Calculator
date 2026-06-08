import { useState } from 'react'
import { loadHistory, addHistoryEntry, clearHistory as clearStoredHistory } from '@/lib/history'
import type { CalculatorInputs, HistoryEntry, ScoreResult } from '@/types/calculator'

export function useTripHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  function addEntry(inputs: CalculatorInputs, result: ScoreResult) {
    const updated = addHistoryEntry(inputs, result)
    setHistory(updated)
  }

  function clearHistory() {
    clearStoredHistory()
    setHistory([])
  }

  return { history, addEntry, clearHistory }
}
