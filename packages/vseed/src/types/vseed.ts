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
  TreeMap,
  Sunburst,
  CirclePacking,
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

  // hierarchy
  | TreeMap
  | Sunburst
  | CirclePacking

  // other
  | Funnel
  | Heatmap
  | BoxPlot
  | Histogram

export type VSeedDSL = VSeed
