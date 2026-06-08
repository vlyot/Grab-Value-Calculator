import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { DimensionResult } from '@/types/calculator'

const SUB_PARAM_LABELS: Record<string, string> = {
  // Effort
  walk:      'Walking distance',
  wait:      'Waiting time',
  transfers: 'Transfers',
  // Cost
  farePerKm:  'Fare per km',
  perPerson:  'Per-person cost',
  farePerMin: 'Fare per minute',
  // Time
  delta: 'Time saved',
}

interface Props {
  label: string
  weight: string
  dimension: DimensionResult
}

export function DimensionCard({ label, weight, dimension }: Props) {
  const score = Math.round(dimension.score)

  return (
    <Card className="py-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700">{label}</CardTitle>
          <span className="text-xs text-gray-400 font-medium">{weight}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-sm text-gray-400">/100</span>
        </div>
        <Progress value={score} className="h-2 mt-1" />
      </CardHeader>

      <CardContent className="space-y-2 pt-2">
        {Object.entries(dimension.subScores).map(([key, subScore]) => (
          <div key={key} className="space-y-0.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{SUB_PARAM_LABELS[key] ?? key}</span>
              <span className="font-medium">{Math.round(subScore)}</span>
            </div>
            <Progress value={Math.round(subScore)} className="h-1 bg-gray-100" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
