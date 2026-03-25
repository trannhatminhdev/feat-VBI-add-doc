import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import { connectorMap, getConnector, registerConnector } from 'src/chart-builder/connector'
import type { VBIChartBuilder } from 'src/chart-builder/builder'
import type { VBIReportBuilder } from 'src/report-builder/builder'
import type { VBIChartDSLInput, VBIChartBuilderOptions, VBIReportBuilderOptions, VBIReportDSLInput } from 'src/types'
import { createChartBuilderFromVBIChartDSLInput } from './from/from-vbi-dsl-input'
import { createReportBuilderFromVBIReportDSLInput } from './from/from-vbi-report-dsl-input'
import { generateEmptyChartDSL } from './generate-empty-dsl'
import { generateEmptyReportDSL } from './generate-empty-report-dsl'
import { generateEmptyReportPageDSL } from './generate-empty-report-page-dsl'

export interface VBIInstance<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  connectorMap: typeof connectorMap
  registerConnector: typeof registerConnector
  getConnector: typeof getConnector
  generateEmptyChartDSL: typeof generateEmptyChartDSL
  generateEmptyReportDSL: typeof generateEmptyReportDSL
  generateEmptyReportPageDSL: typeof generateEmptyReportPageDSL
  createChart: (
    vbi: VBIChartDSLInput,
    builderOptions?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  ) => VBIChartBuilder<TQueryDSL, TSeedDSL>
  createReport: (
    report: VBIReportDSLInput,
    builderOptions?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
  ) => VBIReportBuilder<TQueryDSL, TSeedDSL>
}

const mergeBuilderOptions = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
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

const mergeReportBuilderOptions = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  base?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  overrides?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const chart = mergeBuilderOptions(base, overrides?.chart)
  return chart ? { chart } : undefined
}

export function createVBI(): VBIInstance<DefaultVBIQueryDSL, DefaultVBISeedDSL>
export function createVBI<TQueryDSL, TSeedDSL>(
  defaultBuilderOptions: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
): VBIInstance<TQueryDSL, TSeedDSL>
export function createVBI<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  defaultBuilderOptions?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
) {
  const createChart = (vbi: VBIChartDSLInput, builderOptions?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>) => {
    return createChartBuilderFromVBIChartDSLInput(vbi, mergeBuilderOptions(defaultBuilderOptions, builderOptions))
  }
  const createReport = (report: VBIReportDSLInput, builderOptions?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>) => {
    return createReportBuilderFromVBIReportDSLInput(
      report,
      mergeReportBuilderOptions(defaultBuilderOptions, builderOptions),
    )
  }

  return {
    connectorMap,
    registerConnector,
    getConnector,
    generateEmptyChartDSL,
    generateEmptyReportDSL,
    generateEmptyReportPageDSL,
    createChart,
    createReport,
  }
}
