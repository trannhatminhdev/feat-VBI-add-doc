import { isPivotChart, isVTable } from 'src/pipeline/utils'
import type { Player, SpecPipelineContext } from 'src/types'
import type { Condition } from '../../utils'

export const isPlayer: Condition = (context: SpecPipelineContext): boolean => {
  const { vseed, advancedVSeed } = context
  const { chartType } = advancedVSeed
  const baseConfig = advancedVSeed.config[chartType] as { player: Player }
  if (!('player' in vseed) || !baseConfig || !baseConfig.player || isVTable(vseed) || isPivotChart(vseed)) {
    return false
  }
  return true
}
