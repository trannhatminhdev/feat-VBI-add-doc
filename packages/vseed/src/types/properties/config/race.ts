import type { z } from 'zod'
import { zBarConfig } from './bar'
import { zColumnConfig } from './column'
import { zScatterConfig } from './scatter'
import { zXBandAxis } from './axes'

export const zRaceBarConfig = zBarConfig
export const zRaceColumnConfig = zColumnConfig
export const zRaceScatterConfig = zScatterConfig.extend({
  xAxis: zXBandAxis.nullish(),
})

export type RaceBarConfig = z.infer<typeof zRaceBarConfig>
export type RaceColumnConfig = z.infer<typeof zRaceColumnConfig>
export type RaceScatterConfig = z.infer<typeof zRaceScatterConfig>
