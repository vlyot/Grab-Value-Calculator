import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRouteData } from '@/hooks/useRouteData'
import { MapsApiError } from '@/lib/maps/types'

// Mock the maps modules
vi.mock('@/lib/maps/directions', () => ({
  fetchBothRoutes: vi.fn(),
}))
vi.mock('@/lib/maps/parseRouteData', () => ({
  parseRouteData: vi.fn(),
}))

import { fetchBothRoutes } from '@/lib/maps/directions'
import { parseRouteData } from '@/lib/maps/parseRouteData'

const mockFetchBothRoutes = vi.mocked(fetchBothRoutes)
const mockParseRouteData = vi.mocked(parseRouteData)

const MOCK_FIELDS = {
  grabDistanceKm: 5.4,
  grabEtaMins: 15,
  transitTimeMins: 30,
  transitWalkingMetres: 400,
  transitWaitingMins: 5,
  transitTransfers: 0,
}

describe('useRouteData', () => {
  let setField: ReturnType<typeof vi.fn>

  beforeEach(() => {
    setField = vi.fn()
    vi.clearAllMocks()
  })

  it('status is idle on mount', () => {
    const { result } = renderHook(() => useRouteData(setField))
    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
  })

  it('status transitions to loading then success on happy path', async () => {
    mockFetchBothRoutes.mockResolvedValueOnce({ driving: {} as any, transit: {} as any })
    mockParseRouteData.mockReturnValueOnce(MOCK_FIELDS)

    const { result } = renderHook(() => useRouteData(setField))

    await act(async () => {
      await result.current.fetchRouteData('Orchard MRT', 'Marina Bay Sands')
    })

    expect(result.current.status).toBe('success')
    expect(result.current.error).toBeNull()
  })

  it('calls setField 6 times on successful fetch', async () => {
    mockFetchBothRoutes.mockResolvedValueOnce({ driving: {} as any, transit: {} as any })
    mockParseRouteData.mockReturnValueOnce(MOCK_FIELDS)

    const { result } = renderHook(() => useRouteData(setField))

    await act(async () => {
      await result.current.fetchRouteData('Orchard MRT', 'Marina Bay Sands')
    })

    expect(setField).toHaveBeenCalledTimes(6)
    expect(setField).toHaveBeenCalledWith('grabDistanceKm', 5.4)
    expect(setField).toHaveBeenCalledWith('grabEtaMins', 15)
    expect(setField).toHaveBeenCalledWith('transitTimeMins', 30)
    expect(setField).toHaveBeenCalledWith('transitWalkingMetres', 400)
    expect(setField).toHaveBeenCalledWith('transitWaitingMins', 5)
    expect(setField).toHaveBeenCalledWith('transitTransfers', 0)
  })

  it('status transitions to error on MapsApiError', async () => {
    mockFetchBothRoutes.mockRejectedValueOnce(
      new MapsApiError('ZERO_RESULTS', 'No route found'),
    )

    const { result } = renderHook(() => useRouteData(setField))

    await act(async () => {
      await result.current.fetchRouteData('A', 'B')
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error?.code).toBe('ZERO_RESULTS')
  })

  it('wraps unknown errors in MapsApiError', async () => {
    mockFetchBothRoutes.mockRejectedValueOnce(new Error('network failure'))

    const { result } = renderHook(() => useRouteData(setField))

    await act(async () => {
      await result.current.fetchRouteData('A', 'B')
    })

    expect(result.current.status).toBe('error')
    expect(result.current.error?.code).toBe('UNKNOWN_ERROR')
  })

  it('clearRouteError resets status to idle', async () => {
    mockFetchBothRoutes.mockRejectedValueOnce(
      new MapsApiError('NOT_FOUND', 'Not found'),
    )

    const { result } = renderHook(() => useRouteData(setField))

    await act(async () => {
      await result.current.fetchRouteData('A', 'B')
    })
    expect(result.current.status).toBe('error')

    act(() => {
      result.current.clearRouteError()
    })
    expect(result.current.status).toBe('idle')
    expect(result.current.error).toBeNull()
  })
})
