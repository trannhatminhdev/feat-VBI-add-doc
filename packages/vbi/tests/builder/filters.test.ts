import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

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
    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const result = builder.build()
    expect(result.whereFilters[0].field).toBe('region')
    expect(result.whereFilters[0].operator).toBe('eq')
    expect(result.whereFilters[0].value).toBe('Beijing')
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

    const whereFilters = builder.whereFilters.findAll()
    expect(whereFilters).toHaveLength(2)
    expect(whereFilters[0].toJson().field).toBe('sales')
    expect(whereFilters[1].toJson().field).toBe('region')
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
    builder.whereFilters.add('sales', (node) => {
      // operator is optional
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
      operator: 'eq',
      value: 'Beijing',
    })

    const notFound = builder.whereFilters.find('nonexistent')
    expect(notFound).toBeUndefined()
  })
})
