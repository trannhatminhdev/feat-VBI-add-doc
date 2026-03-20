import {
  zVBIWhereDatePredicate,
  zVBIWhereFilter,
  zVBIWhereDateFilter,
  zVBIWhereScalarFilter,
} from 'src/types/dsl/whereFilter/filters'

describe('VBIWhereDatePredicate schema', () => {
  test('parse range predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'range',
      start: '2024-01-01',
      end: '2024-02-01',
      bounds: '[)',
    })
    expect(result).toEqual({
      type: 'range',
      start: '2024-01-01',
      end: '2024-02-01',
      bounds: '[)',
    })
  })

  test('parse range predicate with default bounds', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'range',
      start: '2024-01-01',
      end: '2024-12-31',
    })
    expect(result.type).toBe('range')
    expect(result).not.toHaveProperty('bounds')
  })

  test('parse relative predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'relative',
      mode: 'last',
      amount: 7,
      unit: 'day',
    })
    expect(result).toEqual({
      type: 'relative',
      mode: 'last',
      amount: 7,
      unit: 'day',
    })
  })

  test('parse relative predicate with complete flag', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'relative',
      mode: 'last',
      amount: 3,
      unit: 'month',
      complete: true,
    })
    expect(result).toEqual({
      type: 'relative',
      mode: 'last',
      amount: 3,
      unit: 'month',
      complete: true,
    })
  })

  test('parse current predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'current',
      unit: 'month',
    })
    expect(result).toEqual({ type: 'current', unit: 'month' })
  })

  test('parse current predicate with offset', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'current',
      unit: 'month',
      offset: -1,
    })
    expect(result).toEqual({ type: 'current', unit: 'month', offset: -1 })
  })

  test('parse period year predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'period',
      unit: 'year',
      year: 2024,
    })
    expect(result).toEqual({ type: 'period', unit: 'year', year: 2024 })
  })

  test('parse period quarter predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'period',
      unit: 'quarter',
      year: 2024,
      quarter: 1,
    })
    expect(result).toEqual({ type: 'period', unit: 'quarter', year: 2024, quarter: 1 })
  })

  test('parse period month predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'period',
      unit: 'month',
      year: 2024,
      month: 3,
    })
    expect(result).toEqual({ type: 'period', unit: 'month', year: 2024, month: 3 })
  })

  test('parse period week predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'period',
      unit: 'week',
      year: 2024,
      week: 10,
    })
    expect(result).toEqual({ type: 'period', unit: 'week', year: 2024, week: 10 })
  })

  test('parse period day predicate', () => {
    const result = zVBIWhereDatePredicate.parse({
      type: 'period',
      unit: 'day',
      date: '2024-03-15',
    })
    expect(result).toEqual({ type: 'period', unit: 'day', date: '2024-03-15' })
  })

  test('reject invalid predicate type', () => {
    expect(() => zVBIWhereDatePredicate.parse({ type: 'invalid' })).toThrow()
  })

  test('reject relative with non-positive amount', () => {
    expect(() => zVBIWhereDatePredicate.parse({ type: 'relative', mode: 'last', amount: 0, unit: 'day' })).toThrow()
  })

  test('reject period quarter out of range', () => {
    expect(() => zVBIWhereDatePredicate.parse({ type: 'period', unit: 'quarter', year: 2024, quarter: 5 })).toThrow()
  })

  test('reject period month out of range', () => {
    expect(() => zVBIWhereDatePredicate.parse({ type: 'period', unit: 'month', year: 2024, month: 13 })).toThrow()
  })
})

describe('VBIWhereDateFilter schema', () => {
  test('parse date filter', () => {
    const result = zVBIWhereDateFilter.parse({
      id: 'f-1',
      field: 'order_date',
      op: 'date',
      value: { type: 'current', unit: 'month' },
    })
    expect(result.op).toBe('date')
    expect(result.value).toEqual({ type: 'current', unit: 'month' })
  })

  test('reject date filter with wrong op', () => {
    expect(() =>
      zVBIWhereDateFilter.parse({
        id: 'f-1',
        field: 'order_date',
        op: 'eq',
        value: { type: 'current', unit: 'month' },
      }),
    ).toThrow()
  })
})

describe('VBIWhereScalarFilter schema', () => {
  test('parse scalar filter', () => {
    const result = zVBIWhereScalarFilter.parse({
      id: 'f-1',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })
    expect(result.op).toBe('eq')
    expect(result.value).toBe('Beijing')
  })

  test('parse scalar filter without value', () => {
    const result = zVBIWhereScalarFilter.parse({
      id: 'f-1',
      field: 'region',
      op: 'is null',
    })
    expect(result.op).toBe('is null')
  })
})

describe('VBIWhereFilter union schema', () => {
  test('parse scalar filter through union', () => {
    const result = zVBIWhereFilter.parse({
      id: 'f-1',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })
    expect(result.op).toBe('eq')
  })

  test('parse date filter through union', () => {
    const result = zVBIWhereFilter.parse({
      id: 'f-1',
      field: 'order_date',
      op: 'date',
      value: { type: 'range', start: '2024-01-01', end: '2024-02-01' },
    })
    expect(result.op).toBe('date')
  })
})
