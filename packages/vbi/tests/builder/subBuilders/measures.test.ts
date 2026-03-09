import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('MeasuresBuilder', () => {
  test('addMeasure', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.measures.addMeasure('sales').setAlias('Max(sales)').setAggregate({ func: 'max' })

    expect(builder.build()).toMatchInlineSnapshot(`
      {
        "dimensions": [],
        "filters": [],
        "measures": [
          [
            {},
          ],
        ],
      }
    `)
  })

  test('addMeasure callback', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.measures
      .addMeasure('sales', (node) => {
        node.setAlias('sum(sales)')
      })
      .addMeasure('orders', (node) => {
        node.setAlias('Min(orders)').setAggregate({ func: 'min' })
      })

    expect(builder.build()).toMatchInlineSnapshot(`
      {
        "dimensions": [],
        "filters": [],
        "measures": [
          [
            {},
          ],
          [
            {},
          ],
        ],
      }
    `)
  })
})
