import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('WhereFiltersBuilder', () => {
  test('addWhereFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.addWhereFilter({
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
      measures: [],
    })
  })

  test('addWhereFilter with all fields', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.addWhereFilter({
      field: 'region',
      operator: 'eq',
      value: 'Beijing',
    })

    const result = builder.build()
    expect(result.whereFilters[0].field).toBe('region')
    expect(result.whereFilters[0].operator).toBe('eq')
    expect(result.whereFilters[0].value).toBe('Beijing')
  })

  test('updateWhereFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .addWhereFilter({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .addWhereFilter({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })

    // Update the first filter
    builder.whereFilters.updateWhereFilter(0, {
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
      measures: [],
    })
  })

  test('removeWhereFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .addWhereFilter({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .addWhereFilter({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })
      .addWhereFilter({
        field: 'category',
        operator: 'eq',
        value: 'Electronics',
      })

    // Remove the second filter (index 1)
    builder.whereFilters.removeWhereFilter(1)

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
      measures: [],
    })
  })

  test('clearWhereFilters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .addWhereFilter({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .addWhereFilter({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })

    // Clear all filters
    builder.whereFilters.clearWhereFilters()

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [],
      measures: [],
    })
  })

  test('getWhereFilters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.addWhereFilter({
      field: 'sales',
      operator: 'gt',
      value: 1000,
    })
    builder.whereFilters.addWhereFilter({
      field: 'region',
      operator: 'eq',
      value: 'Beijing',
    })

    const whereFilters = builder.whereFilters.getWhereFilters()
    expect(whereFilters).toHaveLength(2)
    expect(whereFilters[0].field).toBe('sales')
    expect(whereFilters[1].field).toBe('region')
  })

  test('multiple filters with chaining', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .addWhereFilter({
        field: 'sales',
        operator: 'gt',
        value: 1000,
      })
      .addWhereFilter({
        field: 'region',
        operator: 'eq',
        value: 'Beijing',
      })
      .addWhereFilter({
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
      measures: [],
    })
  })

  test('filter with optional operator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.addWhereFilter({
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
      measures: [],
    })
  })
})
