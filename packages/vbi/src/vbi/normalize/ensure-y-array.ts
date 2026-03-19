import * as Y from 'yjs'
import { toYMap, type EnsureIdMode } from './to-y-map'

export const ensureYArray = (arr: any, ensureId: EnsureIdMode = false): Y.Array<any> => {
  if (!arr) {
    return new Y.Array<any>()
  }

  const yArr = new Y.Array<any>()
  for (const item of arr as any[]) {
    yArr.push([toYMap(item, ensureId)])
  }

  return yArr
}
