import { act, renderHook } from '@testing-library/react'
import type { VBIWhereFilter, VBIWhereGroup } from '@visactor/vbi'

import { useWhereFilter } from '@visactor/vbi-react'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('useWhereFilter', () => {
  it('tracks nested where filter mutations', () => {
    const builder = createTestBuilder()
    const { result } = renderHook(() => useWhereFilter(builder))

    expect(result.current.whereFilter.conditions).toEqual([])

    act(() => {
      result.current.mutateWhereFilter((whereFilter) => {
        whereFilter.add('sales', (node) => {
          node.setOperator('gt').setValue(100)
        })
        whereFilter.addGroup('or', (group) => {
          group.add('region', (node) => {
            node.setOperator('eq').setValue('East')
          })
        })
      })
    })

    expect(result.current.whereFilter.conditions).toHaveLength(2)

    const salesFilter = result.current.whereFilter.conditions[0] as VBIWhereFilter
    const regionGroup = result.current.whereFilter.conditions[1] as VBIWhereGroup
    const regionFilter = regionGroup.conditions[0] as VBIWhereFilter

    expect(salesFilter).toMatchObject({
      field: 'sales',
      op: 'gt',
      value: 100,
    })
    expect(regionGroup.op).toBe('or')
    expect(regionFilter).toMatchObject({
      field: 'region',
      op: 'eq',
      value: 'East',
    })

    act(() => {
      result.current.mutateWhereFilter((whereFilter) => {
        whereFilter.update(salesFilter.id, (node) => {
          node.setValue(200)
        })
        whereFilter.updateGroup(regionGroup.id, (group) => {
          group.setOperator('and')
        })
      })
    })

    expect((result.current.whereFilter.conditions[0] as VBIWhereFilter).value).toBe(200)
    expect((result.current.whereFilter.conditions[1] as VBIWhereGroup).op).toBe('and')

    act(() => {
      result.current.removeWhereEntry(salesFilter.id)
    })

    expect(result.current.whereFilter.conditions).toHaveLength(1)

    act(() => {
      result.current.clearWhereFilter()
    })

    expect(result.current.whereFilter.conditions).toEqual([])
  })
})
