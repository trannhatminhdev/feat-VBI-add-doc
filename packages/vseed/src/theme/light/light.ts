import type { CustomThemeConfig } from 'src/types'
import { getLightTableConfig } from '../common'

import { getLineTheme } from './line'
import { getColumnTheme, getColumnParallelTheme, getColumnPercentTheme } from './column'
import { getBarTheme, getBarParallelTheme, getBarPercentTheme } from './bar'
import { getAreaTheme, getAreaPercentTheme } from './area'
import { getScatterTheme } from './scatter'
import { getDualAxisTheme } from './dualAxis'
import { getPieTheme, getDonutTheme } from './pie'
import { getRadarTheme } from './radar'
import { getRoseTheme, getRoseParallelTheme } from './rose'
import { getFunnelTheme } from './funnel'
import { getHeatmapTheme } from './heatmap'
import { getHistogramTheme } from './histogram'
import { getBoxPlotTheme } from './boxPlot'
import { getTreeMapTheme, getSunburstTheme, getCirclePackingTheme } from './hierarchy'
import { getRaceBarTheme, getRaceColumnTheme, getRaceScatterTheme } from './race'
import { getRaceLineTheme } from './raceLine'
import { getRacePieTheme, getRaceDonutTheme } from './racePie'

export const lightTheme = (): CustomThemeConfig => {
  const tableConfig = getLightTableConfig()

  return {
    config: {
      // table
      table: tableConfig,
      pivotTable: tableConfig,
      // cartesian
      line: getLineTheme(),
      column: getColumnTheme(),
      columnParallel: getColumnParallelTheme(),
      columnPercent: getColumnPercentTheme(),
      bar: getBarTheme(),
      barParallel: getBarParallelTheme(),
      barPercent: getBarPercentTheme(),
      area: getAreaTheme(),
      areaPercent: getAreaPercentTheme(),
      scatter: getScatterTheme(),
      dualAxis: getDualAxisTheme(),
      // polar
      pie: getPieTheme(),
      donut: getDonutTheme(),
      radar: getRadarTheme(),
      rose: getRoseTheme(),
      roseParallel: getRoseParallelTheme(),
      // other
      funnel: getFunnelTheme(),
      heatmap: getHeatmapTheme(),
      histogram: getHistogramTheme(),
      boxPlot: getBoxPlotTheme(),

      // hierarchy
      treeMap: getTreeMapTheme(),
      sunburst: getSunburstTheme(),
      circlePacking: getCirclePackingTheme(),

      // race
      raceBar: getRaceBarTheme(),
      raceColumn: getRaceColumnTheme(),
      raceScatter: getRaceScatterTheme(),
      raceLine: getRaceLineTheme(),
      racePie: getRacePieTheme(),
      raceDonut: getRaceDonutTheme(),
    },
  }
}
