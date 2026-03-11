import { pipe } from 'remeda'
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIDSL } from '../../types'
import type { VBIBuilder } from '../../builder'
import type { buildPipe } from './types'
import { buildSelect } from './buildSelect'
import { buildGroupBy } from './buildGroupBy'
import { buildWhere } from './buildWhere'
import { buildHaving } from './buildHaving'
import { buildLimit } from './buildLimit'

export const buildVQuery = (vbiDSL: VBIDSL, builder: VBIBuilder) => {
  const wrapper = (processor: buildPipe) => {
    return (queryDSL: VQueryDSL): VQueryDSL => processor(queryDSL, { vbiDSL, builder })
  }

  return pipe(
    {} as VQueryDSL,
    wrapper(buildSelect),
    wrapper(buildGroupBy),
    wrapper(buildWhere),
    wrapper(buildHaving),
    wrapper(buildLimit),
  )
}
