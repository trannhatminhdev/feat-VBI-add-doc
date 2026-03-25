import type { VQueryDSL } from '@visactor/vquery'
import type { buildPipe } from './types'

export const buildLimit: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const limit = context.vbiDSL.limit ?? 1000
  result.limit = limit

  return result as VQueryDSL
}
