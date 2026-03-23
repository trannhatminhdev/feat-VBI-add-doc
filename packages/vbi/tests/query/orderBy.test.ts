import { VBI } from '@visactor/vbi'
import type { VBIDSL } from 'src/types/dsl'

describe('orderBy', () => {
  test('defaults to the first dimension when no explicit sort exists', () => {
    const builder = VBI.from({
      dimensions: [
        { id: 'd-1', field: 'area', alias: '区域' },
        { id: 'd-2', field: 'province', alias: '省份' },
      ],
      measures: [{ id: 'm-1', field: 'sales', alias: '销售额', encoding: 'column', aggregate: { func: 'sum' } }],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toEqual([{ field: 'd-1', order: 'asc' }])
  })

  test('omits orderBy when no dimensions and no explicit sort exist', () => {
    const builder = VBI.from({
      measures: [{ id: 'm-1', field: 'sales', alias: '销售额', encoding: 'column', aggregate: { func: 'sum' } }],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toBeUndefined()
  })

  test('explicit dimension sort overrides default sorting', () => {
    const builder = VBI.from({
      dimensions: [
        { id: 'd-1', field: 'area', alias: '区域' },
        { id: 'd-2', field: 'province', alias: '省份', sort: { order: 'desc' } },
      ],
      measures: [{ id: 'm-1', field: 'sales', alias: '销售额', encoding: 'column', aggregate: { func: 'sum' } }],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toEqual([{ field: 'd-2', order: 'desc' }])
  })

  test('explicit measure sort overrides default sorting', () => {
    const builder = VBI.from({
      dimensions: [{ id: 'd-1', field: 'area', alias: '区域' }],
      measures: [
        {
          id: 'm-1',
          field: 'sales',
          alias: '销售额',
          encoding: 'column',
          aggregate: { func: 'sum' },
          sort: { order: 'desc' },
        },
      ],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toEqual([{ field: 'm-1', order: 'desc' }])
  })

  test('keeps dimension order before measure order', () => {
    const builder = VBI.from({
      dimensions: [
        { id: 'd-1', field: 'area', alias: '区域', sort: { order: 'asc' } },
        { id: 'd-2', field: 'province', alias: '省份', sort: { order: 'desc' } },
      ],
      measures: [
        {
          id: 'm-1',
          field: 'sales',
          alias: '销售额',
          encoding: 'column',
          aggregate: { func: 'sum' },
          sort: { order: 'desc' },
        },
        {
          id: 'm-2',
          field: 'profit',
          alias: '利润',
          encoding: 'column',
          aggregate: { func: 'sum' },
          sort: { order: 'asc' },
        },
      ],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toEqual([
      { field: 'd-1', order: 'asc' },
      { field: 'd-2', order: 'desc' },
      { field: 'm-1', order: 'desc' },
      { field: 'm-2', order: 'asc' },
    ])
  })

  test('uses node ids for aggregated dimensions and measures', () => {
    const builder = VBI.from({
      dimensions: [
        { id: 'd-1', field: 'order_date', alias: '年份', aggregate: { func: 'toYear' }, sort: { order: 'asc' } },
      ],
      measures: [
        {
          id: 'm-1',
          field: 'sales',
          alias: '销售额',
          encoding: 'column',
          aggregate: { func: 'sum' },
          sort: { order: 'desc' },
        },
      ],
    } as VBIDSL)

    expect(builder.buildVQuery().orderBy).toEqual([
      { field: 'd-1', order: 'asc' },
      { field: 'm-1', order: 'desc' },
    ])
  })
})
