import * as Y from 'yjs'
import type { VBIDSLInput } from 'src/types'
import { VBIBuilder } from 'src/builder'
import { ensureYArray } from '../normalize/ensure-y-array'
import { ensureWhereGroup } from '../normalize/ensure-where-group'
import { ensureHavingGroup } from '../normalize/ensure-having-group'
import { setBaseDSLFields } from './set-base-dsl-fields'

export const fromVBIDSLInput = (vbi: VBIDSLInput) => {
  const doc = new Y.Doc()
  const dsl = doc.getMap('dsl')

  doc.transact(() => {
    setBaseDSLFields(dsl, vbi)
    dsl.set('whereFilter', ensureWhereGroup(vbi.whereFilter))
    dsl.set('havingFilter', ensureHavingGroup(vbi.havingFilter))
    dsl.set('measures', ensureYArray(vbi.measures))
    dsl.set('dimensions', ensureYArray(vbi.dimensions))
  })

  return new VBIBuilder(doc)
}
