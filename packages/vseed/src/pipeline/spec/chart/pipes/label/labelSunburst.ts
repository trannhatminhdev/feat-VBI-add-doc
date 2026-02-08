import type { ILineChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'
import { label as commonLabel } from './label'

export const labelSunburst: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { chartType, encoding } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { label: Label }
  const { label } = baseConfig

  // Reuse common label logic
  const result = commonLabel(spec, context) as ILineChartSpec

  // Override with sunburst specific logic
  if (label?.enable) {
    const labelSpec = result.label as any
    result.label = {
      ...labelSpec,
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
