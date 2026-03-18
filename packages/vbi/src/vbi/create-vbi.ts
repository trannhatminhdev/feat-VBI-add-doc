import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import { connectorMap, getConnector, registerConnector } from 'src/builder/connector'
import type { VBIBuilder } from 'src/builder/builder'
import type { VBIDSLInput, VBIBuilderOptions } from 'src/types'
import { fromVBIDSLInput } from './from/from-vbi-dsl-input'
import { generateEmptyDSL } from './generate-empty-dsl'

export interface VBIInstance<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  connectorMap: typeof connectorMap
  registerConnector: typeof registerConnector
  getConnector: typeof getConnector
  generateEmptyDSL: typeof generateEmptyDSL
  from: (vbi: VBIDSLInput, builderOptions?: VBIBuilderOptions<TQueryDSL, TSeedDSL>) => VBIBuilder<TQueryDSL, TSeedDSL>
  create: (vbi: VBIDSLInput, builderOptions?: VBIBuilderOptions<TQueryDSL, TSeedDSL>) => VBIBuilder<TQueryDSL, TSeedDSL>
}

const mergeBuilderOptions = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  base?: VBIBuilderOptions<TQueryDSL, TSeedDSL>,
  overrides?: VBIBuilderOptions<TQueryDSL, TSeedDSL>,
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
  defaultBuilderOptions: VBIBuilderOptions<TQueryDSL, TSeedDSL>,
): VBIInstance<TQueryDSL, TSeedDSL>
export function createVBI<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  defaultBuilderOptions?: VBIBuilderOptions<TQueryDSL, TSeedDSL>,
) {
  const from = (vbi: VBIDSLInput, builderOptions?: VBIBuilderOptions<TQueryDSL, TSeedDSL>) => {
    return fromVBIDSLInput(vbi, mergeBuilderOptions(defaultBuilderOptions, builderOptions))
  }

  return {
    connectorMap,
    registerConnector,
    getConnector,
    generateEmptyDSL,
    from,
    create: from,
  }
}
