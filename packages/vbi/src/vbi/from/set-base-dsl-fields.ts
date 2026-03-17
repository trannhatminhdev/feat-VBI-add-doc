import * as Y from 'yjs'
import type { VBIDSLInput } from 'src/types'

export const setBaseDSLFields = (dsl: Y.Map<any>, vbi: VBIDSLInput) => {
  if (vbi.connectorId) dsl.set('connectorId', vbi.connectorId)
  if (vbi.chartType) dsl.set('chartType', vbi.chartType)
  if (vbi.theme) dsl.set('theme', vbi.theme)
  if (vbi.limit) dsl.set('limit', vbi.limit)
  if (vbi.locale) dsl.set('locale', vbi.locale)
  if (vbi.version !== undefined) dsl.set('version', vbi.version)
}
