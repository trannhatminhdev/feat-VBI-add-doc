import { z } from 'zod'

export const zPivotChartGridConfig = z.object({
  borderColor: z.string().nullish(),
  bodyFontSize: z.number().nullish(),
  bodyFontColor: z.string().nullish(),
  headerFontSize: z.number().nullish(),
  headerFontColor: z.string().nullish(),
  headerBackgroundColor: z.string().nullish(),
  hoverHeaderBackgroundColor: z.string().nullish(),
  hoverHeaderInlineBackgroundColor: z.string().nullish(),
  outlineBorderLineWidth: z.number().nullish(),
  frameCornerRadius: z.number().nullish(),

  minChartWidth: z.number().nullish(),
  minChartHeight: z.number().nullish(),

  titleFontColor: z.string().nullish(),
  titleFontSize: z.number().nullish(),
  titleFontWeight: z.string().nullish(),

  chartGridColor: z.string().nullish(),
  axisLabelColor: z.string().nullish(),
  axisLabelFontSize: z.number().nullish(),
})

export type PivotChartGridConfig = z.infer<typeof zPivotChartGridConfig>
