import { Badge } from '@/components/ui/badge'
import type { ScoreResult } from '@/types/calculator'
import type { ScoreBandVariant } from '@/types/calculator'

const BAND_CLASSES: Record<ScoreBandVariant, string> = {
  excellent: 'bg-green-100 text-green-800 border-green-200',
  good:      'bg-emerald-100 text-emerald-800 border-emerald-200',
  decent:    'bg-yellow-100 text-yellow-800 border-yellow-200',
  poor:      'bg-orange-100 text-orange-800 border-orange-200',
  bad:       'bg-red-100 text-red-800 border-red-200',
}

const SCORE_COLOR: Record<ScoreBandVariant, string> = {
  excellent: 'text-green-700',
  good:      'text-emerald-700',
  decent:    'text-yellow-700',
  poor:      'text-orange-600',
  bad:       'text-red-600',
}

interface Props {
  result: ScoreResult
}

export function ScoreDisplay({ result }: Props) {
  const { finalScore, band } = result

  return (
    <div className="text-center space-y-3">
      <div className={`text-7xl font-bold tabular-nums ${SCORE_COLOR[band.variant]}`}>
        {finalScore}
      </div>
      <div className="text-lg text-gray-400 font-medium">/ 100</div>
      <Badge className={`text-sm px-4 py-1 ${BAND_CLASSES[band.variant]}`}>
        {band.label}
      </Badge>
    </div>
  )
}
