import * as Y from 'yjs'
import { VBI } from '@visactor/vbi'
import type { VBIChartDSL, VBIWhereFilter } from 'src/types/chartDSL'

describe('WhereFilterBuilder', () => {
  test('addWhereFilter', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(builder.build()).toEqual({
      uuid: builder.getUUID(),
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'id-1',
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

  test('addWhereFilter callback', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('region', (node) => {
        node.setOperator('eq').setValue('Beijing')
      })
      .add('sales', (node) => {
        node.setOperator('gt').setValue(1000)
      })

    expect(builder.build()).toEqual({
      uuid: builder.getUUID(),
      dimensions: [],
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          {
            id: 'id-1',
            field: 'region',
            op: 'eq',
            value: 'Beijing',
          },
          {
            id: 'id-2',
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

  test('getConditions and toJSON expose the root state', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(builder.whereFilter.getConditions()).toBeInstanceOf(Y.Array)
    expect(builder.whereFilter.toJSON()).toEqual({
      id: 'root',
      op: 'and',
      conditions: [{ id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' }],
    })
  })

  test('remove by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    builder.whereFilter.remove('id-1')

    expect(builder.build().whereFilter.conditions).toEqual([
      { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
    ])
  })

  test('remove not found returns this', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const result = builder.whereFilter.remove('not-exist')

    expect(result).toBe(builder.whereFilter)
    expect(builder.build().whereFilter.conditions).toEqual([
      { id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' },
    ])
  })

  test('remove by index', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      })

    builder.whereFilter.remove(1)

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      { id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' },
    ])
  })

  test('remove by index out of range returns this', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const result = builder.whereFilter.remove(5)
    expect(result).toBe(builder.whereFilter)
    expect(builder.whereFilter.toJSON().conditions.length).toBe(1)
  })

  test('update by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    builder.whereFilter.update('id-1', (node) => {
      node.setOperator('in').setValue(['Electronics', 'Books'])
    })

    expect(builder.build().whereFilter.conditions).toEqual([
      { id: 'id-1', field: 'category', op: 'in', value: ['Electronics', 'Books'] },
    ])
  })

  test('update nested filter by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilter.update('id-2', (node) => {
      node.setOperator('in').setValue(['Beijing', 'Shanghai'])
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-2', field: 'region', op: 'in', value: ['Beijing', 'Shanghai'] }],
      },
    ])
  })

  test('update throws error if not found', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    expect(() => {
      builder.whereFilter.update('not-exist', (node) => {
        node.setOperator('eq').setValue('test')
      })
    }).toThrow('Where filter with id not-exist not found')
  })

  test('find by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')

    expect(node).toBeDefined()
    expect((node as any).getField()).toBe('category')
    expect((node as any).toJSON()).toEqual({
      id: 'id-1',
      field: 'category',
      op: 'eq',
      value: 'Electronics',
    })
  })

  test('find nested filter by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-2')

    expect(node).toBeDefined()
    expect((node as any).getField()).toBe('region')
    expect((node as any).toJSON()).toEqual({
      id: 'id-2',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })
  })

  test('find returns undefined if not found', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.whereFilter.find((entry) => entry.getId() === 'not-exist')

    expect(node).toBeUndefined()
  })

  test('clearWhereFilter', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    builder.whereFilter.clear()

    expect(builder.build().whereFilter.conditions).toEqual([])
  })

  test('toJson', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    const json = builder.whereFilter.toJSON().conditions

    expect(json).toEqual([
      { id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' },
      { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
    ])
  })

  test('toJson returns empty array when no filters', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    expect(builder.whereFilter.toJSON().conditions).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    let callCount = 0
    const unobserve = builder.whereFilter.observe(() => {
      callCount++
    })

    builder.doc.transact(() => {
      builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))
    })
    expect(callCount).toBe(1)

    unobserve()

    builder.doc.transact(() => {
      builder.whereFilter.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })
    expect(callCount).toBe(1)
  })

  test('observe reacts to nested filter updates', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    let callCount = 0
    const unobserve = builder.whereFilter.observe(() => {
      callCount++
    })

    builder.doc.transact(() => {
      builder.whereFilter.update('id-2', (node) => {
        node.setValue('Shanghai')
      })
    })
    expect(callCount).toBe(1)

    unobserve()

    builder.doc.transact(() => {
      builder.whereFilter.update('id-2', (node) => {
        node.setValue('Guangzhou')
      })
    })
    expect(callCount).toBe(1)
  })

  test('WhereFilterNodeBuilder getId', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).getId()).toBe('id-1')
  })

  test('WhereFilterNodeBuilder getField', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).getField()).toBe('category')
  })

  test('WhereFilterNodeBuilder getOperator', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).getOperator()).toBe('eq')
  })

  test('WhereFilterNodeBuilder setOperator', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    ;(node as any).setOperator('in')

    expect((builder.whereFilter.toJSON().conditions[0] as VBIWhereFilter).op).toBe('in')
  })

  test('WhereFilterNodeBuilder setValue', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    ;(node as any).setValue(['Electronics', 'Books'])

    expect((builder.whereFilter.toJSON().conditions[0] as VBIWhereFilter).value).toEqual(['Electronics', 'Books'])
  })

  test('WhereFilterNodeBuilder toJSON', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).toJSON()).toEqual({
      id: 'id-1',
      field: 'category',
      op: 'eq',
      value: 'Electronics',
    })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('sales', (node) => node.setOperator('gt').setValue(1000))

    const json = builder.whereFilter.toJSON().conditions as VBIWhereFilter[]

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('category')
    expect(json[1].field).toBe('region')
    expect(json[2].field).toBe('sales')
  })

  test('various operators', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.whereFilter
      .add('field1', (node) => node.setOperator('eq').setValue('test'))
      .add('field2', (node) => node.setOperator('ne').setValue('test'))
      .add('field3', (node) => node.setOperator('gt').setValue(100))
      .add('field4', (node) => node.setOperator('gte').setValue(100))
      .add('field5', (node) => node.setOperator('lt').setValue(100))
      .add('field6', (node) => node.setOperator('lte').setValue(100))
      .add('field7', (node) => node.setOperator('in').setValue([1, 2, 3]))
      .add('field8', (node) => node.setOperator('like').setValue('%test%'))

    const json = builder.whereFilter.toJSON().conditions as VBIWhereFilter[]

    expect(json.length).toBe(8)
    expect(json[0].op).toBe('eq')
    expect(json[1].op).toBe('ne')
    expect(json[2].op).toBe('gt')
    expect(json[3].op).toBe('gte')
    expect(json[4].op).toBe('lt')
    expect(json[5].op).toBe('lte')
    expect(json[6].op).toBe('in')
    expect(json[7].op).toBe('like')
  })

  test('buildVQuery handles not between with only min boundary', () => {
    const builder = VBI.createChart({
      ...VBI.generateEmptyChartDSL('demo'),
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'category', alias: 'category' }],
      measures: [{ id: 'id-2', field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      version: 1,
    } as VBIChartDSL)

    builder.whereFilter.add('sales', (node) => {
      node.setOperator('not between').setValue({ min: 100, max: undefined })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        {
          field: 'sales',
          op: '<',
          value: 100,
        },
      ],
    })
  })

  test('buildVQuery handles not between with only max boundary', () => {
    const builder = VBI.createChart({
      ...VBI.generateEmptyChartDSL('demo'),
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'category', alias: 'category' }],
      measures: [{ id: 'id-2', field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      version: 1,
    } as VBIChartDSL)

    builder.whereFilter.add('sales', (node) => {
      node.setOperator('not between').setValue({ min: undefined, max: 200 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        {
          field: 'sales',
          op: '>',
          value: 200,
        },
      ],
    })
  })

  test('buildVQuery handles between with array value', () => {
    const builder = VBI.createChart({
      ...VBI.generateEmptyChartDSL('demo'),
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'category', alias: 'category' }],
      measures: [{ id: 'id-2', field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      version: 1,
    } as VBIChartDSL)

    builder.whereFilter.add('sales', (node) => {
      node.setOperator('between').setValue([100, 200])
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        {
          field: 'sales',
          op: '>=',
          value: 100,
        },
        {
          field: 'sales',
          op: '<=',
          value: 200,
        },
      ],
    })
  })

  test('buildVQuery handles where filter with non-object value', () => {
    const builder = VBI.createChart({
      ...VBI.generateEmptyChartDSL('demo'),
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'category', alias: 'category' }],
      measures: [{ id: 'id-2', field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      version: 1,
    } as VBIChartDSL)

    builder.whereFilter.add('sales', (node) => {
      node.setOperator('between').setValue(100)
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [],
    })
  })
})

