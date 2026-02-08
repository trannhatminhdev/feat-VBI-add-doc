import type { ILineChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'
import { label as commonLabel } from './label'

export const labelSunburst: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { chartType } = advancedVSeed
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
          return datum.isLeaf ? 0.4 : 0.8
        },
      },
    }
  }

  return result
}
