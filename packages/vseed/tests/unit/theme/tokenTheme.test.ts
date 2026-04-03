import { beforeAll, describe, expect, test } from 'vitest'
import type { VSeed } from '@visactor/vseed'
import { Builder, registerTokenTheme, registerTokenThemes } from '@visactor/vseed'

const fontFamily = '"Inter", "Noto Sans SC", sans-serif'
const tableHeaderFontSize = 15
const tableBodyFontSize = 13
const labelFontSize = 16
const tooltipFontSize = 17
const axisFontSize = 18
const legendFontSize = 19
const playerFontSize = 42

const lineVSeed: VSeed = {
  chartType: 'line',
  theme: 'unit-light',
  dataset: [
    { date: '2019', sales: 20 },
    { date: '2020', sales: 60 },
    { date: '2021', sales: 40 },
  ],
}

const columnVSeed: VSeed = {
  chartType: 'column',
  theme: 'unit-light',
  measures: [{ id: 'sales', alias: '销售额', autoFormat: true }],
  dimensions: [{ id: 'date', alias: '日期' }],
  dataset: [
    { date: '2019', sales: 20 },
    { date: '2020', sales: 60 },
    { date: '2021', sales: 40 },
  ],
}

const raceBarVSeed: VSeed = {
  chartType: 'raceBar',
  theme: 'unit-light',
  measures: [{ id: 'sales', alias: '销售额', autoFormat: true }],
  dimensions: [
    { id: 'category', alias: '分类' },
    { id: 'date', alias: '日期' },
  ],
  dataset: [
    { date: '2019', category: 'A', sales: 100 },
    { date: '2019', category: 'B', sales: 150 },
    { date: '2020', category: 'A', sales: 120 },
    { date: '2020', category: 'B', sales: 180 },
    { date: '2021', category: 'A', sales: 140 },
    { date: '2021', category: 'B', sales: 200 },
  ],
  player: {
    enable: true,
    field: 'date',
  } as any,
}

const tableVSeed: VSeed = {
  chartType: 'table',
  theme: 'unit-earth',
  dataset: [
    { date: '2019', sales: 20 },
    { date: '2020', sales: 60 },
    { date: '2021', sales: 40 },
  ],
}

const pivotTableVSeed: VSeed = {
  chartType: 'pivotTable',
  theme: 'unit-earth',
  dataset: [
    { date: '2019', type: 'A', sales: 100 },
    { date: '2020', type: 'A', sales: 320 },
    { date: '2021', type: 'A', sales: 300 },
  ],
}

const pivotLineVSeed: VSeed = {
  chartType: 'line',
  theme: 'unit-light',
  measures: [
    { id: 'sales', alias: '销售额', autoFormat: true },
    { id: 'profit', alias: '利润', autoFormat: true },
  ],
  dimensions: [
    { id: 'month', alias: '月' },
    { id: 'date', alias: '年', encoding: 'column' },
    { id: 'type', alias: '类型', encoding: 'row' },
  ],
  dataset: [
    { date: '2019', type: 'A', month: '1', profit: 10000, sales: 200000 },
    { date: '2019', type: 'A', month: '2', profit: 20000, sales: 400000 },
    { date: '2019', type: 'B', month: '1', profit: 12000, sales: 180000 },
    { date: '2019', type: 'B', month: '2', profit: 16000, sales: 260000 },
    { date: '2020', type: 'A', month: '1', profit: 15000, sales: 230000 },
    { date: '2020', type: 'A', month: '2', profit: 22000, sales: 420000 },
    { date: '2020', type: 'B', month: '1', profit: 14000, sales: 210000 },
    { date: '2020', type: 'B', month: '2', profit: 19000, sales: 310000 },
  ],
}

