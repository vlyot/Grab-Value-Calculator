import { describe, it, expect } from 'vitest'
import { SE_ASIA_REGION_CODES } from '@/lib/maps/autocomplete'

describe('autocomplete region defaults', () => {
  it('SE_ASIA_REGION_CODES includes SG', () => {
    expect(SE_ASIA_REGION_CODES).toContain('SG')
  })

  it('SE_ASIA_REGION_CODES includes all 6 SE Asia countries', () => {
    expect(SE_ASIA_REGION_CODES).toHaveLength(6)
    for (const code of ['SG', 'MY', 'TH', 'ID', 'PH', 'VN']) {
      expect(SE_ASIA_REGION_CODES).toContain(code)
    }
  })
})
