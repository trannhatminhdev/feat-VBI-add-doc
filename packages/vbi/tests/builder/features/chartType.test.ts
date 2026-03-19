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

  test('getRecommendedDimensionEncodings uses dsl dimensions when count not provided', () => {
    const builder = VBI.from({
      chartType: 'line',
      dimensions: [
        { field: 'category', alias: 'category' },
        { field: 'subcategory', alias: 'subcategory' },
        { field: 'region', alias: 'region' },
      ],
    } as VBIDSL)

    // When no count is provided, it should use dsl.get('dimensions')?.length
    expect(builder.chartType.getRecommendedDimensionEncodings()).toEqual(['xAxis', 'color', 'color'])
  })

  test('getRecommendedDimensionEncodings with explicit count overrides dsl', () => {
    const builder = VBI.from({
      chartType: 'line',
      dimensions: [
        { field: 'category', alias: 'category' },
        { field: 'subcategory', alias: 'subcategory' },
      ],
    } as VBIDSL)

    // Explicit count should override dsl length
    expect(builder.chartType.getRecommendedDimensionEncodings(3)).toEqual(['xAxis', 'color', 'color'])
  })

  test('getSupportedMeasureEncodings', () => {
    const builder = VBI.from({ chartType: 'histogram' } as VBIDSL)

    expect(builder.chartType.getSupportedMeasureEncodings()).toEqual([
      'value',
      'x0',
      'x1',
      'yAxis',
      'detail',
      'color',
      'label',
      'tooltip',
    ])
  })

  test('getRecommendedMeasureEncodings', () => {
    const builder = VBI.from({ chartType: 'dualAxis' } as VBIDSL)

    expect(builder.chartType.getRecommendedMeasureEncodings(4)).toEqual([
      'primaryYAxis',
      'secondaryYAxis',
      'secondaryYAxis',
      'secondaryYAxis',
    ])
  })

  test('getRecommendedMeasureEncodings uses dsl measures when count not provided', () => {
    const builder = VBI.from({
      chartType: 'column',
      measures: [
        { field: 'sales', alias: 'sales' },
        { field: 'profit', alias: 'profit' },
      ],
    } as VBIDSL)

    // When no count is provided, it should use dsl.get('measures')?.length
    expect(builder.chartType.getRecommendedMeasureEncodings()).toEqual(['yAxis', 'yAxis'])
  })

  test('getRecommendedMeasureEncodings with explicit count overrides dsl', () => {
    const builder = VBI.from({
      chartType: 'column',
      measures: [{ field: 'sales', alias: 'sales' }],
    } as VBIDSL)

    // Explicit count should override dsl length
    expect(builder.chartType.getRecommendedMeasureEncodings(3)).toEqual(['yAxis', 'yAxis', 'yAxis'])
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

  test('changeChartType reapplies measure encodings', () => {
    const builder = VBI.from({
      chartType: 'table',
      measures: [
        { field: 'sales', alias: '销售额', encoding: 'column', aggregate: { func: 'sum' } },
        { field: 'profit', alias: '利润', encoding: 'column', aggregate: { func: 'sum' } },
      ],
    } as VBIDSL)

    builder.chartType.changeChartType('dualAxis')

    expect(builder.measures.toJSON()).toEqual([
      { id: 'id-1', field: 'sales', alias: '销售额', encoding: 'primaryYAxis', aggregate: { func: 'sum' } },
      { id: 'id-2', field: 'profit', alias: '利润', encoding: 'secondaryYAxis', aggregate: { func: 'sum' } },
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

  test('getRecommendedDimensionEncodings for race charts', () => {
    // Test RaceBar
    const builder1 = VBI.from({ chartType: 'raceBar' } as VBIDSL)
    expect(builder1.chartType.getRecommendedDimensionEncodings(3)).toEqual(['player', 'yAxis', 'color'])

    // Test RaceColumn
    const builder2 = VBI.from({ chartType: 'raceColumn' } as VBIDSL)
    expect(builder2.chartType.getRecommendedDimensionEncodings(3)).toEqual(['player', 'xAxis', 'color'])

    // Test RaceLine
    const builder3 = VBI.from({ chartType: 'raceLine' } as VBIDSL)
    expect(builder3.chartType.getRecommendedDimensionEncodings(2)).toEqual(['player', 'color'])

    // Test RaceScatter
    const builder4 = VBI.from({ chartType: 'raceScatter' } as VBIDSL)
    expect(builder4.chartType.getRecommendedDimensionEncodings(2)).toEqual(['player', 'color'])

    // Test RacePie
    const builder5 = VBI.from({ chartType: 'racePie' } as VBIDSL)
    expect(builder5.chartType.getRecommendedDimensionEncodings(2)).toEqual(['player', 'color'])

    // Test RaceDonut
    const builder6 = VBI.from({ chartType: 'raceDonut' } as VBIDSL)
    expect(builder6.chartType.getRecommendedDimensionEncodings(2)).toEqual(['player', 'color'])
  })
})
