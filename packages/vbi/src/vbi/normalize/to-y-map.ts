import * as Y from 'yjs'
import { id } from 'src/utils'

export type EnsureIdMode = boolean | 'field'

const shouldEnsureIdForObject = (obj: Record<string, any>, ensureId: EnsureIdMode): boolean => {
  if (ensureId === true) {
    return true
  }

  if (ensureId === 'field') {
    return typeof obj.field === 'string'
  }

  return false
}

export const toYMap = (obj: Record<string, any>, ensureId: EnsureIdMode = false): Y.Map<any> => {
  const yMap = new Y.Map<any>()

  if (shouldEnsureIdForObject(obj, ensureId) && !obj.id) {
    yMap.set('id', id.uuid())
  }

  for (const [key, value] of Object.entries(obj)) {
    if ((key === 'conditions' || key === 'children') && Array.isArray(value)) {
      const yArr = new Y.Array<any>()
      for (const child of value) {
        if (child instanceof Y.Map) {
          yArr.push([child])
          continue
        }
        if (typeof child === 'object' && child !== null) {
          yArr.push([toYMap(child as Record<string, any>, ensureId)])
          continue
        }
        yArr.push([child])
      }
      yMap.set(key, yArr)
      continue
    }

    yMap.set(key, value)
  }

  return yMap
}
