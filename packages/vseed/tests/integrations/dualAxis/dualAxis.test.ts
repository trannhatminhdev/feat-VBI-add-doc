import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './annotation/annotationPointDualAxis.json'
import config_1 from './annotationPoint/dualAxis-multi-measures.json'
import config_2 from './annotationPoint/dualAxis.json'
import config_3 from './chartType/1_dimColor.json'
import config_4 from './chartType/3PivotOnlyOneAxis.json'
import config_5 from './chartType/4OnlySecondaryYAxis.json'
import config_6 from './chartType/5OnlyPrimaryYAxis.json'
import config_7 from './chartType/combinationDualAxis.json'
import config_8 from './chartType/different-axis-columns.json'
import config_9 from './chartType/dualYAxisArray.json'
import config_10 from './chartType/minimal.json'
import config_11 from './chartType/pivotDualAxis.json'
import config_12 from './chartType/simple.json'
import config_13 from './chartType/simpleV2.json'
import config_14 from './chartType/standard.json'
import config_15 from './chartType/standardV2.json'
import config_16 from './chartType/typeAreaArea.json'
import config_17 from './chartType/typeAreaAreaPercent.json'
import config_18 from './chartType/typeAreaColumn.json'
import config_19 from './color/dimension.json'
import config_20 from './color/measure.json'
import config_21 from './combination/basic.json'
import config_22 from './combination/basicV2.json'
import config_23 from './combination/columnColumn.json'
import config_24 from './combination/columnParallelArea.json'
import config_25 from './combination/columnParallelColumnparallel.json'
import config_26 from './combination/columnParallelLine.json'
import config_27 from './combination/columnPercentColumnpercent.json'
import config_28 from './combination/columnPercentScatter.json'
import config_29 from './combination/columnScatter.json'
import config_30 from './combination/lineArea.json'
import config_31 from './combination/lineColumn.json'
import config_32 from './combination/lineColumnparallel.json'
import config_33 from './combination/lineLine.json'
import config_34 from './combination/lineScatter.json'
import config_35 from './combination/scatterArea.json'
import config_36 from './combination/scatterColumnpercent.json'
import config_37 from './combination/scatterLine.json'
import config_38 from './combination/scatterScatter.json'
import config_39 from './combination/types.json'
import config_40 from './combination/typesArray.json'
import config_41 from './dataset/array.json'
import config_42 from './dataset/onlyMeasures.json'
import config_43 from './dualAxes/basic.json'
import config_44 from './dualChartType/tpye_area_area.json'
import config_45 from './dualChartType/tpye_area_areaPercent.json'
import config_46 from './dualChartType/tpye_area_column.json'
import config_47 from './dualChartType/tpye_column_parallel.json'
import config_48 from './dualChartType/tpye_p_column.json'
import config_49 from './dualChartType/type_columnParallel_area.json'
import config_50 from './dualChartType/type_columnParallel_columnParallel.json'
import config_51 from './dualChartType/type_columnParallel_line.json'
import config_52 from './dualChartType/type_columnPercent_columnPercent.json'
import config_53 from './dualChartType/type_columnPercent_scatter.json'
import config_54 from './dualChartType/type_column_column.json'
import config_55 from './dualChartType/type_column_scatter.json'
import config_56 from './dualChartType/type_line_area.json'
import config_57 from './dualChartType/type_line_column.json'
import config_58 from './dualChartType/type_line_columnParallel.json'
import config_59 from './dualChartType/type_line_line.json'
import config_60 from './dualChartType/type_line_scatter.json'
import config_61 from './dualChartType/type_scatter_area.json'
import config_62 from './dualChartType/type_scatter_columnPercent.json'
import config_63 from './dualChartType/type_scatter_line.json'
import config_64 from './dualChartType/type_scatter_scatter.json'
import config_65 from './dualMeasures/array.json'
import config_66 from './dualMeasures/array_sync.json'
import config_67 from './dualMeasures/basic.json'
import config_68 from './dualMeasures/basic_sync.json'
import config_69 from './measures/defaultParentIdForDualAxis.json'
import config_70 from './measures/first.json'
import config_71 from './measures/second.json'
import config_72 from './measures/third.json'
import config_73 from './pivotGrid/pivotBasic.json'
import config_74 from './pivotGrid/pivotBasicV2.json'
import config_75 from './stackCornerRadius/dualAxis.json'
import config_76 from './stackCornerRadius/secondary-bar.json'
import config_77 from './tooltip/dualAxis.json'
import config_78 from './tooltip/dualAxisCombination.json'
import config_79 from './tooltip/dualAxisPivot.json'

