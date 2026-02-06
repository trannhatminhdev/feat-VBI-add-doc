import type { z } from 'zod'
import { zBarConfig } from './bar'
import { zColumnConfig } from './column'
import { zScatterConfig } from './scatter'
import { zXLinearAxis } from './axes'

import { zPlayer } from './player'

export const zRaceBarConfig = zBarConfig.extend({
  player: zPlayer.nullish(),
})
export const zRaceColumnConfig = zColumnConfig.extend({
  player: zPlayer.nullish(),
})
export const zRaceScatterConfig = zScatterConfig.extend({
  xAxis: zXLinearAxis.nullish(),
  player: zPlayer.nullish(),
})

export type RaceBarConfig = z.infer<typeof zRaceBarConfig>
export type RaceColumnConfig = z.infer<typeof zRaceColumnConfig>
export type RaceScatterConfig = z.infer<typeof zRaceScatterConfig>
