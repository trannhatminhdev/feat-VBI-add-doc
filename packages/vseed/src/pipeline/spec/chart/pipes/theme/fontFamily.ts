import type { VChartSpecPipe } from 'src/types'

type FontFamilyAwareChartConfig = {
  fontFamily?: string
}

export const fontFamilyTheme: VChartSpecPipe = (spec, context) => {
  const result = { ...spec } as Record<string, unknown>
  const { advancedVSeed } = context
  const chartConfig = (advancedVSeed.config?.[advancedVSeed.chartType] || {}) as FontFamilyAwareChartConfig

  if (!chartConfig.fontFamily) {
    return result
  }

  const theme =
    typeof result.theme === 'object' && result.theme !== null && !Array.isArray(result.theme)
      ? (result.theme as Record<string, unknown>)
      : {}

  result.theme = {
    ...theme,
    fontFamily: chartConfig.fontFamily,
  }

  return result
}
