import type { ILineChartSpec } from '@visactor/vchart'
import type { Label, VChartSpecPipe } from 'src/types'
import { label as commonLabel } from './label'

export const labelCirclePacking: VChartSpecPipe = (spec, context) => {
  const { advancedVSeed } = context
  const { chartType } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { label: Label }
  const { label } = baseConfig

  // Reuse common label logic to build basic label config
  const result = commonLabel(spec, context) as ILineChartSpec

  // If label is enabled, override with circlePacking specific logic
  if (label?.enable) {
    const labelSpec = result.label as any
    result.label = {
      ...labelSpec,
      style: {
        ...labelSpec?.style,
        fontSize: 10,
        visible: (d: any) => {
          return d.depth === 1
        },
      },
    }
  }

  return result
}
