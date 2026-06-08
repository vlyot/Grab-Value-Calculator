import { DimensionCard } from './DimensionCard'
import type { ScoreResult } from '@/types/calculator'

interface Props {
  result: ScoreResult
}

export function DimensionBreakdown({ result }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DimensionCard label="Effort Saved" weight="50%" dimension={result.effort} />
      <DimensionCard label="Cost Efficiency" weight="30%" dimension={result.cost} />
      <DimensionCard label="Time Efficiency" weight="20%" dimension={result.time} />
    </div>
  )
}
