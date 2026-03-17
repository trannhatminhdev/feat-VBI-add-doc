import * as Y from 'yjs'
import type { VBIDSL } from 'src/types'

export const buildVBIDSL = (dsl: Y.Map<any>): VBIDSL => {
  return dsl.toJSON() as VBIDSL
}
