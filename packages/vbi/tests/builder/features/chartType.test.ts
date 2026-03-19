import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('ChartTypeBuilder', () => {
  test('changeChartType', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.chartType.changeChartType('bar')

    expect(builder.build().chartType).toBe('bar')
  })

  test('getChartType default', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.getChartType()).toBe('table')
  })

  test('getChartType with value', () => {
    const dsl = { chartType: 'line' } as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.getChartType()).toBe('line')
  })

  test('toJSON default', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.toJSON()).toBe('table')
  })

  test('toJSON with value', () => {
    const dsl = { chartType: 'pie' } as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.toJSON()).toBe('pie')
  })

  test('getAvailableChartTypes', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const types = builder.chartType.getAvailableChartTypes()

    expect(types).toContain('table')
    expect(types).toContain('line')
    expect(types).toContain('column')
    expect(types).toContain('bar')
    expect(types).toContain('barPercent')
    expect(types).toContain('pie')
    expect(types).toContain('treeMap')
    expect(types).toContain('racePie')
    expect(types.length).toBeGreaterThan(20)
  })

  test('getSupportedDimensionEncodings', () => {
    const builder = VBI.from({ chartType: 'raceLine' } as VBIDSL)

    expect(builder.chartType.getSupportedDimensionEncodings()).toEqual([
      'player',
      'xAxis',
      'color',
      'detail',
      'tooltip',
      'label',
      'row',
      'column',
    ])
  })

  test('getRecommendedDimensionEncodings', () => {
    const builder = VBI.from({ chartType: 'pivotTable' } as VBIDSL)

    expect(builder.chartType.getRecommendedDimensionEncodings(4)).toEqual(['column', 'row', 'column', 'row'])
  })

  test('changeChartType reapplies dimension encodings', () => {
    const builder = VBI.from({
      chartType: 'table',
      dimensions: [
        { field: 'order_date', alias: '日期', encoding: 'column' },
        { field: 'province', alias: '省份', encoding: 'column' },
      ],
    } as VBIDSL)

    builder.chartType.changeChartType('line')

    expect(builder.dimensions.toJSON()).toEqual([
      { id: 'id-1', field: 'order_date', alias: '日期', encoding: 'xAxis' },
      { id: 'id-2', field: 'province', alias: '省份', encoding: 'color' },
    ])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }

    const unobserve = builder.chartType.observe(callback)

    builder.chartType.changeChartType('bar')

    expect(callCount).toBe(1)

    unobserve()

    builder.chartType.changeChartType('line')

    // Should not increase after unobserve
    expect(callCount).toBe(1)
  })

  test('observe only triggers on chartType change', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }

    const unobserve = builder.chartType.observe(callback)

    builder.theme.setTheme('dark')

    expect(callCount).toBe(0)

    // Add a dimension - should not trigger callback
    builder.dimensions.add('category', (node) => {
      node.setAlias('类别')
    })

    expect(callCount).toBe(0)

    // Change chart type - should trigger
    builder.chartType.changeChartType('bar')

    expect(callCount).toBe(1)

    unobserve()
  })
})
