import { ChartTypeEnum } from '@visactor/vseed'
import type { VBIDimension } from 'src/types'

export type SupportedDimensionEncoding = NonNullable<VBIDimension['encoding']>

type DimensionEncodingStrategy = {
  supported: readonly SupportedDimensionEncoding[]
  recommend: (index: number) => SupportedDimensionEncoding
}

const DIMENSION_ENCODING_SUPPORT = {
  table: ['column'],
  pivotTable: ['row', 'column'],
  column: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  columnParallel: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  columnPercent: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  line: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  area: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  areaPercent: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  dualAxis: ['xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  bar: ['yAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  barParallel: ['yAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  barPercent: ['yAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  pie: ['color', 'detail', 'tooltip', 'label', 'row', 'column'],
  donut: ['color', 'detail', 'tooltip', 'label', 'row', 'column'],
  funnel: ['color', 'detail', 'tooltip', 'label', 'row', 'column'],
  scatter: ['color', 'detail', 'tooltip', 'label', 'row', 'column'],
  rose: ['angle', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  roseParallel: ['angle', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  radar: ['angle', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  heatmap: ['xAxis', 'yAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  boxplot: ['xAxis', 'color', 'tooltip', 'label', 'row', 'column'],
  histogram: ['color', 'detail', 'tooltip', 'label', 'row', 'column'],
  treeMap: ['hierarchy', 'detail', 'tooltip', 'label', 'row', 'column'],
  sunburst: ['hierarchy', 'detail', 'tooltip', 'label', 'row', 'column'],
  circlePacking: ['hierarchy', 'detail', 'tooltip', 'label', 'row', 'column'],
  raceBar: ['player', 'yAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  raceColumn: ['player', 'xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  raceLine: ['player', 'xAxis', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  raceScatter: ['player', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  racePie: ['player', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
  raceDonut: ['player', 'color', 'detail', 'tooltip', 'label', 'row', 'column'],
} as const satisfies Record<string, readonly SupportedDimensionEncoding[]>

const repeatEncoding =
  (first: SupportedDimensionEncoding, rest: SupportedDimensionEncoding = first) =>
  (index: number) =>
    index === 0 ? first : rest

const alternateEncoding = (a: SupportedDimensionEncoding, b: SupportedDimensionEncoding) => (index: number) =>
  index % 2 === 0 ? a : b

const STRATEGY_BY_CHART_TYPE: Record<string, DimensionEncodingStrategy> = {
  [ChartTypeEnum.Table]: {
    supported: DIMENSION_ENCODING_SUPPORT.table,
    recommend: repeatEncoding('column'),
  },
  [ChartTypeEnum.PivotTable]: {
    supported: DIMENSION_ENCODING_SUPPORT.pivotTable,
    recommend: alternateEncoding('column', 'row'),
  },
  [ChartTypeEnum.Column]: {
    supported: DIMENSION_ENCODING_SUPPORT.column,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.ColumnParallel]: {
    supported: DIMENSION_ENCODING_SUPPORT.columnParallel,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.ColumnPercent]: {
    supported: DIMENSION_ENCODING_SUPPORT.columnPercent,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.Line]: {
    supported: DIMENSION_ENCODING_SUPPORT.line,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.Area]: {
    supported: DIMENSION_ENCODING_SUPPORT.area,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.AreaPercent]: {
    supported: DIMENSION_ENCODING_SUPPORT.areaPercent,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.DualAxis]: {
    supported: DIMENSION_ENCODING_SUPPORT.dualAxis,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.Bar]: {
    supported: DIMENSION_ENCODING_SUPPORT.bar,
    recommend: repeatEncoding('yAxis', 'color'),
  },
  [ChartTypeEnum.BarParallel]: {
    supported: DIMENSION_ENCODING_SUPPORT.barParallel,
    recommend: repeatEncoding('yAxis', 'color'),
  },
  [ChartTypeEnum.BarPercent]: {
    supported: DIMENSION_ENCODING_SUPPORT.barPercent,
    recommend: repeatEncoding('yAxis', 'color'),
  },
  [ChartTypeEnum.Pie]: {
    supported: DIMENSION_ENCODING_SUPPORT.pie,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.Donut]: {
    supported: DIMENSION_ENCODING_SUPPORT.donut,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.Funnel]: {
    supported: DIMENSION_ENCODING_SUPPORT.funnel,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.Scatter]: {
    supported: DIMENSION_ENCODING_SUPPORT.scatter,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.Rose]: {
    supported: DIMENSION_ENCODING_SUPPORT.rose,
    recommend: repeatEncoding('angle', 'color'),
  },
  [ChartTypeEnum.RoseParallel]: {
    supported: DIMENSION_ENCODING_SUPPORT.roseParallel,
    recommend: repeatEncoding('angle', 'color'),
  },
  [ChartTypeEnum.Radar]: {
    supported: DIMENSION_ENCODING_SUPPORT.radar,
    recommend: repeatEncoding('angle', 'color'),
  },
  [ChartTypeEnum.Heatmap]: {
    supported: DIMENSION_ENCODING_SUPPORT.heatmap,
    recommend: repeatEncoding('xAxis', 'yAxis'),
  },
  [ChartTypeEnum.Boxplot]: {
    supported: DIMENSION_ENCODING_SUPPORT.boxplot,
    recommend: repeatEncoding('xAxis', 'color'),
  },
  [ChartTypeEnum.Histogram]: {
    supported: DIMENSION_ENCODING_SUPPORT.histogram,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.TreeMap]: {
    supported: DIMENSION_ENCODING_SUPPORT.treeMap,
    recommend: repeatEncoding('hierarchy'),
  },
  [ChartTypeEnum.Sunburst]: {
    supported: DIMENSION_ENCODING_SUPPORT.sunburst,
    recommend: repeatEncoding('hierarchy'),
  },
  [ChartTypeEnum.CirclePacking]: {
    supported: DIMENSION_ENCODING_SUPPORT.circlePacking,
    recommend: repeatEncoding('hierarchy'),
  },
  [ChartTypeEnum.RaceBar]: {
    supported: DIMENSION_ENCODING_SUPPORT.raceBar,
    recommend: (index) => {
      if (index === 0) return 'player'
      if (index === 1) return 'yAxis'
      return 'color'
    },
  },
  [ChartTypeEnum.RaceColumn]: {
    supported: DIMENSION_ENCODING_SUPPORT.raceColumn,
    recommend: (index) => {
      if (index === 0) return 'player'
      if (index === 1) return 'xAxis'
      return 'color'
    },
  },
  [ChartTypeEnum.RaceLine]: {
    supported: DIMENSION_ENCODING_SUPPORT.raceLine,
    recommend: (index) => (index === 0 ? 'player' : 'color'),
  },
  [ChartTypeEnum.RaceScatter]: {
    supported: DIMENSION_ENCODING_SUPPORT.raceScatter,
    recommend: (index) => (index === 0 ? 'player' : 'color'),
  },
  [ChartTypeEnum.RacePie]: {
    supported: DIMENSION_ENCODING_SUPPORT.racePie,
    recommend: (index) => (index === 0 ? 'player' : 'color'),
  },
  [ChartTypeEnum.RaceDonut]: {
    supported: DIMENSION_ENCODING_SUPPORT.raceDonut,
    recommend: (index) => (index === 0 ? 'player' : 'color'),
  },
}

const DEFAULT_STRATEGY = STRATEGY_BY_CHART_TYPE[ChartTypeEnum.Table]

export const getSupportedDimensionEncodingsForChartType = (chartType: string): SupportedDimensionEncoding[] => {
  return [...(STRATEGY_BY_CHART_TYPE[chartType] || DEFAULT_STRATEGY).supported]
}

export const getRecommendedDimensionEncodingsForChartType = (
  chartType: string,
  dimensionCount: number,
): SupportedDimensionEncoding[] => {
  const strategy = STRATEGY_BY_CHART_TYPE[chartType] || DEFAULT_STRATEGY
  if (dimensionCount <= 0) return []

  return Array.from({ length: dimensionCount }, (_, index) => strategy.recommend(index))
}
