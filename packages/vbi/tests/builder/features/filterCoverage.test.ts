import * as Y from 'yjs'
import { VBI } from '@visactor/vbi'
import { HavingFilterBuilder } from 'src/chart-builder/features/havingFilter/having-builder'
import {
  createHavingGroup,
  findEntry as findHavingEntry,
  isHavingGroup,
} from 'src/chart-builder/features/havingFilter/having-utils'
import { WhereFilterBuilder } from 'src/chart-builder/features/whereFilter/where-builder'
import {
  createWhereGroup,
  findEntry as findWhereEntry,
  isWhereGroup,
} from 'src/chart-builder/features/whereFilter/where-utils'
import type { VBIChartDSL } from 'src/types/chartDSL'

describe('Where filter internals', () => {
  test('constructor initializes a missing whereFilter root on plain Y DSL', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const builder = new WhereFilterBuilder(doc, dsl)

    expect(dsl.get('whereFilter')).toBeInstanceOf(Y.Map)
    expect(builder.toJSON()).toEqual({ id: 'root', op: 'and', conditions: [] })
  })

  test('constructor repairs an incomplete existing whereFilter root', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const whereFilter = new Y.Map<any>()
    dsl.set('whereFilter', whereFilter)

    const builder = new WhereFilterBuilder(doc, dsl)

    expect(builder.getConditions()).toBeInstanceOf(Y.Array)
    expect(builder.toJSON()).toEqual({ id: 'root', op: 'and', conditions: [] })
  })

  test('update throws when the target id belongs to a group', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.whereFilter.addGroup('or', () => {})

    expect(() => {
      builder.whereFilter.update('id-1', (node) => {
        node.setValue('unexpected')
      })
    }).toThrow('Item with id id-1 is not a filter')
  })

  test('group remove supports id deletion, out-of-range indexes and JSON export', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.whereFilter.addGroup('and', (group) => {
      group.add('province', (node) => node.setOperator('eq').setValue('浙江'))
      group.add('city', (node) => node.setOperator('eq').setValue('杭州'))
    })

    const group = builder.whereFilter.find((entry) => entry.getId() === 'id-1') as any
    group.remove('id-2')
    group.remove(99)

    expect(group.toJSON()).toEqual({
      id: 'id-1',
      op: 'and',
      conditions: [{ id: 'id-3', field: 'city', op: 'eq', value: '杭州' }],
    })
  })

  test('node setField updates the serialized where filter', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.whereFilter.add('province', (node) => {
      node.setField('city').setOperator('eq').setValue('杭州')
    })

    expect(builder.whereFilter.toJSON().conditions).toEqual([{ id: 'id-1', field: 'city', op: 'eq', value: '杭州' }])
  })

  test('where utils create groups and return undefined for missing nested ids', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const rootConditions = new Y.Array<any>()
    const group = createWhereGroup('or', 'group-1')
    dsl.set('whereRoot', rootConditions)
    rootConditions.push([group])
    const groupConditions = group.get('conditions') as Y.Array<any>
    const filter = new Y.Map<any>()
    filter.set('id', 'filter-1')
    filter.set('field', 'province')
    groupConditions.push([filter])

    expect(isWhereGroup(group)).toBe(true)
    expect(findWhereEntry(rootConditions, 'missing-id')).toBeUndefined()
  })
})

describe('Having filter internals', () => {
  test('constructor initializes a missing havingFilter root on plain Y DSL', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const builder = new HavingFilterBuilder(doc, dsl)

    expect(dsl.get('havingFilter')).toBeInstanceOf(Y.Map)
    expect(builder.toJSON()).toEqual({ id: 'root', op: 'and', conditions: [] })
  })

  test('constructor repairs an incomplete existing havingFilter root', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const havingFilter = new Y.Map<any>()
    dsl.set('havingFilter', havingFilter)

    const builder = new HavingFilterBuilder(doc, dsl)

    expect(builder.getConditions()).toBeInstanceOf(Y.Array)
    expect(builder.toJSON()).toEqual({ id: 'root', op: 'and', conditions: [] })
  })

  test('update throws when the target id belongs to a group', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.havingFilter.addGroup('or', () => {})

    expect(() => {
      builder.havingFilter.update('id-1', (node) => {
        node.setValue('unexpected')
      })
    }).toThrow('Item with id id-1 is not a filter')
  })

  test('group remove supports id deletion, out-of-range indexes and JSON export', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.havingFilter.addGroup('and', (group) => {
      group.add('销售额', (node) => node.setOperator('gt').setValue(1000))
      group.add('利润', (node) => node.setOperator('gt').setValue(200))
    })

    const group = builder.havingFilter.find((entry) => entry.getId() === 'id-1') as any
    group.remove('id-2')
    group.remove(99)

    expect(group.toJSON()).toEqual({
      id: 'id-1',
      op: 'and',
      conditions: [{ id: 'id-3', field: '利润', aggregate: { func: 'sum' }, op: 'gt', value: 200 }],
    })
  })

  test('node JSON export covers the final serialized having filter', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    builder.havingFilter.add('销售额', (node) => {
      node.setOperator('gte').setValue(1000)
    })

    const node = builder.havingFilter.find((entry) => entry.getId() === 'id-1') as any
    expect(node.toJSON()).toEqual({ id: 'id-1', field: '销售额', aggregate: { func: 'sum' }, op: 'gte', value: 1000 })
  })

  test('having utils create groups and return undefined for missing nested ids', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const rootConditions = new Y.Array<any>()
    const group = createHavingGroup('or', 'group-1')
    dsl.set('havingRoot', rootConditions)
    rootConditions.push([group])
    const groupConditions = group.get('conditions') as Y.Array<any>
    const filter = new Y.Map<any>()
    filter.set('id', 'filter-1')
    filter.set('field', 'sales')
    groupConditions.push([filter])

    expect(isHavingGroup(group)).toBe(true)
    expect(findHavingEntry(rootConditions, 'missing-id')).toBeUndefined()
  })

  test('having utils return a nested match when the id exists in a child group', () => {
    const doc = new Y.Doc()
    const dsl = doc.getMap('dsl')
    const rootConditions = new Y.Array<any>()
    const group = createHavingGroup('or', 'group-1')
    dsl.set('havingRoot', rootConditions)
    rootConditions.push([group])

    const nestedCollection = group.get('conditions') as Y.Array<any>
    const filter = new Y.Map<any>()
    filter.set('id', 'filter-1')
    filter.set('field', 'sales')
    nestedCollection.push([filter])

    expect(findHavingEntry(rootConditions, 'filter-1')).toEqual({
      collection: nestedCollection,
      index: 0,
      item: filter,
    })
  })
})
