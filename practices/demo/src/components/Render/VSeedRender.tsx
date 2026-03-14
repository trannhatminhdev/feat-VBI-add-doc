import { useRef, useEffect } from 'react';
import VChart, { ISpec } from '@visactor/vchart';
import {
  ListTable,
  PivotTable,
  PivotChart,
  register,
  PivotChartConstructorOptions,
  ListTableConstructorOptions,
  PivotTableConstructorOptions,
} from '@visactor/vtable';
import {
  registerAll,
  VSeed,
  isPivotChart,
  isVChart,
  isPivotTable,
  isTable,
  ColorIdEncoding,
  Builder as VSeedBuilder,
} from '@visactor/vseed';

registerAll();
register.chartModule('vchart', VChart);

export const VSeedRender = (props: { vseed: VSeed }) => {
  const { vseed } = props;
  const ref = useRef<HTMLDivElement>(null);
  const vseedBuilderRef = useRef<VSeedBuilder>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    try {
      const theme = 'light';
      const builder = VSeedBuilder.from({ ...vseed, theme });
      const spec = builder.build();

      vseedBuilderRef.current = builder;
      if (isPivotChart(vseed)) {
        const tableInstance = new PivotChart(
          ref.current,
          spec as PivotChartConstructorOptions,
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleLegendItemClick = (args: any) => {
          console.log('LEGEND_ITEM_CLICK', args);
          tableInstance.updateFilterRules([
            {
              filterKey: ColorIdEncoding,
              filteredValues: args.value,
            },
          ]);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleLegendChange = (args: any) => {
          const maxValue = args.value[1];
          const minValue = args.value[0];
          tableInstance.updateFilterRules([
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              filterFunc: (record: any) => {
                const value = record[record[ColorIdEncoding]];
                if (value >= minValue && value <= maxValue) {
                  return true;
                }
                return false;
              },
            },
          ]);
        };

        tableInstance.on('legend_item_click', handleLegendItemClick);
        tableInstance.on('legend_change', handleLegendChange);

        return () => {
          tableInstance.off('legend_item_click', handleLegendItemClick);
          tableInstance.off('legend_change', handleLegendChange);
          tableInstance.release();
        };
      } else if (isPivotTable(vseed)) {
        // Check PivotTable BEFORE Table since PivotTable is a type of table
        const tableInstance = new PivotTable(
          ref.current,
          spec as PivotTableConstructorOptions,
        );
        return () => tableInstance.release();
      } else if (isTable(vseed)) {
        const tableInstance = new ListTable(
          ref.current,
          spec as ListTableConstructorOptions,
        );
        return () => tableInstance.release();
      } else if (isVChart(vseed)) {
        const vchart = new VChart(spec as ISpec, { dom: ref.current });
        vchart.renderSync();
        return () => vchart.release();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('VSeed Render Error:', error);
    }
  }, [vseed]);

  return (
    <div
      ref={ref}
      style={{ height: '100%', width: '100%', minHeight: 300 }}
      onClick={() => {
        console.group(`selected ${vseed.chartType}`);
        console.log('builder', vseedBuilderRef.current);
        console.log(
          'spec',
          vseedBuilderRef.current && vseedBuilderRef.current.spec,
        );
        console.log(
          'vseed',
          vseedBuilderRef.current && vseedBuilderRef.current.vseed,
        );
        console.log(
          'advancedVSeed',
          vseedBuilderRef.current && vseedBuilderRef.current.advancedVSeed,
        );
        console.groupEnd();
      }}
    ></div>
  );
};

// react 应用程序, 有一个非常非常重要的概念是: UI状态和业务逻辑是分离的
