import { VBI } from '@visactor/vbi'
import type { VBIDSL, VBIFilter } from 'src/types/dsl'

describe('WhereFiltersBuilder', () => {
  test('add', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          op: 'gt',
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
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const result = builder.build()
    const filter = result.whereFilters[0] as VBIFilter
    expect(filter.field).toBe('region')
    expect(filter.op).toBe('eq')
    expect(filter.value).toBe('Beijing')
  })

  test('update', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    // Update the first filter
    builder.whereFilters.update('sales', (node) => {
      node.setOperator('lt').setValue(500)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          op: 'lt',
          value: 500,
        },
        {
          field: 'region',
          op: 'eq',
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
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })
    builder.whereFilters.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    // Remove the second filter
    builder.whereFilters.remove('region')

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          op: 'gt',
          value: 1000,
        },
        {
          field: 'category',
          op: 'eq',
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
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
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
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const whereFilters = builder.whereFilters.toJson()
    expect(whereFilters).toHaveLength(2)
    expect(builder.whereFilters.find('sales')?.toJson().field).toBe('sales')
    expect(builder.whereFilters.find('region')?.toJson().field).toBe('region')
  })

  test('multiple filters with chaining', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('category', (node) => node.setOperator('in').setValue(['Electronics', 'Furniture']))

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'sales',
          op: 'gt',
          value: 1000,
        },
        {
          field: 'region',
          op: 'eq',
          value: 'Beijing',
        },
        {
          field: 'category',
          op: 'in',
          value: ['Electronics', 'Furniture'],
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('filter with optional op', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('sales', (node) => {
      // op is optional
      node.setValue(1000)
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

  test('find', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const found = builder.whereFilters.find('region')
    expect(found?.toJson()).toEqual({
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })

    const notFound = builder.whereFilters.find('nonexistent')
    expect(notFound).toBeUndefined()
  })
})
