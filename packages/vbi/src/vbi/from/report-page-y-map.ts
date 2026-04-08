import * as Y from 'yjs'
import type { VBIReportPageDSLInput } from 'src/types'
import { id } from 'src/utils'

export const createReportPageYMap = (page: VBIReportPageDSLInput): Y.Map<any> => {
  const yMap = new Y.Map<any>()
  yMap.set('id', page.id || id.uuid())
  yMap.set('title', page.title)
  yMap.set('chartId', page.chartId ?? '')
  yMap.set('insightId', page.insightId ?? '')
  return yMap
}

export const ensureReportPages = (pages?: VBIReportPageDSLInput[]) => {
  const yArray = new Y.Array<any>()
  for (const page of pages ?? []) {
    yArray.push([createReportPageYMap(page)])
  }
  return yArray
}

export const getOrCreateReportPages = (dsl: Y.Map<any>) => {
  const pages = dsl.get('pages')
  if (pages instanceof Y.Array) {
    return pages as Y.Array<Y.Map<any>>
  }

  const nextPages = new Y.Array<Y.Map<any>>()
  dsl.set('pages', nextPages)
  return nextPages
}

export const locateReportPageIndexById = (pages: Y.Array<Y.Map<any>>, pageId: string) => {
  return pages.toArray().findIndex((page) => page.get('id') === pageId)
}
