import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('WhereFiltersBuilder', () => {
  test('add', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add({
      field: 'sales',
      operator: 'gt',
      value: 1000,
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          operator: 'gt',
          value: 1000,
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('add with all fields', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add({
      field: 'region',
      operator: 'eq',
      value: 'Beijing',
    })

    const result = builder.build()
    expect(result.whereFilters[0].field).toBe('region')
    expect(result.whereFilters[0].operator).toBe('eq')
    expect(result.whereFilters[0].value).toBe('Beijing')
  })

  test('update', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .add({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })

    // Update the first filter
    builder.whereFilters.update(0, {
      operator: 'lt',
      value: 500,
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          operator: 'lt',
          value: 500,
        },
        {
          field: 'region',
          operator: 'eq',
          value: 'Beijing',
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('remove', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .add({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })
      .add({
        field: 'category',
        operator: 'eq',
        value: 'Electronics',
      })

    // Remove the second filter (index 1)
    builder.whereFilters.remove(1)

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          operator: 'gt',
          value: 1000,
        },
        {
          field: 'category',
          operator: 'eq',
          value: 'Electronics',
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('clear', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .add({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })

    // Clear all filters
    builder.whereFilters.clear()

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [],
      havingFilters: [],
      measures: [],
    })
  })

  test('all', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add({
      field: 'sales',
      operator: 'gt',
      value: 1000,
    })
    builder.whereFilters.add({
      field: 'region',
      operator: 'eq',
      value: 'Beijing',
    })

    const whereFilters = builder.whereFilters.findAll()
    expect(whereFilters).toHaveLength(2)
    expect(whereFilters[0].field).toBe('sales')
    expect(whereFilters[1].field).toBe('region')
  })

  test('multiple filters with chaining', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .add({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })
      .add({
        field: 'category',
        operator: 'in',
        value: ['Electronics', 'Furniture'],
      })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          operator: 'gt',
          value: 1000,
        },
        {
          field: 'region',
          operator: 'eq',
          value: 'Beijing',
        },
        {
          field: 'category',
          operator: 'in',
          value: ['Electronics', 'Furniture'],
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('filter with optional operator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add({
      field: 'sales',
      // operator is optional
      value: 1000,
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          value: 1000,
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })
})
