import { act, renderHook } from '@testing-library/react'

import { useChartType } from '@visactor/vbi-react'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('useChartType', () => {
  it('reads and updates chart type through the builder', () => {
    const builder = createTestBuilder()
    const { result } = renderHook(() => useChartType(builder))

    expect(result.current.chartType).toBe('table')
    expect(result.current.availableChartTypes).toContain('line')

    act(() => {
      result.current.setChartType('line')
    })

    expect(result.current.chartType).toBe('line')
  })
})
