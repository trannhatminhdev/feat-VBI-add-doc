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

  test('toJson default', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.toJson()).toBe('table')
  })

  test('toJson with value', () => {
    const dsl = { chartType: 'pie' } as VBIDSL
    const builder = VBI.from(dsl)

    expect(builder.chartType.toJson()).toBe('pie')
  })

  test('getAvailableChartTypes', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const types = builder.chartType.getAvailableChartTypes()

    expect(types).toContain('table')
    expect(types).toContain('line')
    expect(types).toContain('column')
    expect(types).toContain('barPercent')
    expect(types).toContain('pie')
    expect(types.length).toBeGreaterThan(10)
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
