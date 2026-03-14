import * as Y from 'yjs'
import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'
import { HavingFiltersNodeBuilder } from 'src/builder/sub-builders/havingFilters/having-node-builder'
import { HavingGroupBuilder } from 'src/builder/sub-builders/havingFilters/having-group-builder'
import { HavingFiltersBuilder } from 'src/builder/sub-builders/havingFilters/having-builder'

describe('HavingFiltersBuilder', () => {
  test('add having filter', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    const result = builder.build()
    expect(result.havingFilter.conditions.length).toBe(1)
    expect(result.havingFilter.conditions[0]).toMatchObject({
      field: 'sales',
      op: 'gt',
      value: 1000,
    })
    expect(result.havingFilter.conditions[0].id).toBeDefined()
  })

  test('add having filter auto-generates uuid', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => {
      node.setValue(500)
    })

    const json = builder.havingFilters.toJson()
    expect(json[0].id).toBeDefined()
    expect(typeof json[0].id).toBe('string')
  })

  test('remove by id', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('profit', (node) => node.setOperator('gt').setValue(500))

    const json = builder.havingFilters.toJson()
    const salesId = json[0].id

    builder.havingFilters.remove(salesId)

    expect(builder.havingFilters.toJson().length).toBe(1)
    expect((builder.havingFilters.toJson()[0] as any).field).toBe('profit')
  })

  test('remove by index', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('profit', (node) => node.setOperator('gt').setValue(500))

    builder.havingFilters.remove(0)

    expect(builder.havingFilters.toJson().length).toBe(1)
    expect((builder.havingFilters.toJson()[0] as any).field).toBe('profit')
  })

  test('remove non-existent id is no-op', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => node.setValue(1000))

    builder.havingFilters.remove('non-existent-id')

    expect(builder.havingFilters.toJson().length).toBe(1)
  })

  test('update by id', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    const filterId = builder.havingFilters.toJson()[0].id
    builder.havingFilters.update(filterId, (node) => {
      node.setOperator('gte').setValue(2000)
    })

    const json = builder.havingFilters.toJson()
    expect(json[0]).toMatchObject({
      field: 'sales',
      op: 'gte',
      value: 2000,
    })
  })

  test('update throws error if not found', () => {
    const builder = VBI.from({} as VBIDSL)

    expect(() => {
      builder.havingFilters.update('non-existent', (node) => {
        node.setValue(100)
      })
    }).toThrow('Having filter with id non-existent not found')
  })

  test('find by id returns node builder', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    const filterId = builder.havingFilters.toJson()[0].id
    const found = builder.havingFilters.find(filterId)

    expect(found).toBeInstanceOf(HavingFiltersNodeBuilder)
    expect((found as HavingFiltersNodeBuilder).getField()).toBe('sales')
  })

  test('find returns undefined if not found', () => {
    const builder = VBI.from({} as VBIDSL)

    expect(builder.havingFilters.find('non-existent')).toBeUndefined()
  })

  test('clear removes all filters', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => node.setValue(1000)).add('profit', (node) => node.setValue(500))

    builder.havingFilters.clear()

    expect(builder.havingFilters.toJson()).toEqual([])
  })

  test('toJson returns empty array when no filters', () => {
    const builder = VBI.from({} as VBIDSL)
    expect(builder.havingFilters.toJson()).toEqual([])
  })

  test('chained add operations', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('profit', (node) => node.setOperator('gte').setValue(500))
      .add('orders', (node) => node.setOperator('eq').setValue(100))

    const json = builder.havingFilters.toJson()
    expect(json.length).toBe(3)
    expect((json[0] as any).field).toBe('sales')
    expect((json[1] as any).field).toBe('profit')
    expect((json[2] as any).field).toBe('orders')
  })

  test('observe and unobserve', () => {
    const builder = VBI.from({} as VBIDSL)

    let callCount = 0
    const unobserve = builder.havingFilters.observe(() => {
      callCount++
    })

    builder.doc.transact(() => {
      builder.havingFilters.add('sales', (node) => node.setValue(1000))
    })
    expect(callCount).toBe(1)

    unobserve()

    builder.doc.transact(() => {
      builder.havingFilters.add('profit', (node) => node.setValue(500))
    })
    expect(callCount).toBe(1)
  })

  test('HavingFiltersNodeBuilder getId', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => node.setOperator('gt').setValue(1000))

    const filterId = builder.havingFilters.toJson()[0].id
    const node = builder.havingFilters.find(filterId) as HavingFiltersNodeBuilder

    expect(node.getId()).toBe(filterId)
  })

  test('HavingFiltersNodeBuilder getOperator', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => node.setOperator('gt').setValue(1000))

    const filterId = builder.havingFilters.toJson()[0].id
    const node = builder.havingFilters.find(filterId) as HavingFiltersNodeBuilder

    expect(node.getOperator()).toBe('gt')
  })

  test('from DSL with pre-existing filters gets ids', () => {
    const dsl = {
      havingFilter: {
        op: 'and',
        conditions: [
          { field: 'sales', op: 'gt', value: 1000 },
          { field: 'profit', op: 'gt', value: 500 },
        ],
      },
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.havingFilters.toJson()
    expect(json.length).toBe(2)
    expect(json[0].id).toBeDefined()
    expect(json[1].id).toBeDefined()
    expect((json[0] as any).field).toBe('sales')
    expect((json[1] as any).field).toBe('profit')
  })
})

