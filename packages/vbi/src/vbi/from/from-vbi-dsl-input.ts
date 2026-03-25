import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIChartDSLInput, VBIChartBuilderOptions } from 'src/types'
import { VBIChartBuilder } from 'src/chart-builder/builder'
import { fillVBIChartDSLMap } from './fill-vbi-chart-dsl-map'

export const createChartBuilderFromVBIChartDSLInput = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  vbi: VBIChartDSLInput,
  options?: VBIChartBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const doc = new Y.Doc()
  const dsl = doc.getMap('dsl')

  doc.transact(() => {
    fillVBIChartDSLMap(dsl, vbi)
  })

  return new VBIChartBuilder<TQueryDSL, TSeedDSL>(doc, options, dsl)
}
