import type { ILineChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'
import { label as commonLabel } from './label'
import { createFormatterByDimension } from 'src/pipeline/utils'
import { Separator } from 'src/dataReshape'

export const labelSunburst: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { chartType, encoding, dimensions = [] } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { label: Label }
  const { label } = baseConfig

  // Reuse common label logic
  const result = commonLabel(spec, context) as ILineChartSpec

  // Override with sunburst specific logic
  if (label?.enable) {
    const labelSpec = result.label as any
    const formatHierarchyName = (name: string) => {
      const dimIds = encoding.hierarchy || []
      if (!dimIds.length) {
        return name
      }
      const dimFormatters = dimIds.map((id) => {
        const dim = dimensions.find((item) => item.id === id)
        return createFormatterByDimension(dim, advancedVSeed.locale)
      })
      const parts = String(name ?? '').split(Separator)
      const formatted = parts.map((part, index) => {
        const formatter = dimFormatters[index] || ((v: string) => v)
        return formatter(part)
      })
      return formatted.join(Separator)
    }

    result.label = {
      ...labelSpec,
      formatMethod: (_: unknown, datum: any) => {
        return formatHierarchyName(String(datum?.name ?? ''))
      },
      style: {
        ...labelSpec?.style,
        fontSize: 12,
        fillOpacity: (datum: any) => {
          if (encoding.hierarchy?.length === 1) {
            return 1
          }
          return datum.isLeaf ? 0.4 : 0.6
        },
      },
    }
  }

  return result
}
