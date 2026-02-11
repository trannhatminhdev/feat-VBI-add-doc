import type { IMarkPointSpec, ISpec } from '@visactor/vchart'
import { selector, selectorWithDynamicFilter } from '../../../../../dataSelector'
import type { Datum, SpecPipelineContext, VChartSpecPipe } from 'src/types'
import { isSubset } from './utils'
import { flatReshapeMeasures } from 'src/pipeline/utils'
import { MeasureId } from 'src/dataReshape/constant'
import { pickWithout } from '@visactor/vutils'
import { generateAnnotationPointPipe } from './annotationPointCommon'

export const annotationPointOfDualAxis: VChartSpecPipe = generateAnnotationPointPipe({
  findSelectedDatas: (options) => {
    const { dataset, selector: s, dynamicFilter, context } = options
    return dataset.reduce((res: Datum[], d: Datum) => {
      const { advancedVSeed } = context
      const allMeasureIds = flatReshapeMeasures(advancedVSeed.reshapeMeasures ?? []).map((m) => m.id)
      const pickedDatum = pickWithout(
        d,
        allMeasureIds.filter((id) => id !== d[MeasureId]),
      )

      const shouldSelect = dynamicFilter
        ? selectorWithDynamicFilter(pickedDatum, dynamicFilter, s)
        : selector(pickedDatum, s)

      if (shouldSelect) {
        res.push(pickedDatum)
      }

      return res
    }, [])
  },
  generateMarkPoint: (datum: Datum, spec: ISpec, context: SpecPipelineContext) => {
    const { advancedVSeed } = context
    const allMeasureIds = flatReshapeMeasures(advancedVSeed.reshapeMeasures ?? []).map((m) => m.id)
    return spec.series?.map((s: any, index: number) => {
      return {
        relativeSeriesIndex: index,
        coordinate: (data: Datum[]) => {
          return data.find((item) => {
            return isSubset(
              datum,
              item,
              allMeasureIds.filter((id) => id !== item[MeasureId]),
            )
          })
        },
      } as IMarkPointSpec
    })
  },
})
