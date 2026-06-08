import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { HistoryEntry, CalculatorInputs, ScoreBandVariant } from '@/types/calculator'

const BAND_CLASSES: Record<ScoreBandVariant, string> = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good:      'bg-emerald-100 text-emerald-800 border-emerald-200',
  decent:    'bg-yellow-100 text-yellow-800 border-yellow-200',
  poor:      'bg-orange-100 text-orange-800 border-orange-200',
  bad:       'bg-red-100 text-red-800 border-red-200',
}

// Derive variant from band label for colouring — avoids storing variant separately
function labelToVariant(label: string): ScoreBandVariant {
  if (label === 'Excellent value') return 'excellent'
  if (label === 'Good value')      return 'good'
  if (label === 'Decent')          return 'decent'
  if (label === 'Poor value')      return 'poor'
  return 'bad'
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts))
}

interface Props {
  history: HistoryEntry[]
  onLoad: (inputs: CalculatorInputs) => void
  onClear: () => void
}

export function TripHistory({ history, onLoad, onClear }: Props) {
  const [open, setOpen] = useState(false)

  if (history.length === 0) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Clock className="size-4 text-gray-400" />
          Recent trips
          <Badge variant="secondary" className="text-xs px-1.5 py-0">{history.length}</Badge>
        </span>
        {open ? <ChevronDown className="size-4 text-gray-400" /> : <ChevronRight className="size-4 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {history.map(entry => {
            const variant = labelToVariant(entry.bandLabel)
            const pickup  = entry.inputs.pickupLocation  || 'Unknown pickup'
            const dropoff = entry.inputs.dropoffLocation || 'Unknown dropoff'

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onLoad(entry.inputs)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800 font-medium">
                    {pickup} → {dropoff}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(entry.timestamp)}</p>
                </div>
                <div className="ml-3 flex items-center gap-2 shrink-0">
                  <span className="text-base font-bold tabular-nums text-gray-700">{entry.finalScore}</span>
                  <Badge className={`text-xs px-2 py-0.5 ${BAND_CLASSES[variant]}`}>
                    {entry.bandLabel}
                  </Badge>
                </div>
              </button>
            )
          })}

          <div className="px-4 py-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="gap-1.5 text-xs text-gray-400 hover:text-red-500"
              aria-label="Clear history"
            >
              <Trash2 className="size-3.5" />
              Clear history
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
