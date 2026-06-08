import { DimensionCard } from './DimensionCard'
import type { CalculatorInputs, ScoreResult } from '@/types/calculator'

interface Props {
  result: ScoreResult
  inputs: CalculatorInputs
}

export function DimensionBreakdown({ result, inputs }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DimensionCard label="Effort Saved" weight="50%" dimension={result.effort} inputs={inputs} />
      <DimensionCard label="Cost Efficiency" weight="30%" dimension={result.cost} inputs={inputs} />
      <DimensionCard label="Time Efficiency" weight="20%" dimension={result.time} inputs={inputs} />
    </div>
  )
}
