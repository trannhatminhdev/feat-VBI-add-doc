import { describe, it, expect } from 'vitest'
import { createFormatterByDimension } from 'src/pipeline/utils/format/createFormatterByDimension'
import type { Dimension } from 'src/types'

const fmt = (f: (v: number | string) => string, v: number | string) => f(v)

describe('createFormatterByDimension', () => {
  it('returns identity stringifier when dimension is undefined', () => {
    const formatter = createFormatterByDimension(undefined)
    expect(fmt(formatter, 1234)).toBe('1234')
    expect(fmt(formatter, 'abc')).toBe('abc')
  })

  it('formats year granularity for ISO date', () => {
    const dimension: Dimension = { id: 'd', timeFormat: { type: 'year' } }
    const formatter = createFormatterByDimension(dimension, 'en-US')
    expect(fmt(formatter, '2024-01-15')).toBe('2024')
  })

  it('formats month granularity for date-only string', () => {
    const dimension: Dimension = { id: 'd', timeFormat: { type: 'month' } }
    const formatter = createFormatterByDimension(dimension, 'en-US')
    expect(fmt(formatter, '2024-03-01')).toBe('2024-03')
  })

  it('formats hour granularity even when time part is missing', () => {
    const dimension: Dimension = { id: 'd', timeFormat: { type: 'hour' } }
    const formatter = createFormatterByDimension(dimension, 'en-US')
    const result = fmt(formatter, '2024-03-15')
    expect(result.startsWith('2024-03-15 ')).toBe(true)
  })

  it('returns raw value when parse fails', () => {
    const dimension: Dimension = { id: 'd', timeFormat: { type: 'day' } }
    const formatter = createFormatterByDimension(dimension, 'en-US')
    expect(fmt(formatter, 'not-a-date')).toBe('not-a-date')
  })
})
