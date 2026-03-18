import * as Y from 'yjs'
import type { DefaultVBIQueryDSL, DefaultVBISeedDSL } from 'src/builder/adapters/vquery-vseed/types'
import type { VBIDSLInput, VBIBuilderOptions } from 'src/types'
import { VBIBuilder } from 'src/builder'
import { ensureYArray } from '../normalize/ensure-y-array'
import { ensureWhereGroup } from '../normalize/ensure-where-group'
import { ensureHavingGroup } from '../normalize/ensure-having-group'
import { setBaseDSLFields } from './set-base-dsl-fields'

export const fromVBIDSLInput = <TQueryDSL = DefaultVBIQueryDSL, TSeedDSL = DefaultVBISeedDSL>(
  vbi: VBIDSLInput,
  options?: VBIBuilderOptions<TQueryDSL, TSeedDSL>,
) => {
  const doc = new Y.Doc()
  const dsl = doc.getMap('dsl')

  doc.transact(() => {
    setBaseDSLFields(dsl, vbi)
    dsl.set('whereFilter', ensureWhereGroup(vbi.whereFilter))
    dsl.set('havingFilter', ensureHavingGroup(vbi.havingFilter))
    dsl.set('measures', ensureYArray(vbi.measures, 'field'))
    dsl.set('dimensions', ensureYArray(vbi.dimensions, 'field'))
  })

  return new VBIBuilder<TQueryDSL, TSeedDSL>(doc, options)
}
