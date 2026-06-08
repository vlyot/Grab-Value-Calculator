import { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { CalculatorInputs, DimensionResult } from '@/types/calculator'
import { PARAM_DETAILS } from '@/lib/scoring/paramDetails'
import { cn } from '@/lib/utils'

const SUB_PARAM_LABELS: Record<string, string> = {
  walk:       'Walking distance',
  wait:       'Waiting time',
  transfers:  'Transfers',
  farePerKm:  'Fare per km',
  perPerson:  'Per-person cost',
  farePerMin: 'Fare per minute',
  delta:      'Time saved',
}

interface Props {
  label: string
  weight: string
  dimension: DimensionResult
  inputs: CalculatorInputs
}

export function DimensionCard({ label, weight, dimension, inputs }: Props) {
  const score = Math.round(dimension.score)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  function toggle(key: string) {
    setExpandedKey(prev => (prev === key ? null : key))
  }

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
        {Object.entries(dimension.subScores).map(([key, subScore]) => {
          const detail = PARAM_DETAILS[key]
          const isExpanded = expandedKey === key
          const rawValue = detail ? detail.rawValueFn(inputs) : null

          return (
            <div key={key}>
              <button
                type="button"
                className="w-full text-left space-y-0.5 group"
                onClick={() => toggle(key)}
                aria-expanded={isExpanded}
              >
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    {SUB_PARAM_LABELS[key] ?? key}
                    {detail && (
                      <ChevronDownIcon
                        className={cn(
                          'h-3 w-3 text-gray-400 transition-transform duration-200',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    )}
                  </span>
                  <span className="font-medium">{Math.round(subScore)}</span>
                </div>
                <Progress value={Math.round(subScore)} className="h-1 bg-gray-100" />
              </button>

              {detail && isExpanded && (
                <div className="mt-1.5 mb-1 rounded-md bg-gray-50 border border-gray-100 px-3 py-2 space-y-1 text-xs text-gray-500">
                  {rawValue !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Value used</span>
                      <span className="font-medium text-gray-700">
                        {detail.unit === '' || detail.unit === 'min saved'
                          ? `${Number.isInteger(rawValue) ? rawValue : rawValue.toFixed(2)}${detail.unit ? ' ' + detail.unit : ''}`
                          : `${rawValue.toFixed(detail.unit.startsWith('SGD') ? 2 : 0)} ${detail.unit}`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Range</span>
                    <span className="text-gray-600">
                      {detail.worstLabel} → {detail.bestLabel}
                    </span>
                  </div>
                  <p className="text-gray-400 pt-0.5 border-t border-gray-100">{detail.tip}</p>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
