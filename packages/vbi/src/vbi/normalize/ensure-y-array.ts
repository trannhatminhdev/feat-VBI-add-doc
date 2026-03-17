import * as Y from 'yjs'
import { toYMap } from './to-y-map'

export const ensureYArray = (arr: any, ensureId = false): Y.Array<any> => {
  if (!arr) {
    return new Y.Array<any>()
  }

  if (arr instanceof Y.Array) {
    return arr
  }

  const yArr = new Y.Array<any>()
  for (const item of arr as any[]) {
    if (item instanceof Y.Map) {
      yArr.push([item])
      continue
    }
    if (typeof item === 'object' && item !== null) {
      yArr.push([toYMap(item, ensureId)])
      continue
    }
    yArr.push([item])
  }

  return yArr
}
