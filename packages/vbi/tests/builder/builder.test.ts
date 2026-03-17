import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('VBI', () => {
  test('build', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.measures.add('sales', (node) => {
      node.setAlias('Max Sales').setAggregate({ func: 'max' }).setEncoding('yAxis')
    })
    builder.dimensions.add('area', (node) => {
      node.setAlias('Area')
    })

    expect(builder.build()).toEqual({
      dimensions: [
        {
          id: 'id-2',
          alias: 'Area',
          field: 'area',
        },
      ],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [
        {
          id: 'id-1',
          aggregate: {
            func: 'max',
          },
          alias: 'Max Sales',
          encoding: 'yAxis',
          field: 'sales',
        },
      ],
    })
  })

  test('isEmpty', () => {
    const builder = VBI.from({} as VBIDSL)
    expect(builder.isEmpty()).toBe(true)

    builder.dimensions.add('area', () => {})
    expect(builder.isEmpty()).toBe(false)

    const dimensionId = builder.dimensions.find((node) => node.getField() === 'area')?.getId()
    if (dimensionId) {
      builder.dimensions.remove(dimensionId)
    }
    expect(builder.isEmpty()).toBe(true)

    builder.measures.add('sales', () => {})
    expect(builder.isEmpty()).toBe(false)
  })
})
