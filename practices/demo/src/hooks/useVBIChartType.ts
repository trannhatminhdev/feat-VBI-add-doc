import { useState, useEffect, useCallback } from 'react';
import { VBIChartBuilder } from '@visactor/vbi';

/**
 * VBI ChartType Hook
 * 提供图表类型管理
 */
export const useVBIChartType = (builder: VBIChartBuilder | undefined) => {
  const [chartType, setChartType] = useState<string>('table');

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 初始化
    setChartType(builder.chartType.getChartType());

    // 监听变化
    const wrapper = () => {
      setChartType(builder.chartType.getChartType());
    };

    builder.dsl.observe(wrapper);
    return () => {
      builder.dsl.unobserve(wrapper);
    };
  }, [builder]);

  // 切换图表类型
  const changeChartType = useCallback(
    (type: string) => {
      if (builder) {
        builder.chartType.changeChartType(type);
      }
    },
    [builder],
  );

  // 获取所有可用的图表类型
  const getAvailableChartTypes = useCallback(() => {
    if (builder) {
      return builder.chartType.getAvailableChartTypes();
    }
    return [];
  }, [builder]);

  return {
    chartType,
    changeChartType,
    getAvailableChartTypes,
  };
};
