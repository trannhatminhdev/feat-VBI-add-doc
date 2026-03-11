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
          id: 'id-1',
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
    expect(filter.id).toBe('id-1')
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

    builder.whereFilters.update('id-1', (node) => {
      node.setOperator('lt').setValue(500)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          id: 'id-1',
          field: 'sales',
          op: 'lt',
          value: 500,
        },
        {
          id: 'id-2',
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

    builder.whereFilters.remove('id-2')

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          id: 'id-1',
          field: 'sales',
          op: 'gt',
          value: 1000,
        },
        {
          id: 'id-3',
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

    const node1 = builder.whereFilters.find('id-1')
    const node2 = builder.whereFilters.find('id-2')
    expect((node1 as any).toJson().field).toBe('sales')
    expect((node2 as any).toJson().field).toBe('region')
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
        { id: 'id-1', field: 'sales', op: 'gt', value: 1000 },
        { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
        { id: 'id-3', field: 'category', op: 'in', value: ['Electronics', 'Furniture'] },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('filter with optional op', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('sales', (node) => {
      node.setValue(1000)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          id: 'id-1',
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

    const found = builder.whereFilters.find('id-2')
    expect((found as any).toJson()).toEqual({
      id: 'id-2',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })

    const notFound = builder.whereFilters.find('nonexistent')
    expect(notFound).toBeUndefined()
  })
})
