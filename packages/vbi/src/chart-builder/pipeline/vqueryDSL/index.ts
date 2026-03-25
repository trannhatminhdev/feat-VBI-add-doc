import { pipe } from 'remeda'
import type { VQueryDSL } from '@visactor/vquery'
import type { VBIChartBuilderInterface, VBIChartDSL } from 'src/types'
import type { buildPipe } from './types'
import { buildSelect } from './buildSelect'
import { buildGroupBy } from './buildGroupBy'
import { buildWhere } from './buildWhere'
import { buildHaving } from './buildHaving'
import { buildOrderBy } from './buildOrderBy'
import { buildLimit } from './buildLimit'

export const buildVQuery = (vbiDSL: VBIChartDSL, builder: VBIChartBuilderInterface<any, any>) => {
  const wrapper = (processor: buildPipe) => {
    return (queryDSL: VQueryDSL): VQueryDSL => processor(queryDSL, { vbiDSL, builder })
  }

  return pipe(
    {} as VQueryDSL,
    wrapper(buildSelect),
    wrapper(buildGroupBy),
    wrapper(buildWhere),
    wrapper(buildHaving),
    wrapper(buildOrderBy),
    wrapper(buildLimit),
  )
}
