import { ChartTypeEnum } from '@visactor/vseed'
import type { VBIMeasure } from 'src/types'

export type SupportedMeasureEncoding = NonNullable<VBIMeasure['encoding']>

type MeasureEncodingStrategy = {
  supported: readonly SupportedMeasureEncoding[]
  recommend: (index: number) => SupportedMeasureEncoding
}

const MEASURE_ENCODING_SUPPORT = {
  table: ['column'],
  pivotTable: ['detail'],
  column: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  columnParallel: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  columnPercent: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  line: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  area: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  areaPercent: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  bar: ['xAxis', 'detail', 'color', 'label', 'tooltip'],
  barParallel: ['xAxis', 'detail', 'color', 'label', 'tooltip'],
  barPercent: ['xAxis', 'detail', 'color', 'label', 'tooltip'],
  dualAxis: ['primaryYAxis', 'secondaryYAxis', 'color', 'label', 'tooltip'],
  scatter: ['xAxis', 'yAxis', 'size', 'color', 'label', 'tooltip'],
  pie: ['angle', 'detail', 'color', 'label', 'tooltip'],
  donut: ['angle', 'detail', 'color', 'label', 'tooltip'],
  rose: ['radius', 'detail', 'color', 'label', 'tooltip'],
  roseParallel: ['radius', 'detail', 'color', 'label', 'tooltip'],
  radar: ['radius', 'detail', 'color', 'label', 'tooltip'],
  funnel: ['size', 'detail', 'color', 'label', 'tooltip'],
  heatmap: ['color', 'detail', 'label', 'tooltip'],
  histogram: ['value', 'x0', 'x1', 'yAxis', 'detail', 'color', 'label', 'tooltip'],
  boxplot: ['value', 'q1', 'q3', 'min', 'max', 'median', 'outliers', 'color', 'label', 'tooltip'],
  treeMap: ['size', 'detail', 'color', 'label', 'tooltip'],
  sunburst: ['size', 'detail', 'color', 'label', 'tooltip'],
  circlePacking: ['size', 'detail', 'color', 'label', 'tooltip'],
  raceBar: ['xAxis', 'detail', 'color', 'label', 'tooltip'],
  raceColumn: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  raceLine: ['yAxis', 'detail', 'color', 'label', 'tooltip'],
  raceScatter: ['xAxis', 'yAxis', 'size', 'color', 'label', 'tooltip'],
  racePie: ['angle', 'detail', 'color', 'label', 'tooltip'],
  raceDonut: ['angle', 'detail', 'color', 'label', 'tooltip'],
} as const satisfies Record<string, readonly SupportedMeasureEncoding[]>

const repeatEncoding =
  (first: SupportedMeasureEncoding, rest: SupportedMeasureEncoding = first) =>
  (index: number) =>
    index === 0 ? first : rest

