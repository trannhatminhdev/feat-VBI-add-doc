import { isPivotChart, isVTable } from 'src/pipeline/utils'
import type { VChartSpecPipe } from 'src/types'

export const isPlayer = (playerPipe: VChartSpecPipe, defaultPipe: VChartSpecPipe): VChartSpecPipe => {
  return (spec, context) => {
    const { vseed, advancedVSeed } = context
    const { encoding } = advancedVSeed

    const hasPlayerEncoding = encoding.player && encoding.player.length > 0
    const isStandardChart = !isVTable(vseed) && !isPivotChart(vseed)

    if (hasPlayerEncoding && isStandardChart) {
      return playerPipe(spec, context)
    }

    return defaultPipe(spec, context)
  }
}
