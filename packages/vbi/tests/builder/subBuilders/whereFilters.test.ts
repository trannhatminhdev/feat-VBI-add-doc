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
          field: 'region',
          op: 'eq',
          value: 'Beijing',
        },
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

  test('removeWhereFilter', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', op: 'eq', value: 'Electronics' },
        { field: 'region', op: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.remove('category')

    expect(builder.build().whereFilters).toEqual([{ field: 'region', op: 'eq', value: 'Beijing' }])
  })

  test('removeWhereFilter not found returns this', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const result = builder.whereFilters.remove('notExist')

    expect(result).toBe(builder.whereFilters)
    expect(builder.build().whereFilters).toEqual([{ field: 'category', op: 'eq', value: 'Electronics' }])
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

    expect(builder.whereFilters.toJson()).toEqual([{ field: 'category', op: 'eq', value: 'Electronics' }])
  })

  test('remove by index out of range returns this', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    const result = builder.whereFilters.remove(5)
    expect(result).toBe(builder.whereFilters)
    expect(builder.whereFilters.toJson().length).toBe(1)
  })

  test('updateWhereFilter', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.update('category', (node) => {
      node.setOperator('in').setValue(['Electronics', 'Books'])
    })

    expect(builder.build().whereFilters).toEqual([{ field: 'category', op: 'in', value: ['Electronics', 'Books'] }])
  })

  test('updateWhereFilter throws error if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.whereFilters.update('notExist', (node) => {
        node.setOperator('eq').setValue('test')
      })
    }).toThrow('Where filter with field notExist not found')
  })

  test('findWhereFilter', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', op: 'eq', value: 'Electronics' },
        { field: 'region', op: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')

    expect(node?.getField()).toBe('category')
    expect(node?.toJson()).toEqual({ field: 'category', op: 'eq', value: 'Electronics' })
  })

  test('findWhereFilter returns undefined if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('notExist')

    expect(node).toBeUndefined()
  })

  test('clearWhereFilters', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', op: 'eq', value: 'Electronics' },
        { field: 'region', op: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.clear()

    expect(builder.build().whereFilters).toEqual([])
  })

  test('toJson', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', op: 'eq', value: 'Electronics' },
        { field: 'region', op: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.whereFilters.toJson()

    expect(json).toEqual([
      { field: 'category', op: 'eq', value: 'Electronics' },
      { field: 'region', op: 'eq', value: 'Beijing' },
    ])
  })

  test('toJson returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.whereFilters.toJson()

    expect(json).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }
    const unobserve = builder.whereFilters.observe(callback)

    builder.whereFilters.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(callCount).toBe(1)

    unobserve()

    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    expect(callCount).toBe(1)
  })

  test('WhereFilterNodeBuilder getField', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')

    expect(node?.getField()).toBe('category')
  })

  test('WhereFilterNodeBuilder getOperator', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')

    expect(node?.getOperator()).toBe('eq')
  })

  test('WhereFilterNodeBuilder setOperator', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    node?.setOperator('in')

    expect((builder.whereFilters.toJson()[0] as VBIFilter).op).toBe('in')
  })

  test('WhereFilterNodeBuilder setValue', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    node?.setValue(['Electronics', 'Books'])

    expect((builder.whereFilters.toJson()[0] as VBIFilter).value).toEqual(['Electronics', 'Books'])
  })

  test('WhereFilterNodeBuilder toJson', () => {
    const dsl = { whereFilters: [{ field: 'category', op: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    const json = node?.toJson()

    expect(json).toEqual({ field: 'category', op: 'eq', value: 'Electronics' })
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
        op: 'or',
        conditions: [
          { field: 'region', op: 'eq', value: 'Beijing' },
          { field: 'region', op: 'eq', value: 'Shanghai' },
        ],
      },
    ])
  })

  test('addGroup with AND conditions', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('and', (group) => {
      group
        .add('sales', (node) => node.setOperator('gt').setValue(100))
        .add('sales', (node) => node.setOperator('lt').setValue(1000))
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        op: 'and',
        conditions: [
          { field: 'sales', op: 'gt', value: 100 },
          { field: 'sales', op: 'lt', value: 1000 },
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
    expect(json[0]).toEqual({ field: 'category', op: 'eq', value: 'Electronics' })
    expect(json[1]).toEqual({
      op: 'or',
      conditions: [
        { field: 'region', op: 'eq', value: 'Beijing' },
        { field: 'region', op: 'eq', value: 'Shanghai' },
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
        op: 'and',
        conditions: [
          { field: 'status', op: 'eq', value: 'active' },
          {
            op: 'or',
            conditions: [
              { field: 'region', op: 'eq', value: 'Beijing' },
              { field: 'region', op: 'eq', value: 'Shanghai' },
            ],
          },
        ],
      },
    ])
  })

  test('WhereGroupBuilder getOperator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', () => {})

    const json = builder.whereFilters.toJson()
    expect(json[0]).toEqual({ op: 'or', conditions: [] })
  })

  test('WhereGroupBuilder setOperator', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', () => {})

    builder.whereFilters.updateGroup(0, (group) => {
      group.setOperator('and')
    })

    const json = builder.whereFilters.toJson()
    expect(json[0]).toEqual({ op: 'and', conditions: [] })
  })

  test('WhereGroupBuilder remove by field', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group
        .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
        .add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    builder.whereFilters.updateGroup(0, (group) => {
      group.remove('region')
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        op: 'or',
        conditions: [{ field: 'city', op: 'eq', value: 'Hangzhou' }],
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

    builder.whereFilters.updateGroup(0, (group) => {
      group.remove(0)
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        op: 'or',
        conditions: [{ field: 'city', op: 'eq', value: 'Hangzhou' }],
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

    builder.whereFilters.updateGroup(0, (group) => {
      group.clear()
    })

    expect(builder.whereFilters.toJson()).toEqual([{ op: 'or', conditions: [] }])
  })

  test('WhereGroupBuilder toJson', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        op: 'or',
        conditions: [{ field: 'region', op: 'eq', value: 'Beijing' }],
      },
    ])
  })

  test('updateGroup', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.addGroup('or', (group) => {
      group.add('region', (node) => node.setOperator('eq').setValue('Beijing'))
    })

    builder.whereFilters.updateGroup(0, (group) => {
      group.setOperator('and').add('city', (node) => node.setOperator('eq').setValue('Hangzhou'))
    })

    expect(builder.whereFilters.toJson()).toEqual([
      {
        op: 'and',
        conditions: [
          { field: 'region', op: 'eq', value: 'Beijing' },
          { field: 'city', op: 'eq', value: 'Hangzhou' },
        ],
      },
    ])
  })

  test('updateGroup throws error if index out of range', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.whereFilters.updateGroup(0, () => {})
    }).toThrow('Where group at index 0 not found')
  })

  test('updateGroup throws error if item is not a group', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.add('category', (node) => node.setOperator('eq').setValue('Electronics'))

    expect(() => {
      builder.whereFilters.updateGroup(0, () => {})
    }).toThrow('Item at index 0 is not a group')
  })

  test('from DSL with existing group', () => {
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
    expect(json).toEqual([
      { field: 'category', op: 'eq', value: 'Electronics' },
      {
        op: 'or',
        conditions: [
          { field: 'region', op: 'eq', value: 'Beijing' },
          { field: 'region', op: 'eq', value: 'Shanghai' },
        ],
      },
    ])
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
