import { act, renderHook } from '@testing-library/react'

import { useVBI } from '@visactor/vbi-react'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('useVBI', () => {
  it('returns the builder and updates the DSL snapshot', () => {
    const builder = createTestBuilder()
    const { result } = renderHook(() => useVBI(builder))

    expect(result.current.builder).toBe(builder)
    expect(result.current.dsl.chartType).toBe('table')

    act(() => {
      builder.chartType.changeChartType('line')
    })

    expect(result.current.dsl.chartType).toBe('line')
  })
})
