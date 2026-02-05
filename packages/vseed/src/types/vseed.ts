import type {
  Area,
  AreaPercent,
  Bar,
  BarParallel,
  BarPercent,
  BoxPlot,
  Column,
  ColumnParallel,
  ColumnPercent,
  Donut,
  DualAxis,
  Funnel,
  Heatmap,
  Histogram,
  Line,
  Pie,
  PivotTable,
  Radar,
  Rose,
  RoseParallel,
  Scatter,
  Table,
  RaceBar,
  RaceColumn,
  RaceScatter,
} from './chartType'

export type VSeed =
  // table
  | Table
  | PivotTable

  // cartesian
  | Line
  | Column
  | ColumnParallel
  | ColumnPercent
  | Bar
  | BarParallel
  | BarPercent
  | Area
  | AreaPercent
  | Scatter
  | DualAxis

  // polar
  | Rose
  | RoseParallel
  | Pie
  | Donut
  | Radar

  // race
  | RaceBar
  | RaceColumn
  | RaceScatter

  // other
  | Funnel
  | Heatmap
  | BoxPlot
  | Histogram

export type VSeedDSL = VSeed
