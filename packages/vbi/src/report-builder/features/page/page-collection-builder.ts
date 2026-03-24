import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/chart-builder/adapters/vquery-vseed/types'
import type { VBIReportBuilderOptions } from 'src/types'
import type { VBIReportBuilder } from 'src/report-builder/builder'
import { generateEmptyReportPageDSL } from 'src/vbi/generate-empty-report-page-dsl'
import { createReportPageYMap, getOrCreateReportPages, locateReportPageIndexById } from 'src/vbi/from/report-page-y-map'
import { ReportPageBuilder } from './page-builder'

export class ReportPageCollectionBuilder<TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL> {
  constructor(
    private parent: VBIReportBuilder<TQueryDSL, TSeedDSL>,
    private doc: Y.Doc,
    private dsl: Y.Map<any>,
    private options?: VBIReportBuilderOptions<TQueryDSL, TSeedDSL>,
  ) {
    doc.transact(() => {
      getOrCreateReportPages(this.dsl)
    })
  }

  add(
    title: string,
    callback?: (page: ReportPageBuilder<TQueryDSL, TSeedDSL>) => void,
  ): VBIReportBuilder<TQueryDSL, TSeedDSL> {
    const pageMap = createReportPageYMap({
      ...generateEmptyReportPageDSL(),
      title,
    })

    this.doc.transact(() => {
      getOrCreateReportPages(this.dsl).push([pageMap])
    })

    if (callback) {
      callback(this.createPageBuilder(pageMap))
    }

    return this.parent
  }

  remove(pageId: string): VBIReportBuilder<TQueryDSL, TSeedDSL> {
    this.doc.transact(() => {
      const pages = getOrCreateReportPages(this.dsl)
      const index = locateReportPageIndexById(pages, pageId)
      if (index !== -1) {
        pages.delete(index, 1)
      }
    })
    return this.parent
  }

  update(
    pageId: string,
    callback: (page: ReportPageBuilder<TQueryDSL, TSeedDSL>) => void,
  ): VBIReportBuilder<TQueryDSL, TSeedDSL> {
    this.doc.transact(() => {
      const page = this.get(pageId)
      if (!page) {
        throw new Error(`Report page with id "${pageId}" not found`)
      }
      callback(page)
    })
    return this.parent
  }

  get(pageId: string): ReportPageBuilder<TQueryDSL, TSeedDSL> | undefined {
    const pages = getOrCreateReportPages(this.dsl)
    const index = locateReportPageIndexById(pages, pageId)
    return index === -1 ? undefined : this.createPageBuilder(pages.get(index))
  }

  private createPageBuilder(page: Y.Map<any>) {
    return new ReportPageBuilder<TQueryDSL, TSeedDSL>(this.doc, page, this.options?.chart)
  }
}
