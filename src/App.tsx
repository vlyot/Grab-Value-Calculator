import { useEffect, useRef } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { CalculatorForm } from '@/components/form/CalculatorForm'
import { ResultsPanel } from '@/components/results/ResultsPanel'
import { TripHistory } from '@/components/history/TripHistory'
import { useCalculator } from '@/hooks/useCalculator'
import { useShareUrl } from '@/hooks/useShareUrl'
import { useTripHistory } from '@/hooks/useTripHistory'

export default function App() {
  const { inputs, setField, loadInputs, errors, result, hasResult, handleCalculate, handleReset } =
    useCalculator()
  const { getUrlInputs, updateUrl } = useShareUrl()
  const { history, addEntry, clearHistory } = useTripHistory()

  // Track whether the pending result came from a user-initiated calculation
  const pendingRecord = useRef(false)

  // On mount: if the URL contains encoded inputs, pre-fill and calculate (no history recording)
  useEffect(() => {
    const urlInputs = getUrlInputs()
    if (urlInputs) {
      loadInputs(urlInputs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCalculateAndRecord() {
    pendingRecord.current = true
    handleCalculate()
  }

  // After a successful user-initiated calculation, sync URL + record history
  useEffect(() => {
    if (result && pendingRecord.current) {
      pendingRecord.current = false
      updateUrl(inputs)
      addEntry(inputs, result)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <TripHistory history={history} onLoad={loadInputs} onClear={clearHistory} />
        <CalculatorForm
          inputs={inputs}
          errors={errors}
          hasResult={hasResult}
          setField={setField}
          onCalculate={handleCalculateAndRecord}
          onReset={handleReset}
        />
        <ResultsPanel result={result} inputs={inputs} />
      </main>
    </div>
  )
}
