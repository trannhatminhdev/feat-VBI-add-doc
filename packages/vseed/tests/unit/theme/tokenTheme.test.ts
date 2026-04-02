import { beforeAll, describe, expect, test } from 'vitest'
import type { VSeed } from '@visactor/vseed'
import { Builder, registerTokenTheme, registerTokenThemes } from '@visactor/vseed'

const fontFamily = '"Inter", "Noto Sans SC", sans-serif'

const lineVSeed: VSeed = {
  chartType: 'line',
  theme: 'unit-light',
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

beforeAll(() => {
  registerTokenThemes({
    'unit-light': {
      baseTheme: 'light',
      fontFamily,
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
  test('should register themes from a token registry', () => {
    expect(Builder.getTheme('unit-light')).toBeDefined()
    expect(Builder.getTheme('unit-earth')).toBeDefined()
  })

  test('should apply token theme to chart config', () => {
    const builder = Builder.from(lineVSeed)
    const advanced = builder.buildAdvanced()
    const lineConfig = advanced?.config?.line as any

    expect(lineConfig?.color?.colorScheme).toEqual(['#B83280', '#3182CE', '#38A169'])
    expect(lineConfig?.fontFamily).toBe(fontFamily)
    expect(lineConfig?.tooltip?.backgroundColor).toBe('rgba(255, 255, 255, 0.96)')
    expect(lineConfig?.legend?.labelColor).toBe('#4A5568')
    expect(lineConfig?.xAxis?.label?.labelColor).toBe('#4A5568')
  })

  test('should apply token theme to table config', () => {
    const builder = Builder.from(tableVSeed)
    const advanced = builder.buildAdvanced()
    const tableConfig = advanced?.config?.table

    expect(tableConfig?.headerBackgroundColor).toBe('#FEFCF7')
    expect(tableConfig?.bodyFontColor).toBe('#2D3748')
    expect((tableConfig as any)?.bodyFontFamily).toBe(fontFamily)
    expect((tableConfig as any)?.headerFontFamily).toBe(fontFamily)
    expect(tableConfig?.backgroundColorScale?.maxColor).toBe('#C05621')
  })

  test('should apply fontFamily to final chart spec and race player text', () => {
    const builder = Builder.from(lineVSeed)
    const spec = builder.build() as any
    const raceSpec = Builder.from(raceBarVSeed).build() as any

    expect(spec?.theme?.fontFamily).toBe(fontFamily)
    expect(raceSpec?.theme?.fontFamily).toBe(fontFamily)
    expect(raceSpec?.customMark?.[0]?.style?.fontFamily).toBe(fontFamily)
  })

  test('should apply fontFamily to final table spec', () => {
    const tableSpec = Builder.from(tableVSeed).build() as any
    const pivotTableSpec = Builder.from(pivotTableVSeed).build() as any

    expect(tableSpec?.theme?.bodyStyle?.fontFamily).toBe(fontFamily)
    expect(tableSpec?.theme?.headerStyle?.fontFamily).toBe(fontFamily)
    expect(pivotTableSpec?.theme?.rowHeaderStyle?.fontFamily).toBe(fontFamily)
    expect(pivotTableSpec?.theme?.cornerHeaderStyle?.fontFamily).toBe(fontFamily)
  })

  test('should register ad-hoc token theme with one call', () => {
    registerTokenTheme('agent-custom', {
      baseTheme: 'dark',
      fontFamily,
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
    expect(theme?.config?.raceBar?.player?.trackColor).toBe('#00C2A8')
    expect(theme?.config?.raceBar?.player?.fontFamily).toBe(fontFamily)
    expect(theme?.config?.table?.headerBackgroundColor).toBe('#0F172A')
  })
})