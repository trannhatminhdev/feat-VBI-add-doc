import { VBI } from '@visactor/vbi'
import * as features from 'src/chart-builder/features'
import { ChartTypeBuilder } from 'src/chart-builder/features/chart-type'
import { DimensionsBuilder } from 'src/chart-builder/features/dimensions'
import { HavingFilterBuilder } from 'src/chart-builder/features/havingFilter'
import { LimitBuilder } from 'src/chart-builder/features/limit'
import { LocaleBuilder } from 'src/chart-builder/features/locale'
import { MeasuresBuilder } from 'src/chart-builder/features/measures'
import { ThemeBuilder } from 'src/chart-builder/features/theme'
import { UndoManager } from 'src/chart-builder/features/undo-manager'
import { WhereFilterBuilder } from 'src/chart-builder/features/whereFilter'
import type { VBIChartDSL } from 'src/types/chartDSL'

describe('feature barrels', () => {
  test('export all feature builders from the root barrel', () => {
    expect(features.ChartTypeBuilder).toBe(ChartTypeBuilder)
    expect(features.DimensionsBuilder).toBe(DimensionsBuilder)
    expect(features.MeasuresBuilder).toBe(MeasuresBuilder)
    expect(features.WhereFilterBuilder).toBe(WhereFilterBuilder)
    expect(features.HavingFilterBuilder).toBe(HavingFilterBuilder)
    expect(features.ThemeBuilder).toBe(ThemeBuilder)
    expect(features.LocaleBuilder).toBe(LocaleBuilder)
    expect(features.LimitBuilder).toBe(LimitBuilder)
    expect(features.UndoManager).toBe(UndoManager)
  })
})

describe('ThemeBuilder', () => {
  test('supports default value, updates, JSON export and observe lifecycle', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    expect(builder.theme.getTheme()).toBe('light')
    expect(builder.theme.toJSON()).toBe('light')

    let callCount = 0
    const unobserve = builder.theme.observe(() => {
      callCount++
    })

    builder.chartType.changeChartType('bar')
    expect(callCount).toBe(0)

    builder.theme.setTheme('dark')
    expect(builder.theme.getTheme()).toBe('dark')
    expect(builder.theme.toJSON()).toBe('dark')
    expect(callCount).toBe(1)

    unobserve()
    builder.theme.setTheme('light')
    expect(callCount).toBe(1)
  })
})

describe('LocaleBuilder', () => {
  test('supports default value, updates, JSON export and observe lifecycle', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    expect(builder.locale.getLocale()).toBe('zh-CN')
    expect(builder.locale.toJSON()).toBe('zh-CN')

    let callCount = 0
    const unobserve = builder.locale.observe(() => {
      callCount++
    })

    builder.theme.setTheme('dark')
    expect(callCount).toBe(0)

    builder.locale.setLocale('en-US')
    expect(builder.locale.getLocale()).toBe('en-US')
    expect(builder.locale.toJSON()).toBe('en-US')
    expect(callCount).toBe(1)

    unobserve()
    builder.locale.setLocale('zh-CN')
    expect(callCount).toBe(1)
  })
})

describe('LimitBuilder', () => {
  test('supports undefined default, updates, JSON export and observe lifecycle', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    expect(builder.limit.getLimit()).toBeUndefined()
    expect(builder.limit.toJSON()).toBeUndefined()

    let callCount = 0
    const unobserve = builder.limit.observe(() => {
      callCount++
    })

    builder.locale.setLocale('en-US')
    expect(callCount).toBe(0)

    builder.limit.setLimit(50)
    expect(builder.limit.getLimit()).toBe(50)
    expect(builder.limit.toJSON()).toBe(50)
    expect(callCount).toBe(1)

    unobserve()
    builder.limit.setLimit(20)
    expect(callCount).toBe(1)
  })
})