beforeAll(() => {
  registerTokenThemes({
    'unit-light': {
      baseTheme: 'light',
      fontFamily,
      tableHeaderFontSize,
      tableBodyFontSize,
      labelFontSize,
      tooltipFontSize,
      axisFontSize,
      legendFontSize,
      playerFontSize,
      colorScheme: ['#B83280', '#3182CE', '#38A169'],
      linearColorScheme: ['#F8C7E7', '#B83280'],
      textPrimary: '#1A202C',
      textSecondary: '#4A5568',
      borderColor: 'rgba(45, 55, 72, 0.16)',
      surfaceColor: '#FFFFFF',
      tooltipBackgroundColor: 'rgba(255, 255, 255, 0.96)',
      tableHeaderBackgroundColor: '#F7FAFC',
      tableSelectedBorderColor: '#B83280',
    },
    'unit-earth': {
      baseTheme: 'light',
      fontFamily,
      tableHeaderFontSize,
      tableBodyFontSize,
      labelFontSize,
      tooltipFontSize,
      axisFontSize,
      legendFontSize,
      playerFontSize,
      colorScheme: ['#C05621', '#2F855A', '#2B6CB0'],
      linearColorScheme: ['#FBD38D', '#C05621'],
      textPrimary: '#2D3748',
      textSecondary: '#718096',
      borderColor: 'rgba(45, 55, 72, 0.12)',
      surfaceColor: '#FFFAF0',
      tooltipBackgroundColor: 'rgba(255, 250, 240, 0.96)',
      tableHeaderBackgroundColor: '#FEFCF7',
      tableSelectedBorderColor: '#C05621',
    },
  })
})

