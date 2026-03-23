import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import { connectorMap, getConnector, registerConnector } from 'src/builder/connector'
import type { VBIChartBuilder } from 'src/builder/builder'
import type { VBIChartDSLInput, VBIChartBuilderOptions } from 'src/types'
import { createChartBuilderFromVBIChartDSLInput } from './from/from-vbi-dsl-input'
import { generateEmptyChartDSL } from './generate-empty-dsl'

export interface VBIInstance<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  connectorMap: typeof connectorMap
  registerConnector: typeof registerConnector
  getConnector: typeof getConnector
  generateEmptyChartDSL: typeof generateEmptyChartDSL
  createChart: (
    vbi: VBIChartDSLInput,
    builderOptions?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
  ) => VBIChartBuilder<TQueryDSL, TSeedDSL>
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

  return {
    connectorMap,
    registerConnector,
    getConnector,
    generateEmptyChartDSL,
    createChart,
  }
}
