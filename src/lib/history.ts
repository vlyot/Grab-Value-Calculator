import type { CalculatorInputs, HistoryEntry, ScoreResult } from '@/types/calculator'

const STORAGE_KEY = 'grab-history'
const MAX_ENTRIES = 10

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function addHistoryEntry(
  inputs: CalculatorInputs,
  result: ScoreResult,
): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    inputs,
    finalScore: result.finalScore,
    bandLabel: result.band.label,
  }
  const existing = loadHistory()
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES)
  saveHistory(updated)
  return updated
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
