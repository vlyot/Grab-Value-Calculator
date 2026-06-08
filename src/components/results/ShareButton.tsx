import { useState } from 'react'
import { Link, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShareUrl } from '@/hooks/useShareUrl'
import type { CalculatorInputs } from '@/types/calculator'

interface Props {
  inputs: CalculatorInputs
}

export function ShareButton({ inputs }: Props) {
  const { copyShareUrl } = useShareUrl()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyShareUrl(inputs)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
      aria-label="Copy shareable link"
    >
      {copied ? <Check className="size-4" /> : <Link className="size-4" />}
      {copied ? 'Copied!' : 'Share result'}
    </Button>
  )
}
