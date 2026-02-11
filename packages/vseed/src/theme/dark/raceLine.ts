import type { Player } from 'src/types'
import { getLineTheme } from './line'
import { getDarkPlayer } from '../common'

export const getRaceLineTheme = () => {
  const lineTheme = getLineTheme()
  const player = getDarkPlayer() as Player

  return {
    ...lineTheme,
    legend: {
      ...lineTheme.legend,
      enable: false,
    },
    player,
  }
}