describe('WhereGroupBuilder', () => {
  test('addGroup with OR conditions', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [
          { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
          { id: 'id-3', field: 'region', op: 'eq', value: 'Shanghai' },
        ],
      },
    ])
  })

  test('chained add and addGroup', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group
          .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
          .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
      })

    const json = builder.whereFilter.toJSON().conditions
    expect(json.length).toBe(2)
    expect(json[0]).toEqual({ id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' })
    expect(json[1]).toEqual({
      id: 'id-2',
      op: 'or',
      conditions: [
        { id: 'id-3', field: 'region', op: 'eq', value: 'Beijing' },
        { id: 'id-4', field: 'region', op: 'eq', value: 'Shanghai' },
      ],
    })
  })

  test('nested groups', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('and', (group) => {
      group
        .add('status', (node) => node.setOperator('eq').setValue('active'))
        .addGroup('or', (sub) => {
          sub
            .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
            .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
        })
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'and',
        conditions: [
          { id: 'id-2', field: 'status', op: 'eq', value: 'active' },
          {
            id: 'id-3',
            op: 'or',
            conditions: [
              { id: 'id-4', field: 'region', op: 'eq', value: 'Beijing' },
              { id: 'id-5', field: 'region', op: 'eq', value: 'Shanghai' },
            ],
          },
        ],
      },
    ])
  })

  test('find returns WhereGroupBuilder for group', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', () => {})

    const group = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect(group).toBeDefined()
    expect((group as any).getOperator()).toBe('or')
  })

  test('WhereGroupBuilder getId', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', () => {})

    const group = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((group as any).getId()).toBe('id-1')
    expect((group as any).getConditions()).toBeInstanceOf(Y.Array)
  })

  test('WhereGroupBuilder setOperator', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', () => {})

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.setOperator('and')
    })

    const json = builder.whereFilter.toJSON().conditions
    expect(json[0]).toEqual({ id: 'id-1', op: 'and', conditions: [] })
  })

  test('WhereGroupBuilder remove by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.remove('id-2')
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('remove nested filter by id from root builder', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilter.remove('id-2')

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('WhereGroupBuilder remove by index', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.remove(0)
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('WhereGroupBuilder remove missing id is no-op', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.remove('missing-id')
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' }],
      },
    ])
  })

  test('WhereGroupBuilder clear', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.clear()
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([{ id: 'id-1', op: 'or', conditions: [] }])
  })

  test('updateGroup by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilter.updateGroup('id-1', (group) => {
      group.setOperator('and').add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'and',
        conditions: [
          { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
          { id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' },
        ],
      },
    ])
  })

  test('update nested group by id', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.addGroup('or', (group) => {
      group.addGroup('and', (subGroup) => {
        subGroup.add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
      })
    })

    builder.whereFilter.updateGroup('id-2', (group) => {
      group.setOperator('or').add('city', (node) => node.setOperator('eq').setValue('Shanghai'))
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [
          {
            id: 'id-2',
            op: 'or',
            conditions: [
              { id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' },
              { id: 'id-4', field: 'city', op: 'eq', value: 'Shanghai' },
            ],
          },
        ],
      },
    ])
  })

  test('updateGroup throws error if not found', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    expect(() => {
      builder.whereFilter.updateGroup('not-exist', () => {})
    }).toThrow('Where group with id not-exist not found')
  })

  test('updateGroup throws error if item is not a group', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    expect(() => {
      builder.whereFilter.updateGroup('id-1', () => {})
    }).toThrow('Item with id id-1 is not a group')
  })

  test('from DSL with existing group gets id assigned', () => {
    const dsl = {
      whereFilter: {
        id: 'root',
        op: 'and',
        conditions: [
          { field: 'category', op: 'eq', value: 'Electronics' },
          {
            op: 'or',
            conditions: [
              { field: 'region', op: 'eq', value: 'Beijing' },
              { field: 'region', op: 'eq', value: 'Shanghai' },
            ],
          },
        ],
      },
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const json = builder.whereFilter.toJSON().conditions
    expect((json[0] as VBIWhereFilter).field).toBe('category')
    expect(json[0].id).toBe('id-1')
    expect(json[1].id).toBe('id-2')
  })

  test('clear removes both filters and groups', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      })

    builder.whereFilter.clear()

    expect(builder.whereFilter.toJSON().conditions).toEqual([])
  })
})

