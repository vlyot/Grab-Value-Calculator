import { CheckCircleIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { RouteDataStatus } from '@/hooks/useRouteData'
import type { MapsApiError, MapsApiErrorCode } from '@/lib/maps/types'

const ERROR_MESSAGES: Record<MapsApiErrorCode, string> = {
  NOT_FOUND: 'One of the addresses could not be found. Try a more specific location.',
  ZERO_RESULTS: 'No route found between these locations.',
  MAX_WAYPOINTS_EXCEEDED: 'Route request is too complex.',
  INVALID_REQUEST: 'Invalid route request. Please re-enter your locations.',
  REQUEST_DENIED: 'Route lookup failed (permission denied). Check API key configuration.',
  OVER_DAILY_LIMIT: 'Route lookup quota exceeded. Try again tomorrow.',
  OVER_QUERY_LIMIT: 'Too many requests. Please wait a moment and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  LOAD_FAILED: 'Could not load map service. Check your internet connection.',
}

interface RouteStatusBarProps {
  status: RouteDataStatus
  error: MapsApiError | null
}

export function RouteStatusBar({ status, error }: RouteStatusBarProps) {
  if (status === 'idle') return null

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="h-4 w-4 animate-spin" />
        Fetching route data…
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600">
        <CheckCircleIcon className="h-4 w-4" />
        Route data loaded — distance, time and transit details auto-filled
      </div>
    )
  }

  const message = error ? ERROR_MESSAGES[error.code] : ERROR_MESSAGES.UNKNOWN_ERROR

  return (
    <Alert variant="destructive">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
