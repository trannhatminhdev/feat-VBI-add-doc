import type { VBIChartBuilder } from '@visactor/vbi'

import { useBuilderObserver } from '../internal'

export interface UseChartTypeReturn {
  availableChartTypes: string[]
  chartType: string
  setChartType: (chartType: string) => void
}

export function useChartType(builder: VBIChartBuilder): UseChartTypeReturn {
  const chartType = useBuilderObserver(
    (callback) => builder.chartType.observe(() => callback()),
    () => builder.chartType.getChartType(),
  )

  return {
    availableChartTypes: builder.chartType.getAvailableChartTypes(),
    chartType,
    setChartType: (chartTypeValue) => {
      builder.chartType.changeChartType(chartTypeValue)
    },
  }
}
