import * as Y from 'yjs'
import type { VBIReportPageDSLInput, VBIReportTextDSLInput } from 'src/types'
import { id } from 'src/utils'
import { generateEmptyChartDSL } from '../generate-empty-dsl'
import { fillVBIChartDSLMap } from './fill-vbi-chart-dsl-map'

const createReportTextYMap = (text?: VBIReportTextDSLInput) => {
  const yMap = new Y.Map<any>()
  yMap.set('content', text?.content ?? '')
  return yMap
}

export const createReportPageYMap = (page: VBIReportPageDSLInput): Y.Map<any> => {
  const yMap = new Y.Map<any>()
  const chart = new Y.Map<any>()

  yMap.set('id', page.id || id.uuid())
  yMap.set('title', page.title)
  fillVBIChartDSLMap(chart, page.chart)
  yMap.set('chart', chart)
  yMap.set('text', createReportTextYMap(page.text))
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

export const getOrCreateReportChartMap = (page: Y.Map<any>) => {
  const chart = page.get('chart')
  if (chart instanceof Y.Map) {
    return chart as Y.Map<any>
  }

  const nextChart = new Y.Map<any>()
  fillVBIChartDSLMap(nextChart, generateEmptyChartDSL(''))
  page.set('chart', nextChart)
  return nextChart
}

export const getOrCreateReportTextMap = (page: Y.Map<any>) => {
  const text = page.get('text')
  if (text instanceof Y.Map) {
    return text as Y.Map<any>
  }

  const nextText = createReportTextYMap()
  page.set('text', nextText)
  return nextText
}

export const locateReportPageIndexById = (pages: Y.Array<Y.Map<any>>, pageId: string) => {
  return pages.toArray().findIndex((page) => page.get('id') === pageId)
}
