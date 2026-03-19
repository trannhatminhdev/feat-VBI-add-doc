import { useEffect, useRef, type CSSProperties } from 'react';
import VChart, { type ISpec } from '@visactor/vchart';
import {
  ListTable,
  PivotChart,
  PivotTable,
  register,
  type ListTableConstructorOptions,
  type PivotChartConstructorOptions,
  type PivotTableConstructorOptions,
} from '@visactor/vtable';
import {
  Builder as VSeedBuilder,
  ColorIdEncoding,
  isPivotChart,
  isPivotTable,
  isTable,
  isVChart,
  registerAll,
  type VSeed,
} from '@visactor/vseed';

registerAll();
register.chartModule('vchart', VChart);

export function VSeedRender(props: {
  style?: CSSProperties;
  vseed: VSeed;
}) {
  const { style, vseed } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    try {
      const builder = VSeedBuilder.from({ ...vseed, theme: 'light' });
      const spec = builder.build();

      if (isPivotChart(vseed)) {
        const tableInstance = new PivotChart(
          ref.current,
          spec as PivotChartConstructorOptions,
        );

        tableInstance.on(
          'legend_item_click',
          (args: { value: string[] | number[] }) => {
          tableInstance.updateFilterRules([
            {
              filterKey: ColorIdEncoding,
              filteredValues: args.value,
            },
          ]);
          },
        );

        tableInstance.on(
          'legend_change',
          (args: { value: [number, number] }) => {
          const maxValue = args.value[1];
          const minValue = args.value[0];
          tableInstance.updateFilterRules([
            {
              filterFunc: (record: Record<string, number>) => {
                const value = record[record[ColorIdEncoding]];
                return value >= minValue && value <= maxValue;
              },
            },
          ]);
          },
        );

        return () => tableInstance.release();
      }

      if (isVChart(vseed)) {
        const vchart = new VChart(spec as ISpec, { dom: ref.current });
        vchart.renderSync();
        return () => vchart.release();
      }

      if (isTable(vseed)) {
        const tableInstance = new ListTable(
          ref.current,
          spec as ListTableConstructorOptions,
        );
        return () => tableInstance.release();
      }

      if (isPivotTable(vseed)) {
        const tableInstance = new PivotTable(
          ref.current,
          spec as PivotTableConstructorOptions,
        );
        return () => tableInstance.release();
      }
    } catch (error) {
      console.error('Failed to render VSeed in vbi-react starter demo:', error);
    }
  }, [vseed]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 320,
        width: '100%',
        ...style,
      }}
    />
  );
}
