import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartBuilderOptions, VBIReportBuilderOptions } from 'src/types'

export const mergeBuilderOptions = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  base?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  overrides?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  if (!base) {
    return overrides
  }
  if (!overrides) {
    return base
  }
  return {
    ...base,
    ...overrides,
    adapters: {
      ...base.adapters,
      ...overrides.adapters,
    },
  }
}

export const mergeReportBuilderOptions = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  base?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  overrides?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const chart = mergeBuilderOptions(base, overrides?.chart)
  return chart ? { chart } : undefined
}
