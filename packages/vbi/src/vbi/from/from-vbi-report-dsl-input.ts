import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIReportDSLInput, VBIReportBuilderOptions } from 'src/types'
import { zVBIReportDSL } from 'src/types/reportDSL/report'
import { VBIReportBuilder } from 'src/report-builder/builder'
import { ensureReportPages } from './report-page-y-map'

export const createReportBuilderFromVBIReportDSLInput = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  report: VBIReportDSLInput,
  options?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const doc = new Y.Doc()
  const dsl = doc.getMap('dsl')
  const normalized = zVBIReportDSL.parse(report)

  doc.transact(() => {
    dsl.set('version', normalized.version)
    dsl.set('pages', ensureReportPages(normalized.pages))
  })

  return new VBIReportBuilder<TQueryDSL, TSeedDSL>(doc, options)
}
