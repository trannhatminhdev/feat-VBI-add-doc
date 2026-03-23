import { useCallback } from 'react';
import type { VBIChartBuilder } from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

export const useVBIChartType = (builder: VBIChartBuilder | undefined) => {
  const chartType = useBuilderDocState({
    builder,
    fallback: 'table',
    getSnapshot: (activeBuilder) => activeBuilder.chartType.getChartType(),
  });

  const changeChartType = useCallback(
    (type: string) => builder?.chartType.changeChartType(type),
    [builder],
  );

  return {
    chartType,
    changeChartType,
    availableChartTypes: builder?.chartType.getAvailableChartTypes() ?? [],
  };
};
