import * as Y from 'yjs'
import type { VBIChartDSLInput } from 'src/types'
import { ensureYArray } from '../normalize/ensure-y-array'
import { ensureWhereGroup } from '../normalize/ensure-where-group'
import { ensureHavingGroup } from '../normalize/ensure-having-group'
import { setBaseDSLFields } from './set-base-dsl-fields'

export const fillVBIChartDSLMap = (dsl: Y.Map<any>, vbi: VBIChartDSLInput) => {
  dsl.clear()
  setBaseDSLFields(dsl, vbi)
  dsl.set('whereFilter', ensureWhereGroup(vbi.whereFilter))
  dsl.set('havingFilter', ensureHavingGroup(vbi.havingFilter))
  dsl.set('measures', ensureYArray(vbi.measures, 'field'))
  dsl.set('dimensions', ensureYArray(vbi.dimensions, 'field'))
}
