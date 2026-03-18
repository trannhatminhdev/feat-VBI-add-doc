import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'
import { DimensionsBuilder } from 'src/builder/features/dimensions/dim-builder'

describe('DimensionsBuilder', () => {
  test('addDimension', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.dimensions.add('category', (node) => {
      node.setAlias('类别')
    })

    expect(builder.build()).toEqual({
      dimensions: [
        {
          id: 'id-1',
          alias: '类别',
          field: 'category',
        },
      ],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('addDimension callback', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.dimensions
      .add('region', (node) => {
        node.setAlias('地区')
      })
      .add('city', (node) => {
        node.setAlias('城市')
      })

    expect(builder.build()).toEqual({
      dimensions: [
        {
          id: 'id-1',
          alias: '地区',
          field: 'region',
        },
        {
          id: 'id-2',
          alias: '城市',
          field: 'city',
        },
      ],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [],
    })
  })

  test('removeDimension', () => {
    const dsl = {
      dimensions: [
        { field: 'category', alias: '类别' },
        { field: 'region', alias: '地区' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.dimensions.remove('id-1')

    expect(builder.build().dimensions).toEqual([{ id: 'id-2', field: 'region', alias: '地区' }])
  })

  test('removeDimension not found', () => {
    const dsl = { dimensions: [{ field: 'category', alias: '类别' }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.dimensions.remove('notExist')

    expect(builder.build().dimensions).toEqual([{ id: 'id-1', field: 'category', alias: '类别' }])
  })

  test('updateDimension', () => {
    const dsl = { dimensions: [{ field: 'category', alias: '类别' }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.dimensions.update('id-1', (node) => {
      node.setAlias('新类别')
    })

    expect(builder.build().dimensions).toEqual([{ id: 'id-1', field: 'category', alias: '新类别' }])
  })

  test('updateDimension aggregate', () => {
    const dsl = { dimensions: [{ field: 'order_date', alias: '订单日期' }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.dimensions.update('id-1', (node) => {
      node.setAlias('月份').setAggregate({ func: 'toMonth' })
    })

    expect(builder.build().dimensions).toEqual([
      {
        id: 'id-1',
        field: 'order_date',
        alias: '月份',
        aggregate: { func: 'toMonth' },
      },
    ])
  })

  test('updateDimension throws error if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.dimensions.update('notExist', (node) => {
        node.setAlias('新类别')
      })
    }).toThrow('Dimension with id "notExist" not found')
  })

  test('findDimension', () => {
    const dsl = {
      dimensions: [
        { field: 'category', alias: '类别' },
        { field: 'region', alias: '地区' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')

    expect(node?.getField()).toBe('category')
    expect(node?.toJSON()).toEqual({ id: 'id-1', field: 'category', alias: '类别' })
  })

  test('findDimension returns undefined if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'notExist')

    expect(node).toBeUndefined()
  })

  test('findAllDimensions', () => {
    const dsl = {
      dimensions: [
        { field: 'category', alias: '类别' },
        { field: 'region', alias: '地区' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.dimensions.findAll()

    expect(nodes.length).toBe(2)
    expect(nodes[0].getField()).toBe('category')
    expect(nodes[1].getField()).toBe('region')
  })

  test('findAllDimensions returns empty array when no dimensions', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.dimensions.findAll()

    expect(nodes).toEqual([])
  })

  test('toJSON', () => {
    const dsl = {
      dimensions: [
        { field: 'category', alias: '类别' },
        { field: 'region', alias: '地区' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.dimensions.toJSON()

    expect(json).toEqual([
      { id: 'id-1', field: 'category', alias: '类别' },
      { id: 'id-2', field: 'region', alias: '地区' },
    ])
  })

  test('toJSON returns empty array when no dimensions', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.dimensions.toJSON()

    expect(json).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }
    const unobserve = builder.dimensions.observe(callback)

    builder.dimensions.add('category', (node) => {
      node.setAlias('类别')
    })

    expect(callCount).toBe(1)

    unobserve()

    builder.dimensions.add('region', (node) => {
      node.setAlias('地区')
    })

    expect(callCount).toBe(1)
  })

  test('isDimensionNode', () => {
    const node = { id: 'id-1', field: 'category', alias: '类别' }
    const group = { field: 'group1', children: [] }

    expect(DimensionsBuilder.isDimensionNode(node)).toBe(true)
    expect(DimensionsBuilder.isDimensionNode(group as unknown as any)).toBe(false)
  })

  test('isDimensionGroup', () => {
    const node = { id: 'id-1', field: 'category', alias: '类别' }
    const group = { field: 'group1', children: [] }

    expect(DimensionsBuilder.isDimensionGroup(node)).toBe(false)
    expect(DimensionsBuilder.isDimensionGroup(group as unknown as any)).toBe(true)
  })

  test('DimensionNodeBuilder getField', () => {
    const dsl = { dimensions: [{ field: 'category', alias: '类别' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')

    expect(node?.getField()).toBe('category')
  })

  test('DimensionNodeBuilder getId', () => {
    const dsl = { dimensions: [{ field: 'category', alias: '类别' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')

    expect(node?.getId()).toBe('id-1')
  })

  test('DimensionNodeBuilder setAlias', () => {
    const dsl = { dimensions: [{ field: 'category', alias: '类别' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')
    node?.setAlias('新类别')

    expect(builder.dimensions.toJSON()[0].alias).toBe('新类别')
  })

  test('DimensionNodeBuilder setAggregate', () => {
    const dsl = { dimensions: [{ field: 'order_date', alias: '订单日期' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')
    node?.setAggregate({ func: 'toYear' })

    expect(builder.dimensions.toJSON()[0].aggregate).toEqual({ func: 'toYear' })
  })

  test('DimensionNodeBuilder toJSON', () => {
    const dsl = {
      dimensions: [{ field: 'order_date', alias: '订单日期', aggregate: { func: 'toMonth' } }],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.dimensions.find((node) => node.getId() === 'id-1')
    const json = node?.toJSON()

    expect(json).toEqual({ id: 'id-1', field: 'order_date', alias: '订单日期', aggregate: { func: 'toMonth' } })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.dimensions
      .add('category', (node) => node.setAlias('类别'))
      .add('region', (node) => node.setAlias('地区'))
      .add('city', (node) => node.setAlias('城市'))

    const json = builder.dimensions.toJSON()

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('category')
    expect(json[1].field).toBe('region')
    expect(json[2].field).toBe('city')
  })
})
