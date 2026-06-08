import { PageHeader } from '@/components/layout/PageHeader'
import { CalculatorForm } from '@/components/form/CalculatorForm'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { useCalculator } from '@/hooks/useCalculator'

export default function App() {
  const { inputs, setField, errors, result, hasResult, handleCalculate, handleReset } = useCalculator()

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <CalculatorForm
          inputs={inputs}
          errors={errors}
          hasResult={hasResult}
          setField={setField}
          onCalculate={handleCalculate}
          onReset={handleReset}
        />
        <ResultsPanel result={result} />
      </main>
    </div>
  )
}