describe('HavingGroupBuilder', () => {
  test('addGroup creates a group', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
      group.add('profit', (node) => node.setOperator('gt').setValue(500))
    })

    const json = builder.havingFilters.toJson()
    expect(json.length).toBe(1)
    expect(json[0]).toMatchObject({
      op: 'and',
    })
    expect('conditions' in json[0]).toBe(true)
    const group = json[0] as any
    expect(group.conditions.length).toBe(2)
    expect(group.conditions[0].field).toBe('sales')
    expect(group.conditions[1].field).toBe('profit')
  })

  test('addGroup with OR operator', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('or', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
      group.add('profit', (node) => node.setOperator('gt').setValue(500))
    })

    const json = builder.havingFilters.toJson()
    expect((json[0] as any).op).toBe('or')
  })

  test('find group by id returns HavingGroupBuilder', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    const found = builder.havingFilters.find(groupId)

    expect(found).toBeInstanceOf(HavingGroupBuilder)
  })

  test('updateGroup changes group operator', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    builder.havingFilters.updateGroup(groupId, (group) => {
      group.setOperator('or')
    })

    const json = builder.havingFilters.toJson()
    expect((json[0] as any).op).toBe('or')
  })

  test('updateGroup throws if id not found', () => {
    const builder = VBI.from({} as VBIDSL)

    expect(() => {
      builder.havingFilters.updateGroup('non-existent', (group) => {
        group.setOperator('or')
      })
    }).toThrow('Having group with id non-existent not found')
  })

  test('updateGroup throws if item is not a group', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.add('sales', (node) => node.setOperator('gt').setValue(1000))

    const filterId = builder.havingFilters.toJson()[0].id

    expect(() => {
      builder.havingFilters.updateGroup(filterId, (group) => {
        group.setOperator('or')
      })
    }).toThrow(`Item with id ${filterId} is not a group`)
  })

  test('nested groups', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (outerGroup) => {
      outerGroup.add('sales', (node) => node.setOperator('gt').setValue(1000))
      outerGroup.addGroup('or', (innerGroup) => {
        innerGroup.add('profit', (node) => node.setOperator('gt').setValue(500))
        innerGroup.add('orders', (node) => node.setOperator('gte').setValue(10))
      })
    })

    const json = builder.havingFilters.toJson()
    const outerGroupJson = json[0] as any
    expect(outerGroupJson.op).toBe('and')
    expect(outerGroupJson.conditions.length).toBe(2)
    expect(outerGroupJson.conditions[0].field).toBe('sales')

    const innerGroupJson = outerGroupJson.conditions[1]
    expect(innerGroupJson.op).toBe('or')
    expect(innerGroupJson.conditions.length).toBe(2)
    expect(innerGroupJson.conditions[0].field).toBe('profit')
    expect(innerGroupJson.conditions[1].field).toBe('orders')
  })

  test('group remove condition by id', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
      group.add('profit', (node) => node.setOperator('gt').setValue(500))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    const groupFound = builder.havingFilters.find(groupId) as HavingGroupBuilder
    const conditions = groupFound.toJson().conditions
    const salesId = conditions[0].id

    groupFound.remove(salesId)

    const updatedJson = builder.havingFilters.toJson()
    expect((updatedJson[0] as any).conditions.length).toBe(1)
    expect((updatedJson[0] as any).conditions[0].field).toBe('profit')
  })

  test('group remove condition by index', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
      group.add('profit', (node) => node.setOperator('gt').setValue(500))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    const groupFound = builder.havingFilters.find(groupId) as HavingGroupBuilder

    groupFound.remove(0)

    const updatedJson = builder.havingFilters.toJson()
    expect((updatedJson[0] as any).conditions.length).toBe(1)
    expect((updatedJson[0] as any).conditions[0].field).toBe('profit')
  })

  test('group clear conditions', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('and', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
      group.add('profit', (node) => node.setOperator('gt').setValue(500))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    const groupFound = builder.havingFilters.find(groupId) as HavingGroupBuilder

    groupFound.clear()

    expect((builder.havingFilters.toJson()[0] as any).conditions).toEqual([])
  })

  test('group getId and getOperator', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters.addGroup('or', (group) => {
      group.add('sales', (node) => node.setOperator('gt').setValue(1000))
    })

    const groupId = builder.havingFilters.toJson()[0].id
    const groupFound = builder.havingFilters.find(groupId) as HavingGroupBuilder

    expect(groupFound.getId()).toBe(groupId)
    expect(groupFound.getOperator()).toBe('or')
  })

  test('mix filters and groups at top level', () => {
    const builder = VBI.from({} as VBIDSL)
    builder.havingFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .addGroup('or', (group) => {
        group.add('profit', (node) => node.setOperator('gt').setValue(500))
        group.add('orders', (node) => node.setOperator('gte').setValue(10))
      })

    const json = builder.havingFilters.toJson()
    expect(json.length).toBe(2)
    expect((json[0] as any).field).toBe('sales')
    expect((json[1] as any).op).toBe('or')
    expect((json[1] as any).conditions.length).toBe(2)
  })

  test('isGroup and isNode static methods', () => {
    const doc = new Y.Doc()
    const root = doc.getMap('test')

    const filterMap = new Y.Map()
    root.set('filter', filterMap)
    filterMap.set('field', 'sales')
    expect(HavingFiltersBuilder.isGroup(filterMap)).toBe(false)
    expect(HavingFiltersBuilder.isNode(filterMap)).toBe(true)

    const groupMap = new Y.Map()
    root.set('group', groupMap)
    groupMap.set('op', 'and')
    groupMap.set('conditions', new Y.Array())
    expect(HavingFiltersBuilder.isGroup(groupMap)).toBe(true)
    expect(HavingFiltersBuilder.isNode(groupMap)).toBe(false)
  })

  test('from DSL with pre-existing group gets ids', () => {
    const dsl = {
      havingFilter: {
        op: 'and',
        conditions: [
          {
            op: 'and',
            conditions: [
              { field: 'sales', op: 'gt', value: 1000 },
              { field: 'profit', op: 'gt', value: 500 },
            ],
          },
        ],
      },
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.havingFilters.toJson()
    expect(json[0].id).toBeDefined()
    const group = json[0] as any
    expect(group.op).toBe('and')
    expect(group.conditions.length).toBe(2)
    expect(group.conditions[0].id).toBeDefined()
    expect(group.conditions[1].id).toBeDefined()
  })
})
