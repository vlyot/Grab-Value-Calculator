import type { ScoreResult } from '@/types/calculator'

interface Props {
  result: ScoreResult
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 text-center">
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

export function StatsGrid({ result }: Props) {
  const { derived } = result
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatPill
        label="Fare / km"
        value={`$${derived.farePerKm.toFixed(2)}`}
      />
      <StatPill
        label="Per person"
        value={`$${derived.perPersonCost.toFixed(2)}`}
      />
      <StatPill
        label="Fare / min"
        value={`$${derived.farePerMinute.toFixed(2)}`}
      />
      <StatPill
        label="Time saved"
        value={`${derived.timeSavedMins} min`}
      />
    </div>
  )
}
