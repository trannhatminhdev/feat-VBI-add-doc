import { z } from 'zod'

import { zBar } from './chartType/bar'
import { zBarParallel } from './chartType/barParallel'
import { zColumn } from './chartType/column'
import { zColumnParallel } from './chartType/columnParallel'
import { zColumnPercent } from './chartType/columnPercent'
import { zLine } from './chartType/line'
import { zRose } from './chartType/rose'
import { zBarPercent } from './chartType/barPercent'
import { zPie } from './chartType/pie'
import { zDonut } from './chartType/donut'
import { zArea } from './chartType/area'
import { zAreaPercent } from './chartType/areaPercent'
import {
  zBoxPlot,
  zDualAxis,
  zFunnel,
  zHeatmap,
  zHistogram,
  zPivotTable,
  zRadar,
  zRoseParallel,
  zScatter,
  zTable,
  zRaceBar,
  zRaceColumn,
  zRaceScatter,
  zTreeMap,
  zSunburst,
  zCirclePacking,
  zRaceLine,
  zRacePie,
  zRaceDonut,
} from './chartType'

/**
 * @description VSeed 核心 Schema 定义 包含所有支持的图表类型的联合类型
 */
export const zVSeed: z.ZodTypeAny = z.discriminatedUnion('chartType', [
  zTable,
  zPivotTable,
  // cartesian
  zLine,
  zColumn,
  zColumnParallel,
  zColumnPercent,
  zBar,
  zBarParallel,
  zBarPercent,
  zArea,
  zAreaPercent,
  zScatter,
  zDualAxis,
  // polar
  zPie,
  zDonut,
  zRose,
  zRoseParallel,
  zRadar,

  // hierarchy
  zTreeMap,
  zSunburst,
  zCirclePacking,

  // race
  zRaceBar,
  zRaceColumn,
  zRaceScatter,
  zRaceLine,
  zRacePie,
  zRaceDonut,

  // other
  zFunnel,
  zHeatmap,
  zBoxPlot,
  zHistogram,
])
