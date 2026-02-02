import { deleteDimensionTreeByCallback } from 'src/pipeline/utils/dimensions/delete'
import { isDimension, isDimensionGroup } from 'src/pipeline/utils/dimensions/typeGuard'
import type { DimensionGroup, DimensionTree } from 'src/types'

describe('deleteDimensionTreeByCallback', () => {
  it('should return undefined if tree is undefined', () => {
    expect(deleteDimensionTreeByCallback(undefined)).toBeUndefined()
  })

  it('should delete dimension from flat tree', () => {
    const tree: DimensionTree = [
      { id: 'd1', field: 'f1' } as any,
      { id: 'd2', field: 'f2' } as any,
    ]
    deleteDimensionTreeByCallback(tree, (dim) => dim.id === 'd1')
    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('d2')
  })

  it('should delete dimension from nested tree', () => {
    const tree: DimensionTree = [
      {
        id: 'g1',
        children: [
          { id: 'd1', field: 'f1' } as any,
          { id: 'd2', field: 'f2' } as any,
        ],
      },
    ]
    deleteDimensionTreeByCallback(tree, (dim) => dim.id === 'd1')
    expect((tree[0] as DimensionGroup).children).toHaveLength(1)
  })
})

describe('typeGuard', () => {
  it('isDimension', () => {
    expect(isDimension({ id: 'd1', field: 'f1' } as any)).toBe(true)
    expect(isDimension({ id: 'g1', children: [] })).toBe(false)
  })
  it('isDimensionGroup', () => {
      expect(isDimensionGroup({ id: 'd1', field: 'f1' } as any)).toBe(false)
      expect(isDimensionGroup({ id: 'g1', children: [] })).toBe(true)
    })
})