describe('tokenTheme', () => {
  test('should preserve undefined default fontSize in base theme config', () => {
    const lightTheme = Builder.getTheme('light')

    expect(lightTheme?.config?.line?.label?.labelFontSize).toBeUndefined()
    expect(lightTheme?.config?.raceBar?.player?.fontSize).toBeUndefined()
    expect((lightTheme?.config?.line as any)?.pivotGrid?.bodyFontSize).toBeUndefined()
    expect((lightTheme?.config?.line as any)?.pivotGrid?.headerFontSize).toBeUndefined()
    expect((lightTheme?.config?.line as any)?.pivotGrid?.axisLabelFontSize).toBeUndefined()
  })

  test('should register themes from a token registry', () => {
    expect(Builder.getTheme('unit-light')).toBeDefined()
    expect(Builder.getTheme('unit-earth')).toBeDefined()
  })

  test('should apply token theme to chart config', () => {
    const builder = Builder.from(lineVSeed)
    const advanced = builder.buildAdvanced()
    const lineConfig = advanced?.config?.line as any
    const columnConfig = Builder.from(columnVSeed).buildAdvanced()?.config?.column as any

    expect(lineConfig?.color?.colorScheme).toEqual(['#B83280', '#3182CE', '#38A169'])
    expect(lineConfig?.fontFamily).toBe(fontFamily)
    expect(lineConfig?.label?.labelFontSize).toBe(labelFontSize)
    expect(lineConfig?.tooltip?.fontSize).toBe(tooltipFontSize)
    expect(lineConfig?.legend?.labelFontSize).toBe(legendFontSize)
    expect(lineConfig?.xAxis?.label?.labelFontSize).toBe(axisFontSize)
    expect(lineConfig?.xAxis?.title?.titleFontSize).toBe(axisFontSize)
    expect(lineConfig?.tooltip?.backgroundColor).toBe('rgba(255, 255, 255, 0.96)')
    expect(lineConfig?.legend?.labelColor).toBe('#4A5568')
    expect(lineConfig?.xAxis?.label?.labelColor).toBe('#4A5568')
    expect(columnConfig?.annotation?.annotationPoint?.textFontSize).toBe(labelFontSize)
    expect(columnConfig?.regressionLine?.linearRegressionLine?.textFontSize).toBe(labelFontSize)
  })

  test('should apply token theme to table config', () => {
    const builder = Builder.from(tableVSeed)
    const advanced = builder.buildAdvanced()
    const tableConfig = advanced?.config?.table
    const pivotLineConfig = Builder.from(pivotLineVSeed).buildAdvanced()?.config?.line as any

    expect(tableConfig?.headerBackgroundColor).toBe('#FEFCF7')
    expect(tableConfig?.bodyFontColor).toBe('#2D3748')
    expect((tableConfig as any)?.bodyFontSize).toBe(tableBodyFontSize)
    expect((tableConfig as any)?.bodyFontFamily).toBe(fontFamily)
    expect((tableConfig as any)?.headerFontSize).toBe(tableHeaderFontSize)
    expect((tableConfig as any)?.headerFontFamily).toBe(fontFamily)
    expect(tableConfig?.backgroundColorScale?.maxColor).toBe('#C05621')
    expect(pivotLineConfig?.pivotGrid?.bodyFontSize).toBe(tableBodyFontSize)
    expect(pivotLineConfig?.pivotGrid?.headerFontSize).toBe(tableHeaderFontSize)
    expect(pivotLineConfig?.pivotGrid?.titleFontSize).toBe(tableHeaderFontSize)
    expect(pivotLineConfig?.pivotGrid?.axisLabelFontSize).toBe(axisFontSize)
  })

  test('should apply fontFamily to final chart spec and race player text', () => {
    const builder = Builder.from(lineVSeed)
    const spec = builder.build() as any
    const raceSpec = Builder.from(raceBarVSeed).build() as any

    expect(spec?.theme?.fontFamily).toBe(fontFamily)
    expect(raceSpec?.theme?.fontFamily).toBe(fontFamily)
    expect(raceSpec?.customMark?.[0]?.style?.fontFamily).toBe(fontFamily)
    expect(raceSpec?.customMark?.[0]?.style?.fontSize).toBe(playerFontSize)
  })

  test('should apply fontFamily and fontSize to final table spec', () => {
    const tableSpec = Builder.from(tableVSeed).build() as any
    const pivotTableSpec = Builder.from(pivotTableVSeed).build() as any
    const pivotLineSpec = Builder.from(pivotLineVSeed).build() as any

    expect(tableSpec?.theme?.bodyStyle?.fontFamily).toBe(fontFamily)
    expect(tableSpec?.theme?.bodyStyle?.fontSize).toBe(tableBodyFontSize)
    expect(tableSpec?.theme?.headerStyle?.fontFamily).toBe(fontFamily)
    expect(tableSpec?.theme?.headerStyle?.fontSize).toBe(tableHeaderFontSize)
    expect(pivotTableSpec?.theme?.rowHeaderStyle?.fontFamily).toBe(fontFamily)
    expect(pivotTableSpec?.theme?.rowHeaderStyle?.fontSize).toBe(tableHeaderFontSize)
    expect(pivotTableSpec?.theme?.cornerHeaderStyle?.fontFamily).toBe(fontFamily)
    expect(pivotTableSpec?.theme?.cornerHeaderStyle?.fontSize).toBe(tableHeaderFontSize)
    expect(pivotLineSpec?.theme?.bodyStyle?.fontSize).toBe(tableBodyFontSize)
    expect(pivotLineSpec?.theme?.headerStyle?.fontSize).toBe(tableHeaderFontSize)
    expect(pivotLineSpec?.theme?.rowHeaderStyle?.fontSize).toBe(tableHeaderFontSize)
    expect(pivotLineSpec?.title?.textStyle?.fontSize).toBe(tableHeaderFontSize)
  })

  test('should register ad-hoc token theme with one call', () => {
    registerTokenTheme('agent-custom', {
      baseTheme: 'dark',
      fontFamily,
      tableHeaderFontSize,
      tableBodyFontSize,
      labelFontSize,
      tooltipFontSize,
      axisFontSize,
      legendFontSize,
      playerFontSize,
      colorScheme: ['#00C2A8', '#F46060', '#FFB347'],
      linearColorScheme: ['#C3FFF7', '#00C2A8'],
      textPrimary: '#F5F7FA',
      textSecondary: '#AAB4C0',
      borderColor: '#334155',
      surfaceColor: '#111827',
      tooltipBackgroundColor: '#111827',
      tableHeaderBackgroundColor: '#0F172A',
    })

    const theme = Builder.getTheme('agent-custom')

    expect(theme?.config?.line?.color?.colorScheme).toEqual(['#00C2A8', '#F46060', '#FFB347'])
    expect((theme?.config?.line as any)?.fontFamily).toBe(fontFamily)
    expect((theme?.config?.line as any)?.label?.labelFontSize).toBe(labelFontSize)
    expect((theme?.config?.line as any)?.xAxis?.label?.labelFontSize).toBe(axisFontSize)
    expect(theme?.config?.raceBar?.player?.trackColor).toBe('#00C2A8')
    expect(theme?.config?.raceBar?.player?.fontFamily).toBe(fontFamily)
    expect(theme?.config?.raceBar?.player?.fontSize).toBe(playerFontSize)
    expect(theme?.config?.table?.bodyFontSize).toBe(tableBodyFontSize)
    expect(theme?.config?.table?.headerFontSize).toBe(tableHeaderFontSize)
    expect(theme?.config?.table?.headerBackgroundColor).toBe('#0F172A')
  })
})