import type { IPlayerSpec } from '@visactor/vchart'
import { groupBy } from 'remeda'
import { isPivotChart, isVTable } from 'src/pipeline/utils'
import type { Player, VChartSpecPipe, VSeed } from 'src/types'

export const playerAdapter = (pipe: VChartSpecPipe): VChartSpecPipe => {
  return (spec, context) => {
    const { vseed, advancedVSeed } = context
    const { datasetReshapeInfo } = advancedVSeed
    const { player } = vseed as VSeed & { player?: Player }
    if (!player || isVTable(vseed) || isPivotChart(vseed)) {
      return pipe(spec, context)
    }
    const id = datasetReshapeInfo[0].id
    const nextSpec = pipe(spec, context)
    const { field, autoPlay = true, interval = 1000, loop = false } = player

    const dataGroups = groupBy(advancedVSeed.dataset, (item) => item[field])

    const specs = Object.values(dataGroups).map((items) => ({
      ...nextSpec,
      data: {
        id: id,
        values: items,
      },
    }))
    return {
      ...nextSpec,
      player: {
        auto: autoPlay,
        interval: interval,
        loop: loop,
        alternate: false,
        position: 'middle',
        type: 'discrete',
        specs,
      } as IPlayerSpec,
    }
  }
}
