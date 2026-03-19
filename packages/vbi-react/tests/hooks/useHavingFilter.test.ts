import { act, renderHook } from '@testing-library/react'
import type { VBIHavingFilter, VBIHavingGroup } from '@visactor/vbi'

import { useHavingFilter } from '@visactor/vbi-react'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('useHavingFilter', () => {
  it('tracks nested having filter mutations', () => {
    const builder = createTestBuilder()
    const { result } = renderHook(() => useHavingFilter(builder))

    expect(result.current.havingFilter.conditions).toEqual([])

    act(() => {
      result.current.mutateHavingFilter((havingFilter) => {
        havingFilter.add('sales', (node) => {
          node.setAggregate({ func: 'avg' }).setOperator('gt').setValue(1000)
        })
        havingFilter.addGroup('or', (group) => {
          group.add('profit', (node) => {
            node.setOperator('lt').setValue(50)
          })
        })
      })
    })

    expect(result.current.havingFilter.conditions).toHaveLength(2)

    const salesFilter = result.current.havingFilter.conditions[0] as VBIHavingFilter
    const profitGroup = result.current.havingFilter.conditions[1] as VBIHavingGroup
    const profitFilter = profitGroup.conditions[0] as VBIHavingFilter

    expect(salesFilter).toMatchObject({
      aggregate: { func: 'avg' },
      field: 'sales',
      op: 'gt',
      value: 1000,
    })
    expect(profitGroup.op).toBe('or')
    expect(profitFilter).toMatchObject({
      aggregate: { func: 'sum' },
      field: 'profit',
      op: 'lt',
      value: 50,
    })

    act(() => {
      result.current.mutateHavingFilter((havingFilter) => {
        havingFilter.update(salesFilter.id, (node) => {
          node.setValue(2000)
        })
        havingFilter.updateGroup(profitGroup.id, (group) => {
          group.setOperator('and')
        })
      })
    })

    expect((result.current.havingFilter.conditions[0] as VBIHavingFilter).value).toBe(2000)
    expect((result.current.havingFilter.conditions[1] as VBIHavingGroup).op).toBe('and')

    act(() => {
      result.current.removeHavingEntry(salesFilter.id)
    })

    expect(result.current.havingFilter.conditions).toHaveLength(1)

    act(() => {
      result.current.clearHavingFilter()
    })

    expect(result.current.havingFilter.conditions).toEqual([])
  })
})
