import { VBI } from '@visactor/vbi'
import type { VBIDSL, VBIFilter } from 'src/types/dsl'

describe('WhereFilterBuilder', () => {
  test('add', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'id-1',
            field: 'sales',
            op: 'gt',
            value: 1000,
          },
        ],
      },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('add with all fields', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const result = builder.build()
    const filter = result.whereFilter.conditions[0] as VBIFilter
    expect(filter.id).toBe('id-1')
    expect(filter.field).toBe('region')
    expect(filter.op).toBe('eq')
    expect(filter.value).toBe('Beijing')
  })

  test('update', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    builder.whereFilter.update('id-1', (node) => {
      node.setOperator('lt').setValue(500)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
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
      },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('remove', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })
    builder.whereFilter.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    builder.whereFilter.remove('id-2')

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
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
      },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('clear', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    builder.whereFilter.clear()

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('all', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const whereFilter = builder.whereFilter.toJSON().conditions
    expect(whereFilter).toHaveLength(2)

    const node1 = builder.whereFilter.find('id-1')
    const node2 = builder.whereFilter.find('id-2')
    expect((node1 as any).toJSON().field).toBe('sales')
    expect((node2 as any).toJSON().field).toBe('region')
  })

  test('multiple filters with chaining', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('category', (node) => node.setOperator('in').setValue(['Electronics', 'Furniture']))

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          { id: 'id-1', field: 'sales', op: 'gt', value: 1000 },
          { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
          { id: 'id-3', field: 'category', op: 'in', value: ['Electronics', 'Furniture'] },
        ],
      },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('filter with optional op', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setValue(1000)
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'id-1',
            field: 'sales',
            value: 1000,
          },
        ],
      },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('find', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilter.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })
    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const found = builder.whereFilter.find('id-2')
    expect((found as any).toJSON()).toEqual({
      id: 'id-2',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })

    const notFound = builder.whereFilter.find('nonexistent')
    expect(notFound).toBeUndefined()
  })
})