describe('WhereFilterNodeBuilder date support', () => {
  test('setDate with range predicate', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'range', start: '2024-01-01', end: '2024-02-01', bounds: '[)' })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions).toEqual([
      {
        id: 'id-1',
        field: 'order_date',
        op: 'date',
        value: { type: 'range', start: '2024-01-01', end: '2024-02-01', bounds: '[)' },
      },
    ])
  })

  test('setDate with relative predicate', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'relative', mode: 'last', amount: 7, unit: 'day' })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      field: 'order_date',
      op: 'date',
      value: { type: 'relative', mode: 'last', amount: 7, unit: 'day' },
    })
  })

  test('setDate with current predicate', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month' })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      field: 'order_date',
      op: 'date',
      value: { type: 'current', unit: 'month' },
    })
  })

  test('setDate with current predicate and offset', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month', offset: -1 })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      op: 'date',
      value: { type: 'current', unit: 'month', offset: -1 },
    })
  })

  test('setDate with period year predicate', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'year', year: 2024 })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      op: 'date',
      value: { type: 'period', unit: 'year', year: 2024 },
    })
  })

  test('setDate with period quarter predicate', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'quarter', year: 2024, quarter: 1 })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      op: 'date',
      value: { type: 'period', unit: 'quarter', year: 2024, quarter: 1 },
    })
  })

  test('getDate returns predicate when set', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month' })
    })

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).getDate()).toEqual({ type: 'current', unit: 'month' })
  })

  test('getDate returns undefined for scalar filter', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    const node = builder.whereFilter.find((entry) => entry.getId() === 'id-1')
    expect((node as any).getDate()).toBeUndefined()
  })

  test('setDate chains with other builder methods', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('order_date', (node) => node.setDate({ type: 'current', unit: 'month' }))

    const conditions = builder.whereFilter.toJSON().conditions as VBIWhereFilter[]
    expect(conditions).toHaveLength(2)
    expect(conditions[0].op).toBe('eq')
    expect(conditions[1].op).toBe('date')
  })

  test('update date filter via update method', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month' })
    })

    builder.whereFilter.update('id-1', (node) => {
      node.setDate({ type: 'period', unit: 'year', year: 2024 })
    })

    const conditions = builder.whereFilter.toJSON().conditions
    expect(conditions[0]).toMatchObject({
      op: 'date',
      value: { type: 'period', unit: 'year', year: 2024 },
    })
  })
})

