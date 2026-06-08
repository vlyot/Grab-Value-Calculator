import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TripContextSection } from './TripContextSection'
import { GrabDetailsSection } from './GrabDetailsSection'
import { TransitDetailsSection } from './TransitDetailsSection'
import { CalculateButton } from './CalculateButton'
import { RouteStatusBar } from './RouteStatusBar'
import { useRouteData } from '@/hooks/useRouteData'
import type { CalculatorInputs } from '@/types/calculator'

interface Props {
  inputs: CalculatorInputs
  errors: Partial<Record<keyof CalculatorInputs, string>>
  hasResult: boolean
  setField: (field: keyof CalculatorInputs, value: string | number | boolean) => void
  onCalculate: () => void
  onReset: () => void
}

export function CalculatorForm({ inputs, errors, hasResult, setField, onCalculate, onReset }: Props) {
  const { status: routeStatus, error: routeError, fetchRouteData, clearRouteError } = useRouteData(setField)

  function handleRouteReady(origin: string, destination: string) {
    clearRouteError()
    void fetchRouteData(origin, destination)
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <TripContextSection
          inputs={inputs}
          setField={setField}
          onRouteReady={handleRouteReady}
          routeStatus={routeStatus}
        />
        <RouteStatusBar status={routeStatus} error={routeError} />
        <Separator />
        <GrabDetailsSection inputs={inputs} errors={errors} setField={setField} routeStatus={routeStatus} />
        <Separator />
        <TransitDetailsSection inputs={inputs} errors={errors} setField={setField} routeStatus={routeStatus} />
        <CalculateButton onCalculate={onCalculate} onReset={onReset} hasResult={hasResult} />
      </CardContent>
    </Card>
  )
}
