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
} from './chartType'

/**
 * VSeed 核心 Schema 定义
 * @description 包含所有支持的图表类型的联合类型
 * @note 显式类型注解为 z.ZodType<any>，因为 discriminatedUnion 包含所有图表类型的复杂并集，
 *       推断类型会超过编译器序列化限制，需要显式注解以提升编译性能
 */
export const zVSeed: z.ZodType<any> = z.discriminatedUnion('chartType', [
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

  // race
  zRaceBar,
  zRaceColumn,
  zRaceScatter,

  // hierarchy
  zTreeMap,
  zSunburst,
  zCirclePacking,

  // other
  zFunnel,
  zHeatmap,
  zBoxPlot,
  zHistogram,
])