describe('buildVQuery date filter lowering', () => {
  const baseDSL = {
    ...VBI.generateEmptyChartDSL('demo'),
    chartType: 'column',
    dimensions: [{ id: 'id-d1', field: 'category', alias: 'category' }],
    measures: [{ id: 'id-m1', field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
    version: 1,
  } as VBIChartDSL

  test('range with default bounds [) lowers to >= and <', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'range', start: '2024-01-01', end: '2024-02-01' })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2024-02-01' },
      ],
    })
  })

  test('range with bounds [] lowers to >= and <=', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'range', start: '2024-01-01', end: '2024-12-31', bounds: '[]' })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<=', value: '2024-12-31' },
      ],
    })
  })

  test('period year lowers to >= year-start and < next-year-start', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'year', year: 2024 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2025-01-01' },
      ],
    })
  })

  test('period quarter lowers to >= quarter-start and < next-quarter-start', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'quarter', year: 2024, quarter: 1 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2024-04-01' },
      ],
    })
  })

  test('period quarter Q4 lowers correctly across year boundary', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'quarter', year: 2024, quarter: 4 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-10-01' },
        { field: 'order_date', op: '<', value: '2025-01-01' },
      ],
    })
  })

  test('period month lowers to >= month-start and < next-month-start', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'month', year: 2024, month: 3 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-03-01' },
        { field: 'order_date', op: '<', value: '2024-04-01' },
      ],
    })
  })

  test('period month December crosses year boundary', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'month', year: 2024, month: 12 })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-12-01' },
        { field: 'order_date', op: '<', value: '2025-01-01' },
      ],
    })
  })

  test('period day lowers to >= day and < next day', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'day', date: '2024-03-15' })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-03-15' },
        { field: 'order_date', op: '<', value: '2024-03-16' },
      ],
    })
  })

  test('period week lowers to >= week-start(Monday) and < next-week-start', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'period', unit: 'week', year: 2024, week: 1 })
    })

    // ISO-8601: 2024-W01 starts on Monday 2024-01-01
    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2024-01-08' },
      ],
    })
  })

  test('relative last 7 days lowers to date range', () => {
    const RealDate = globalThis.Date
    globalThis.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) super('2024-03-15T12:00:00Z')
        else super(...(args as [any]))
      }
    } as any
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'relative', mode: 'last', amount: 7, unit: 'day' })
    })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-03-08' },
        { field: 'order_date', op: '<', value: '2024-03-15' },
      ],
    })
    globalThis.Date = RealDate
  })

  test('relative next 3 months lowers to date range', () => {
    const RealDate = globalThis.Date
    globalThis.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) super('2024-03-15T12:00:00Z')
        else super(...(args as [any]))
      }
    } as any
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'relative', mode: 'next', amount: 3, unit: 'month' })
    })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-03-15' },
        { field: 'order_date', op: '<', value: '2024-06-15' },
      ],
    })
    globalThis.Date = RealDate
  })

  test('current month lowers to month bounds', () => {
    const RealDate = globalThis.Date
    globalThis.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) super('2024-03-15T12:00:00Z')
        else super(...(args as [any]))
      }
    } as any
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month' })
    })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-03-01' },
        { field: 'order_date', op: '<', value: '2024-04-01' },
      ],
    })
    globalThis.Date = RealDate
  })

  test('current month with offset -1 lowers to last month', () => {
    const RealDate = globalThis.Date
    globalThis.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) super('2024-03-15T12:00:00Z')
        else super(...(args as [any]))
      }
    } as any
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'month', offset: -1 })
    })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-02-01' },
        { field: 'order_date', op: '<', value: '2024-03-01' },
      ],
    })
    globalThis.Date = RealDate
  })

  test('current year lowers to year bounds', () => {
    const RealDate = globalThis.Date
    globalThis.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) super('2024-06-15T12:00:00Z')
        else super(...(args as [any]))
      }
    } as any
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter.add('order_date', (node) => {
      node.setDate({ type: 'current', unit: 'year' })
    })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2025-01-01' },
      ],
    })
    globalThis.Date = RealDate
  })

  test('date filter mixed with scalar filter', () => {
    const builder = VBI.createChart({ ...baseDSL })
    builder.whereFilter
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('order_date', (node) => {
        node.setDate({ type: 'range', start: '2024-01-01', end: '2024-02-01' })
      })

    const where = builder.buildVQuery().where
    expect(where).toEqual({
      op: 'and',
      conditions: [
        { field: 'region', op: 'eq', value: 'Beijing' },
        { field: 'order_date', op: '>=', value: '2024-01-01' },
        { field: 'order_date', op: '<', value: '2024-02-01' },
      ],
    })
  })
})
