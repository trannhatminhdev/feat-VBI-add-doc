import { z } from 'zod'
import { zChartType } from './properties/chartType'
import { zDataset } from './properties/dataset'
import { zDimensions, zDimensionTree } from './properties/dimensions'
import { zMeasures, zMeasureTree } from './properties/measures'
import { zEncoding } from './properties/encoding'
import { zDatasetReshapeInfo } from './properties/datasetReshapeInfo'
import { zTheme, zCustomThemeConfig } from './properties/theme'
import { zConfig, type Config } from './properties/config'
import {
  zAnalysis,
  zAnnotation,
  zRegressionLine,
  zMarkStyle,
  zPage,
  zPivotTableTotals,
  type PivotTableTotals,
} from './properties'
import { zLocale } from './i18n'
import { zCellStyle } from './properties/cellStyle/cellStyle'

export type AdvancedVSeed = {
  chartType: z.infer<typeof zChartType>
  dataset: z.infer<typeof zDataset>
  datasetReshapeInfo: z.infer<typeof zDatasetReshapeInfo>
  pivotAllDatasetReshapeInfo: z.infer<typeof zDatasetReshapeInfo>
  dimensions?: z.infer<typeof zDimensions>
  measures?: z.infer<typeof zMeasures>
  reshapeMeasures?: z.infer<typeof zMeasures>[]
  reshapeDimensions?: z.infer<typeof zDimensions>
  measureTree?: z.infer<typeof zMeasureTree>
  dimensionTree?: z.infer<typeof zDimensionTree>
  encoding: z.infer<typeof zEncoding>
  page?: z.infer<typeof zPage>
  config: Config
  analysis: z.infer<typeof zAnalysis>
  theme: z.infer<typeof zTheme>
  markStyle: z.infer<typeof zMarkStyle>
  cellStyle: z.infer<typeof zCellStyle>
  customTheme: z.infer<typeof zCustomThemeConfig>
  annotation: z.infer<typeof zAnnotation>
  locale: z.infer<typeof zLocale>
  regressionLine: z.infer<typeof zRegressionLine>
  totals?: PivotTableTotals
}

export const zAdvancedVSeed: z.ZodType<AdvancedVSeed> = z.object({
  chartType: zChartType,
  dataset: zDataset,
  datasetReshapeInfo: zDatasetReshapeInfo,
  pivotAllDatasetReshapeInfo: zDatasetReshapeInfo,
  dimensions: zDimensions.optional(),
  measures: zMeasures.optional(),
  reshapeMeasures: z.array(zMeasures).optional(),
  reshapeDimensions: zDimensions.optional(),
  measureTree: zMeasureTree.optional(), // 现在只有表格中可能会配置这种树状结构
  dimensionTree: zDimensionTree.optional(), // 现在只有表格中可能会配置这种树状结构
  encoding: zEncoding,
  page: zPage.optional(),
  config: zConfig,
  analysis: zAnalysis,
  theme: zTheme,
  markStyle: zMarkStyle,
  cellStyle: zCellStyle,
  customTheme: zCustomThemeConfig,
  annotation: zAnnotation,
  locale: zLocale,
  regressionLine: zRegressionLine,
  totals: zPivotTableTotals.optional(),
})
