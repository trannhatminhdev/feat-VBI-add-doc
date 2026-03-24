import { zVBIDimensionSchema } from 'src/types/chartDSL/dimensions/dimensions'
import { zVBIMeasure } from 'src/types/chartDSL/measures/measures'
import { zVBISort } from 'src/types/chartDSL/sort'
import { zVBIChartDSL } from 'src/types/chartDSL/vbi/vbi'

describe('sort schemas', () => {
  test('zVBISort parses asc and desc', () => {
    expect(zVBISort.parse({ order: 'asc' })).toEqual({ order: 'asc' })
    expect(zVBISort.parse({ order: 'desc' })).toEqual({ order: 'desc' })
  })

  test('zVBISort rejects invalid order', () => {
    expect(() => zVBISort.parse({ order: 'invalid' })).toThrow()
  })

  test('dimension and measure schemas accept sort', () => {
    expect(
      zVBIDimensionSchema.parse({
        id: 'd-1',
        field: 'area',
        alias: '区域',
        sort: { order: 'asc' },
      }),
    ).toMatchObject({ sort: { order: 'asc' } })

    expect(
      zVBIMeasure.parse({
        id: 'm-1',
        field: 'sales',
        alias: '销售额',
        encoding: 'primaryYAxis',
        aggregate: { func: 'sum' },
        sort: { order: 'desc' },
      }),
    ).toMatchObject({ sort: { order: 'desc' } })
  })

  test('full dsl schema accepts sorted nodes', () => {
    const dsl = zVBIChartDSL.parse({
      connectorId: 'demo',
      chartType: 'table',
      dimensions: [{ id: 'd-1', field: 'area', alias: '区域', sort: { order: 'asc' } }],
      measures: [
        {
          id: 'm-1',
          field: 'sales',
          alias: '销售额',
          encoding: 'primaryYAxis',
          aggregate: { func: 'sum' },
          sort: { order: 'desc' },
        },
      ],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
    })

    expect(dsl.dimensions[0]).toMatchObject({ sort: { order: 'asc' } })
    expect(dsl.measures[0]).toMatchObject({ sort: { order: 'desc' } })
  })
})
