import { zVBIDimensionGroupSchema, zVBIDimensionTree } from 'src/types/dsl/dimensions/dimensions'
import { zVBIHavingClause, zVBIHavingFilter, zVBIHavingGroup } from 'src/types/dsl/havingFilter/having'
import { zVBIDSLLocale } from 'src/types/dsl/locale/locale'
import { zVBIMeasure, zVBIMeasureGroup, zVBIMeasureTree } from 'src/types/dsl/measures/measures'
import { zVBIDSLTheme } from 'src/types/dsl/theme/theme'
import { zVBIDSL } from 'src/types/dsl/vbi/vbi'
import { zVBIFilter, zVBIWhereClause, zVBIWhereGroup } from 'src/types/dsl/whereFilter/filters'
import {
  findTreeNodesBy,
  id,
  isVBIHavingFilter,
  isVBIHavingGroup,
  isVBIFilter,
  isVBIWhereGroup,
  preorderTraverse,
} from 'src/utils'

describe('DSL schemas', () => {
  test('parse where filter clauses and groups', () => {
    const filter = zVBIFilter.parse({ id: 'f-1', field: 'province', op: 'eq', value: '浙江' })
    const group = zVBIWhereGroup.parse({
      id: 'root',
      op: 'and',
      conditions: [filter, { id: 'g-1', op: 'or', conditions: [{ id: 'f-2', field: 'area' }] }],
    })

    expect(zVBIWhereClause.parse(filter)).toEqual(filter)
    expect(group.conditions).toHaveLength(2)
  })

  test('parse having filter clauses and groups', () => {
    const filter = zVBIHavingFilter.parse({ id: 'h-1', field: '销售额', op: 'gt', value: 1000 })
    const group = zVBIHavingGroup.parse({
      id: 'root',
      op: 'and',
      conditions: [filter, { id: 'g-1', op: 'or', conditions: [{ id: 'h-2', field: '利润' }] }],
    })

    expect(zVBIHavingClause.parse(filter)).toEqual(filter)
    expect(group.conditions).toHaveLength(2)
  })

  test('parse locale, theme and full VBI DSL', () => {
    expect(zVBIDSLTheme.parse('dark')).toBe('dark')
    expect(zVBIDSLLocale.parse('en-US')).toBe('en-US')

    const dsl = zVBIDSL.parse({
      connectorId: 'demo',
      chartType: 'table',
      dimensions: [],
      measures: [],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
    })

    expect(dsl.whereFilter.id).toBe('root')
    expect(dsl.havingFilter.id).toBe('root')
  })

  test('parse dimension and measure tree schemas', () => {
    const dimensionGroup = zVBIDimensionGroupSchema.parse({
      alias: '地区层级',
      children: [{ field: 'province', alias: '省份' }],
    })
    const measure = zVBIMeasure.parse({
      field: 'sales',
      alias: '销售额',
      encoding: 'yAxis',
      aggregate: { func: 'sum' },
    })
    const measureGroup = zVBIMeasureGroup.parse({
      alias: '指标分组',
      children: [measure],
    })

    expect(zVBIDimensionTree.parse([dimensionGroup])).toHaveLength(1)
    expect(zVBIMeasureTree.parse([measureGroup])).toHaveLength(1)
  })
})

describe('runtime guards and utils', () => {
  test('guard helpers narrow where and having clauses', () => {
    const whereFilter = { id: 'f-1', field: 'province', op: 'eq', value: '浙江' }
    const whereGroup = { id: 'g-1', op: 'and' as const, conditions: [whereFilter] }
    const havingFilter = { id: 'h-1', field: '销售额', op: 'gt', value: 1000 }
    const havingGroup = { id: 'g-2', op: 'or' as const, conditions: [havingFilter] }

    expect(isVBIFilter(whereFilter)).toBe(true)
    expect(isVBIWhereGroup(whereGroup)).toBe(true)
    expect(isVBIHavingFilter(havingFilter)).toBe(true)
    expect(isVBIHavingGroup(havingGroup)).toBe(true)
  })

  test('runtime utility exports stay callable', () => {
    expect(id.uuid()).toBe('id-1')
    expect(typeof preorderTraverse).toBe('function')
    expect(typeof findTreeNodesBy).toBe('function')
  })
})