const STRATEGY_BY_CHART_TYPE: Record<string, MeasureEncodingStrategy> = {
  [ChartTypeEnum.Table]: {
    supported: MEASURE_ENCODING_SUPPORT.table,
    recommend: repeatEncoding('column'),
  },
  [ChartTypeEnum.PivotTable]: {
    supported: MEASURE_ENCODING_SUPPORT.pivotTable,
    recommend: repeatEncoding('detail'),
  },
  [ChartTypeEnum.Column]: {
    supported: MEASURE_ENCODING_SUPPORT.column,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.ColumnParallel]: {
    supported: MEASURE_ENCODING_SUPPORT.columnParallel,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.ColumnPercent]: {
    supported: MEASURE_ENCODING_SUPPORT.columnPercent,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.Line]: {
    supported: MEASURE_ENCODING_SUPPORT.line,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.Area]: {
    supported: MEASURE_ENCODING_SUPPORT.area,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.AreaPercent]: {
    supported: MEASURE_ENCODING_SUPPORT.areaPercent,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.Bar]: {
    supported: MEASURE_ENCODING_SUPPORT.bar,
    recommend: repeatEncoding('xAxis'),
  },
  [ChartTypeEnum.BarParallel]: {
    supported: MEASURE_ENCODING_SUPPORT.barParallel,
    recommend: repeatEncoding('xAxis'),
  },
  [ChartTypeEnum.BarPercent]: {
    supported: MEASURE_ENCODING_SUPPORT.barPercent,
    recommend: repeatEncoding('xAxis'),
  },
  [ChartTypeEnum.DualAxis]: {
    supported: MEASURE_ENCODING_SUPPORT.dualAxis,
    recommend: (index) => (index === 0 ? 'primaryYAxis' : 'secondaryYAxis'),
  },
  [ChartTypeEnum.Scatter]: {
    supported: MEASURE_ENCODING_SUPPORT.scatter,
    recommend: (index) => (index === 0 ? 'xAxis' : 'yAxis'),
  },
  [ChartTypeEnum.Pie]: {
    supported: MEASURE_ENCODING_SUPPORT.pie,
    recommend: repeatEncoding('angle'),
  },
  [ChartTypeEnum.Donut]: {
    supported: MEASURE_ENCODING_SUPPORT.donut,
    recommend: repeatEncoding('angle'),
  },
  [ChartTypeEnum.Rose]: {
    supported: MEASURE_ENCODING_SUPPORT.rose,
    recommend: repeatEncoding('radius'),
  },
  [ChartTypeEnum.RoseParallel]: {
    supported: MEASURE_ENCODING_SUPPORT.roseParallel,
    recommend: repeatEncoding('radius'),
  },
  [ChartTypeEnum.Radar]: {
    supported: MEASURE_ENCODING_SUPPORT.radar,
    recommend: repeatEncoding('radius'),
  },
  [ChartTypeEnum.Funnel]: {
    supported: MEASURE_ENCODING_SUPPORT.funnel,
    recommend: repeatEncoding('size'),
  },
  [ChartTypeEnum.Heatmap]: {
    supported: MEASURE_ENCODING_SUPPORT.heatmap,
    recommend: repeatEncoding('color'),
  },
  [ChartTypeEnum.Histogram]: {
    supported: MEASURE_ENCODING_SUPPORT.histogram,
    recommend: repeatEncoding('value'),
  },
  [ChartTypeEnum.Boxplot]: {
    supported: MEASURE_ENCODING_SUPPORT.boxplot,
    recommend: repeatEncoding('value'),
  },
  [ChartTypeEnum.TreeMap]: {
    supported: MEASURE_ENCODING_SUPPORT.treeMap,
    recommend: repeatEncoding('size'),
  },
  [ChartTypeEnum.Sunburst]: {
    supported: MEASURE_ENCODING_SUPPORT.sunburst,
    recommend: repeatEncoding('size'),
  },
  [ChartTypeEnum.CirclePacking]: {
    supported: MEASURE_ENCODING_SUPPORT.circlePacking,
    recommend: repeatEncoding('size'),
  },
  [ChartTypeEnum.RaceBar]: {
    supported: MEASURE_ENCODING_SUPPORT.raceBar,
    recommend: repeatEncoding('xAxis'),
  },
  [ChartTypeEnum.RaceColumn]: {
    supported: MEASURE_ENCODING_SUPPORT.raceColumn,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.RaceLine]: {
    supported: MEASURE_ENCODING_SUPPORT.raceLine,
    recommend: repeatEncoding('yAxis'),
  },
  [ChartTypeEnum.RaceScatter]: {
    supported: MEASURE_ENCODING_SUPPORT.raceScatter,
    recommend: (index) => (index === 0 ? 'xAxis' : 'yAxis'),
  },
  [ChartTypeEnum.RacePie]: {
    supported: MEASURE_ENCODING_SUPPORT.racePie,
    recommend: repeatEncoding('angle'),
  },
  [ChartTypeEnum.RaceDonut]: {
    supported: MEASURE_ENCODING_SUPPORT.raceDonut,
    recommend: repeatEncoding('angle'),
  },
}

const DEFAULT_STRATEGY = STRATEGY_BY_CHART_TYPE[ChartTypeEnum.Table]

export const getSupportedMeasureEncodingsForChartType = (chartType: string): SupportedMeasureEncoding[] => {
  return [...(STRATEGY_BY_CHART_TYPE[chartType] || DEFAULT_STRATEGY).supported]
}

export const getRecommendedMeasureEncodingsForChartType = (
  chartType: string,
  measureCount: number,
): SupportedMeasureEncoding[] => {
  const strategy = STRATEGY_BY_CHART_TYPE[chartType] || DEFAULT_STRATEGY
  if (measureCount <= 0) return []

  return Array.from({ length: measureCount }, (_, index) => strategy.recommend(index))
}
