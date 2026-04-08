import { VBI } from '@visactor/vbi'
import { VBIChartDSL } from 'src/types/chartDSL'

describe('VBI YJS Integration', () => {
  test('sync between two builders', () => {
    const b1 = VBI.createChart({} as VBIChartDSL)
    const b2 = VBI.createChart({} as VBIChartDSL)

    b2.applyUpdate(b1.encodeStateAsUpdate())
    b1.applyUpdate(b2.encodeStateAsUpdate())

    b1.measures.add('sales', (node) => {
      node.setAlias('Sales')
    })

    const update = b1.encodeStateAsUpdate()
    b2.applyUpdate(update)

    expect(b2.build()).toEqual({
      uuid: b2.getUUID(),
      dimensions: [],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [
        {
          id: 'id-1',
          aggregate: {
            func: 'sum',
          },
          alias: 'Sales',
          encoding: 'column',
          field: 'sales',
        },
      ],
    })
  })
})

test('encodeStateAsUpdate', () => {
  const b1 = VBI.createChart({} as VBIChartDSL)
  const b2 = VBI.createChart({} as VBIChartDSL)

  b1.applyUpdate(b2.encodeStateAsUpdate())
  b2.applyUpdate(b1.encodeStateAsUpdate())

  b1.measures.add('sales', (node) => {
    node.setAlias('Max Sales').setAggregate({ func: 'max' }).setEncoding('yAxis')
  })

  const update = b1.encodeStateAsUpdate()
  b2.applyUpdate(update)

  expect(update).toBeInstanceOf(Uint8Array)
  expect(update.length).toBeGreaterThan(0)

  expect(b2.build()).toEqual({
    uuid: b2.getUUID(),
    dimensions: [],
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
