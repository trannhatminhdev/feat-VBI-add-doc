import { VBI } from '@visactor/vbi'
import type { VBIDSL, VBIFilter } from 'src/types/dsl'

describe('WhereFiltersBuilder', () => {
  test('addWhereFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          id: 'id-1',
          field: 'category',
          op: 'eq',
          value: 'Electronics',
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('addWhereFilter callback', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('region', (node) => {
        node.setOperator('eq').setValue('Beijing')
      })
      .add('sales', (node) => {
        node.setOperator('gt').setValue(1000)
      })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
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
      havingFilters: [],
      measures: [],
    })
  })

  test('remove by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    builder.whereFilters.remove('id-1')

    expect(builder.build().whereFilters).toEqual([{ id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' }])
  })

  test('remove not found returns this', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const result = builder.whereFilters.remove('not-exist')

    expect(result).toBe(builder.whereFilters)
    expect(builder.build().whereFilters).toEqual([{ id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' }])
  })

  test('remove by index', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      })

    builder.whereFilters.remove(1)

    expect(builder.whereFilters.toJson()).toEqual([{ id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' }])
  })

  test('remove by index out of range returns this', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const result = builder.whereFilters.remove(5)
    expect(result).toBe(builder.whereFilters)
    expect(builder.whereFilters.toJson().length).toBe(1)
  })

  test('update by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    builder.whereFilters.update('id-1', (node) => {
      node.setOperator('in').setValue(['Electronics', 'Books'])
    })

    expect(builder.build().whereFilters).toEqual([
      { id: 'id-1', field: 'category', op: 'in', value: ['Electronics', 'Books'] },
    ])
  })

  test('update nested filter by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilters.update('id-2', (node) => {
      node.setOperator('in').setValue(['Beijing', 'Shanghai'])
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-2', field: 'region', op: 'in', value: ['Beijing', 'Shanghai'] }],
      },
    ])
  })

  test('update throws error if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.whereFilters.update('not-exist', (node) => {
        node.setOperator('eq').setValue('test')
      })
    }).toThrow('Where filter with id not-exist not found')
  })

  test('find by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    const node = builder.whereFilters.find('id-1')

    expect(node).toBeDefined()
    expect((node as any).getField()).toBe('category')
    expect((node as any).toJson()).toEqual({
      id: 'id-1',
      field: 'category',
      op: 'eq',
      value: 'Electronics',
    })
  })

  test('find nested filter by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    const node = builder.whereFilters.find('id-2')

    expect(node).toBeDefined()
    expect((node as any).getField()).toBe('region')
    expect((node as any).toJson()).toEqual({
      id: 'id-2',
      field: 'region',
      op: 'eq',
      value: 'Beijing',
    })
  })

  test('find returns undefined if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('not-exist')

    expect(node).toBeUndefined()
  })

  test('clearWhereFilters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    builder.whereFilters.clear()

    expect(builder.build().whereFilters).toEqual([])
  })

  test('toJson', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))

    const json = builder.whereFilters.toJson()

    expect(json).toEqual([
      { id: 'id-1', field: 'category', op: 'eq', value: 'Electronics' },
      { id: 'id-2', field: 'region', op: 'eq', value: 'Beijing' },
    ])
  })

  test('toJson returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    expect(builder.whereFilters.toJson()).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const unobserve = builder.whereFilters.observe(() => {
      callCount++
    })

    builder.doc.transact(() => {
      builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))
    })
    expect(callCount).toBe(1)

    unobserve()

    builder.doc.transact(() => {
      builder.whereFilters.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })
    expect(callCount).toBe(1)
  })

  test('observe reacts to nested filter updates', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    let callCount = 0
    const unobserve = builder.whereFilters.observe(() => {
      callCount++
    })

    builder.doc.transact(() => {
      builder.whereFilters.update('id-2', (node) => {
        node.setValue('Shanghai')
      })
    })
    expect(callCount).toBe(1)

    unobserve()

    builder.doc.transact(() => {
      builder.whereFilters.update('id-2', (node) => {
        node.setValue('Guangzhou')
      })
    })
    expect(callCount).toBe(1)
  })

  test('WhereFilterNodeBuilder getId', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    expect((node as any).getId()).toBe('id-1')
  })

  test('WhereFilterNodeBuilder getField', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    expect((node as any).getField()).toBe('category')
  })

  test('WhereFilterNodeBuilder getOperator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    expect((node as any).getOperator()).toBe('eq')
  })

  test('WhereFilterNodeBuilder setOperator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    ;(node as any).setOperator('in')

    expect((builder.whereFilters.toJson()[0] as VBIFilter).op).toBe('in')
  })

  test('WhereFilterNodeBuilder setValue', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    ;(node as any).setValue(['Electronics', 'Books'])

    expect((builder.whereFilters.toJson()[0] as VBIFilter).value).toEqual(['Electronics', 'Books'])
  })

  test('WhereFilterNodeBuilder toJson', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const node = builder.whereFilters.find('id-1')
    expect((node as any).toJson()).toEqual({
      id: 'id-1',
      field: 'category',
      op: 'eq',
      value: 'Electronics',
    })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('sales', (node) => node.setOperator('gt').setValue(1000))

    const json = builder.whereFilters.toJson() as VBIFilter[]

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('category')
    expect(json[1].field).toBe('region')
    expect(json[2].field).toBe('sales')
  })

  test('various operators', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('field1', (node) => node.setOperator('eq').setValue('test'))
      .add('field2', (node) => node.setOperator('ne').setValue('test'))
      .add('field3', (node) => node.setOperator('gt').setValue(100))
      .add('field4', (node) => node.setOperator('gte').setValue(100))
      .add('field5', (node) => node.setOperator('lt').setValue(100))
      .add('field6', (node) => node.setOperator('lte').setValue(100))
      .add('field7', (node) => node.setOperator('in').setValue([1, 2, 3]))
      .add('field8', (node) => node.setOperator('like').setValue('%test%'))

    const json = builder.whereFilters.toJson() as VBIFilter[]

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

  test('buildVQuery handles not between range objects', () => {
    const builder = VBI.from({
      ...VBI.generateEmptyDSL('demo'),
      chartType: 'column',
      dimensions: [{ field: 'category', alias: 'category' }],
      measures: [{ field: 'sales', alias: 'sales', encoding: 'yAxis', aggregate: { func: 'sum' } }],
      whereFilters: [],
      havingFilters: [],
      version: 1,
    } as VBIDSL)

    builder.whereFilters.add('sales', (node) => {
      node.setOperator('not between').setValue({ min: 100, max: 200, leftOp: '<=', rightOp: '<=' })
    })

    expect(builder.buildVQuery().where).toEqual({
      op: 'and',
      conditions: [
        {
          op: 'or',
          conditions: [
            {
              field: 'sales',
              op: '<',
              value: 100,
            },
            {
              field: 'sales',
              op: '>',
              value: 200,
            },
          ],
        },
      ],
    })
  })
})

