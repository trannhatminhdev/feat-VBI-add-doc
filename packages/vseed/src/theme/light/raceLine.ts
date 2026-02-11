import type { Player } from 'src/types'
import { getLineTheme } from './line'
import { getLightPlayer } from '../common'

export const getRaceLineTheme = () => {
  const lineTheme = getLineTheme()
  const player = getLightPlayer() as Player

  return {
    ...lineTheme,
    legend: {
      ...lineTheme.legend,
      enable: false,
    },
    xAxis: {
      ...lineTheme.xAxis,
      animation: {
        duration: player.interval,
      },
    },
    label: {
      ...lineTheme.label,
      enable: false,
    },
    yAxis: {
      ...lineTheme.yAxis,
      max: true,
      animation: {
        duration: player.interval,
        easing: 'linear',
      },
      nice: true,
    },
    player: {
      ...player,
      maxCount: false as const,
    } as Player,
  }
}
