import { Button } from '@/components/ui/button'

interface Props {
  onCalculate: () => void
  onReset: () => void
  hasResult: boolean
}

export function CalculateButton({ onCalculate, onReset, hasResult }: Props) {
  return (
    <div className="flex gap-3">
      <Button
        size="lg"
        className="flex-1"
        onClick={onCalculate}
      >
        Calculate Value Score
      </Button>
      {hasResult && (
        <Button
          size="lg"
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
