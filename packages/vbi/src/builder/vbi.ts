import { VBIConnectorId } from 'src/types/connector/connector'
import { VBIDSL } from 'src/types'
import { VBIBuilder } from './vbi-builder'
import { connectorMap, getConnector, registerConnector } from './connector'
import { id } from 'src/utils'

import * as Y from 'yjs'

const createVBI = () => {
  return {
    connectorMap: connectorMap,
    registerConnector: registerConnector,
    getConnector: getConnector,
    generateEmptyDSL: (connectorId: VBIConnectorId): VBIDSL => {
      return {
        connectorId: connectorId,
        chartType: 'table',
        measures: [],
        dimensions: [],
        whereFilters: [],
        havingFilters: [],
        theme: 'light',
        locale: 'zh-CN',
        version: 0,
      }
    },
    from: (vbi: VBIDSL) => {
      const doc = new Y.Doc()
      const dsl = doc.getMap('dsl')

      doc.transact(() => {
        if (vbi.connectorId) dsl.set('connectorId', vbi.connectorId)
        if (vbi.chartType) dsl.set('chartType', vbi.chartType)
        if (vbi.theme) dsl.set('theme', vbi.theme)
        if (vbi.limit) dsl.set('limit', vbi.limit)
        if (vbi.locale) dsl.set('locale', vbi.locale)
        if (vbi.version) dsl.set('version', vbi.version)

        // Initialize arrays - convert plain arrays to Y.Array if needed
        const toYMap = (obj: any, ensureId = false): Y.Map<any> => {
          const yMap = new Y.Map<any>()
          if (ensureId && !obj.id) {
            yMap.set('id', id.uuid())
          }
          for (const [key, value] of Object.entries(obj)) {
            if (key === 'conditions' && Array.isArray(value)) {
              const yArr = new Y.Array()
              ;(value as any[]).forEach((child: any) => {
                if (child instanceof Y.Map) {
                  yArr.push([child])
                } else if (typeof child === 'object' && child !== null) {
                  yArr.push([toYMap(child, true)])
                } else {
                  yArr.push([child])
                }
              })
              yMap.set(key, yArr)
            } else {
              yMap.set(key, value)
            }
          }
          return yMap
        }

        const ensureYArray = (arr: any, ensureId = false) => {
          if (!arr) return new Y.Array()
          if (arr instanceof Y.Array) return arr
          const yArr = new Y.Array()
          // Convert plain objects to Y.Map
          arr.forEach((item: any) => {
            if (item instanceof Y.Map) {
              yArr.push([item])
            } else if (typeof item === 'object' && item !== null) {
              yArr.push([toYMap(item, ensureId)])
            } else {
              yArr.push([item])
            }
          })
          return yArr
        }
        dsl.set('whereFilters', ensureYArray(vbi.whereFilters, true))
        dsl.set('havingFilters', ensureYArray(vbi.havingFilters, true))
        dsl.set('measures', ensureYArray(vbi.measures))
        dsl.set('dimensions', ensureYArray(vbi.dimensions))
      })

      return new VBIBuilder(doc)
    },
  }
}

export const VBI = createVBI()