const cases = [
  { name: 'annotation/annotationPointDualAxis', vseed: config_0 },
  { name: 'annotationPoint/dualAxis-multi-measures', vseed: config_1 },
  { name: 'annotationPoint/dualAxis', vseed: config_2 },
  { name: 'chartType/1_dimColor', vseed: config_3 },
  { name: 'chartType/3PivotOnlyOneAxis', vseed: config_4 },
  { name: 'chartType/4OnlySecondaryYAxis', vseed: config_5 },
  { name: 'chartType/5OnlyPrimaryYAxis', vseed: config_6 },
  { name: 'chartType/combinationDualAxis', vseed: config_7 },
  { name: 'chartType/different-axis-columns', vseed: config_8 },
  { name: 'chartType/dualYAxisArray', vseed: config_9 },
  { name: 'chartType/minimal', vseed: config_10 },
  { name: 'chartType/pivotDualAxis', vseed: config_11 },
  { name: 'chartType/simple', vseed: config_12 },
  { name: 'chartType/simpleV2', vseed: config_13 },
  { name: 'chartType/standard', vseed: config_14 },
  { name: 'chartType/standardV2', vseed: config_15 },
  { name: 'chartType/typeAreaArea', vseed: config_16 },
  { name: 'chartType/typeAreaAreaPercent', vseed: config_17 },
  { name: 'chartType/typeAreaColumn', vseed: config_18 },
  { name: 'color/dimension', vseed: config_19 },
  { name: 'color/measure', vseed: config_20 },
  { name: 'combination/basic', vseed: config_21 },
  { name: 'combination/basicV2', vseed: config_22 },
  { name: 'combination/columnColumn', vseed: config_23 },
  { name: 'combination/columnParallelArea', vseed: config_24 },
  { name: 'combination/columnParallelColumnparallel', vseed: config_25 },
  { name: 'combination/columnParallelLine', vseed: config_26 },
  { name: 'combination/columnPercentColumnpercent', vseed: config_27 },
  { name: 'combination/columnPercentScatter', vseed: config_28 },
  { name: 'combination/columnScatter', vseed: config_29 },
  { name: 'combination/lineArea', vseed: config_30 },
  { name: 'combination/lineColumn', vseed: config_31 },
  { name: 'combination/lineColumnparallel', vseed: config_32 },
  { name: 'combination/lineLine', vseed: config_33 },
  { name: 'combination/lineScatter', vseed: config_34 },
  { name: 'combination/scatterArea', vseed: config_35 },
  { name: 'combination/scatterColumnpercent', vseed: config_36 },
  { name: 'combination/scatterLine', vseed: config_37 },
  { name: 'combination/scatterScatter', vseed: config_38 },
  { name: 'combination/types', vseed: config_39 },
  { name: 'combination/typesArray', vseed: config_40 },
  { name: 'dataset/array', vseed: config_41 },
  { name: 'dataset/onlyMeasures', vseed: config_42 },
  { name: 'dualAxes/basic', vseed: config_43 },
  { name: 'dualChartType/tpye_area_area', vseed: config_44 },
  { name: 'dualChartType/tpye_area_areaPercent', vseed: config_45 },
  { name: 'dualChartType/tpye_area_column', vseed: config_46 },
  { name: 'dualChartType/tpye_column_parallel', vseed: config_47 },
  { name: 'dualChartType/tpye_p_column', vseed: config_48 },
  { name: 'dualChartType/type_columnParallel_area', vseed: config_49 },
  { name: 'dualChartType/type_columnParallel_columnParallel', vseed: config_50 },
  { name: 'dualChartType/type_columnParallel_line', vseed: config_51 },
  { name: 'dualChartType/type_columnPercent_columnPercent', vseed: config_52 },
  { name: 'dualChartType/type_columnPercent_scatter', vseed: config_53 },
  { name: 'dualChartType/type_column_column', vseed: config_54 },
  { name: 'dualChartType/type_column_scatter', vseed: config_55 },
  { name: 'dualChartType/type_line_area', vseed: config_56 },
  { name: 'dualChartType/type_line_column', vseed: config_57 },
  { name: 'dualChartType/type_line_columnParallel', vseed: config_58 },
  { name: 'dualChartType/type_line_line', vseed: config_59 },
  { name: 'dualChartType/type_line_scatter', vseed: config_60 },
  { name: 'dualChartType/type_scatter_area', vseed: config_61 },
  { name: 'dualChartType/type_scatter_columnPercent', vseed: config_62 },
  { name: 'dualChartType/type_scatter_line', vseed: config_63 },
  { name: 'dualChartType/type_scatter_scatter', vseed: config_64 },
  { name: 'dualMeasures/array', vseed: config_65 },
  { name: 'dualMeasures/array_sync', vseed: config_66 },
  { name: 'dualMeasures/basic', vseed: config_67 },
  { name: 'dualMeasures/basic_sync', vseed: config_68 },
  { name: 'measures/defaultParentIdForDualAxis', vseed: config_69 },
  { name: 'measures/first', vseed: config_70 },
  { name: 'measures/second', vseed: config_71 },
  { name: 'measures/third', vseed: config_72 },
  { name: 'pivotGrid/pivotBasic', vseed: config_73 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_74 },
  { name: 'stackCornerRadius/dualAxis', vseed: config_75 },
  { name: 'stackCornerRadius/secondary-bar', vseed: config_76 },
  { name: 'tooltip/dualAxis', vseed: config_77 },
  { name: 'tooltip/dualAxisCombination', vseed: config_78 },
  { name: 'tooltip/dualAxisPivot', vseed: config_79 }
]

describe('dualAxis', () => {
  cases.forEach(({ name, vseed }) => {
    test(name, () => {
      registerAll()
      const { vseed: vseedConfig } = vseed as { vseed: unknown }
      const builder = Builder.from(vseedConfig as VSeed)
      const advanced = builder.buildAdvanced()
      
      expect(advanced).toBeDefined()
      expect(advanced).not.toBeNull()
      
      const spec = builder.buildSpec(advanced!)
      
      expect(spec).toBeDefined()
      expect(spec).not.toBeNull()
      
      // Verify builder methods return valid results
      expect(builder.getColorIdMap()).toBeDefined()
      expect(builder.getColorItems()).toBeDefined()
      expect(Builder.getAdvancedPipeline(builder.vseed.chartType)).toBeDefined()
      expect(Builder.getSpecPipeline(builder.vseed.chartType)).toBeDefined()
      expect(Builder.getTheme(builder.vseed.theme)).toBeDefined()
      expect(Builder.getThemeMap()).toBeDefined()
    });
  });
});
