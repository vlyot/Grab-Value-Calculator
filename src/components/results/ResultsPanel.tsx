import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScoreDisplay } from './ScoreDisplay'
import { ShareButton } from './ShareButton'
import { DimensionBreakdown } from './DimensionBreakdown'
import { StatsGrid } from './StatsGrid'
import type { CalculatorInputs, ScoreResult } from '@/types/calculator'

interface Props {
  result: ScoreResult | null
  inputs: CalculatorInputs
}

export function ResultsPanel({ result, inputs }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  if (!result) return null

  return (
    <div ref={ref} className="space-y-4 pt-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-gray-700">Value Score</CardTitle>
          <ShareButton inputs={inputs} />
        </CardHeader>
        <CardContent className="space-y-6">
          <ScoreDisplay result={result} />
          <Separator />
          <StatsGrid result={result} />
        </CardContent>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Score Breakdown
        </h3>
        <DimensionBreakdown result={result} inputs={inputs} />
      </div>
    </div>
  )
}
