import { VBI } from '@visactor/vbi'
import type { VBIDSL } from 'src/types/dsl'

describe('sort builders', () => {
  test('DimensionNodeBuilder set/get/clearSort works', () => {
    const builder = VBI.from({
      dimensions: [{ id: 'd-1', field: 'area', alias: '区域' }],
    } as VBIDSL)

    builder.dimensions.update('d-1', (node) => {
      node.setSort({ order: 'asc' })
    })

    const node = builder.dimensions.find((item) => item.getId() === 'd-1')
    expect(node?.getSort()).toEqual({ order: 'asc' })
    expect(node?.toJSON()).toMatchObject({ sort: { order: 'asc' } })

    builder.dimensions.update('d-1', (item) => {
      item.clearSort()
    })

    expect(node?.getSort()).toBeUndefined()
    expect(node?.toJSON().sort).toBeUndefined()
  })

  test('DimensionNodeBuilder setSort supports chaining', () => {
    const builder = VBI.from({} as VBIDSL)

    builder.dimensions.add('area', (node) => {
      node.setAlias('区域').setSort({ order: 'desc' })
    })

    expect(builder.dimensions.toJSON()[0]).toMatchObject({
      alias: '区域',
      sort: { order: 'desc' },
    })
  })

  test('MeasureNodeBuilder set/get/clearSort works', () => {
    const builder = VBI.from({
      measures: [{ id: 'm-1', field: 'sales', alias: '销售额', encoding: 'column', aggregate: { func: 'sum' } }],
    } as VBIDSL)

    builder.measures.update('m-1', (node) => {
      node.setSort({ order: 'desc' })
    })

    const node = builder.measures.find((item) => item.getId() === 'm-1')
    expect(node?.getSort()).toEqual({ order: 'desc' })
    expect(node?.toJSON()).toMatchObject({ sort: { order: 'desc' } })

    builder.measures.update('m-1', (item) => {
      item.clearSort()
    })

    expect(node?.getSort()).toBeUndefined()
    expect(node?.toJSON().sort).toBeUndefined()
  })

  test('MeasureNodeBuilder setSort supports chaining', () => {
    const builder = VBI.from({} as VBIDSL)

    builder.measures.add('sales', (node) => {
      node.setAlias('销售额').setSort({ order: 'asc' }).setAggregate({ func: 'sum' })
    })

    expect(builder.measures.toJSON()[0]).toMatchObject({
      alias: '销售额',
      aggregate: { func: 'sum' },
      sort: { order: 'asc' },
    })
  })
})