describe('WhereGroupBuilder', () => {
  test('addGroup with OR conditions', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
    })

    expect(builder.whereFilters.toJson()).toEqual([
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
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group
          .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
          .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
      })

    const json = builder.whereFilters.toJson()
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
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('and', (group) => {
      group
        .add('status', (node) => node.setOperator('eq').setValue('active'))
        .addGroup('or', (sub) => {
          sub
            .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
            .add('region', (node) => node.setOperator('eq').setValue('Shanghai'))
        })
    })

    expect(builder.whereFilters.toJson()).toEqual([
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
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', () => {})

    const group = builder.whereFilters.find('id-1')
    expect(group).toBeDefined()
    expect((group as any).getOperator()).toBe('or')
  })

  test('WhereGroupBuilder getId', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', () => {})

    const group = builder.whereFilters.find('id-1')
    expect((group as any).getId()).toBe('id-1')
  })

  test('WhereGroupBuilder setOperator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', () => {})

    builder.whereFilters.updateGroup('id-1', (group) => {
      group.setOperator('and')
    })

    const json = builder.whereFilters.toJson()
    expect(json[0]).toEqual({ id: 'id-1', op: 'and', conditions: [] })
  })

  test('WhereGroupBuilder remove by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilters.updateGroup('id-1', (group) => {
      group.remove('id-2')
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('remove nested filter by id from root builder', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilters.remove('id-2')

    expect(builder.whereFilters.toJson()).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('WhereGroupBuilder remove by index', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilters.updateGroup('id-1', (group) => {
      group.remove(0)
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        id: 'id-1',
        op: 'or',
        conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: 'Hangzhou' }],
      },
    ])
  })

  test('WhereGroupBuilder clear', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilters.updateGroup('id-1', (group) => {
      group.clear()
    })

    expect(builder.whereFilters.toJson()).toEqual([{ id: 'id-1', op: 'or', conditions: [] }])
  })

  test('updateGroup by id', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilters.updateGroup('id-1', (group) => {
      group.setOperator('and').add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    expect(builder.whereFilters.toJson()).toEqual([
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
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.addGroup('and', (subGroup) => {
        subGroup.add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
      })
    })

    builder.whereFilters.updateGroup('id-2', (group) => {
      group.setOperator('or').add('city', (node) => node.setOperator('eq').setValue('Shanghai'))
    })

    expect(builder.whereFilters.toJson()).toEqual([
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
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.whereFilters.updateGroup('not-exist', () => {})
    }).toThrow('Where group with id not-exist not found')
  })

  test('updateGroup throws error if item is not a group', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    expect(() => {
      builder.whereFilters.updateGroup('id-1', () => {})
    }).toThrow('Item with id id-1 is not a group')
  })

  test('from DSL with existing group gets id assigned', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', op: 'eq', value: 'Electronics' },
        {
          op: 'or',
          conditions: [
            { field: 'region', op: 'eq', value: 'Beijing' },
            { field: 'region', op: 'eq', value: 'Shanghai' },
          ],
        },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.whereFilters.toJson()
    expect((json[0] as VBIFilter).field).toBe('category')
    expect(json[0].id).toBe('id-1')
    expect(json[1].id).toBe('id-2')
  })

  test('clear removes both filters and groups', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .addGroup('or', (group) => {
        group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      })

    builder.whereFilters.clear()

    expect(builder.whereFilters.toJson()).toEqual([])
  })
})
