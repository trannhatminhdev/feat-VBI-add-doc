import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './analysis/sortLegendByColorItemIds.json'
import config_1 from './analysis/sortLegendByCustomId.json'
import config_2 from './annotation/annotationAreaSelectorVertical.json'
import config_3 from './axes/columnParallelXAxis.json'
import config_4 from './axes/columnParallelXAxisEnable.json'
import config_5 from './axes/columnParallelYAxis.json'
import config_6 from './axes/columnParallelYAxisEnable.json'
import config_7 from './baseConfig/baseConfigColorMapping.json'
import config_8 from './baseConfig/baseConfigColorScheme.json'
import config_9 from './baseConfig/baseConfigLabel.json'
import config_10 from './baseConfig/baseConfigLegend.json'
import config_11 from './baseConfig/baseConfigLegendBorder.json'
import config_12 from './baseConfig/baseConfigLegendLabel.json'
import config_13 from './baseConfig/baseConfigLegendMaxSize.json'
import config_14 from './baseConfig/baseConfigLegendPosition.json'
import config_15 from './chartType/defaultDetail.json'
import config_16 from './chartType/minimal.json'
import config_17 from './chartType/simple.json'
import config_18 from './chartType/standard.json'
import config_19 from './color/colorMapping.json'
import config_20 from './color/colorScheme.json'
import config_21 from './color/dimension.json'
import config_22 from './color/measure.json'
import config_23 from './color/pivotColorScheme.json'
import config_24 from './combination/basic.json'
import config_25 from './combination/basicV2.json'
import config_26 from './dataset/1m0d.json'
import config_27 from './dataset/1m1d.json'
import config_28 from './dataset/1m3d.json'
import config_29 from './dataset/3m0d.json'
import config_30 from './dataset/3m1d.json'
import config_31 from './dataset/3m3d.json'
import config_32 from './dataset/autoDataset.json'
import config_33 from './dataset/dataset.json'
import config_34 from './dataset/dataset1M0D.json'
import config_35 from './dataset/dataset1M1D.json'
import config_36 from './dataset/dataset1M3D.json'
import config_37 from './dataset/dataset3M0D.json'
import config_38 from './dataset/dataset3M1D.json'
import config_39 from './dataset/dataset3M3D.json'
import config_40 from './dataset/onlyMeasures.json'
import config_41 from './dimensions/columnDimensions.json'
import config_42 from './dimensions/dimensions.json'
import config_43 from './dimensions/pivotDimensions.json'
import config_44 from './dimensions/rowDimensions.json'
import config_45 from './legend/border.json'
import config_46 from './legend/enable.json'
import config_47 from './legend/labelFontColor.json'
import config_48 from './legend/labelFontSize.json'
import config_49 from './legend/labelFontWeight.json'
import config_50 from './legend/maxSize.json'
import config_51 from './legend/position.json'
import config_52 from './locale/enUS.json'
import config_53 from './locale/zhCN.json'
import config_54 from './markStyle/barStyleDimensionCondition.json'
import config_55 from './markStyle/selectorBarDimensionCondition.json'
import config_56 from './measures/measureAutoDataFormat.json'
import config_57 from './measures/measureDataFormat.json'
import config_58 from './measures/measures.json'
import config_59 from './pivotGrid/pivotBasic.json'
import config_60 from './pivotGrid/pivotBasicV2.json'
import config_61 from './stackCornerRadius/column.json'
import config_62 from './theme/themeDark.json'
import config_63 from './theme/themeLight.json'
import config_64 from './tooltip/dimension-tooltip.json'

const cases = [
  { name: 'analysis/sortLegendByColorItemIds', vseed: config_0 },
  { name: 'analysis/sortLegendByCustomId', vseed: config_1 },
  { name: 'annotation/annotationAreaSelectorVertical', vseed: config_2 },
  { name: 'axes/columnParallelXAxis', vseed: config_3 },
  { name: 'axes/columnParallelXAxisEnable', vseed: config_4 },
  { name: 'axes/columnParallelYAxis', vseed: config_5 },
  { name: 'axes/columnParallelYAxisEnable', vseed: config_6 },
  { name: 'baseConfig/baseConfigColorMapping', vseed: config_7 },
  { name: 'baseConfig/baseConfigColorScheme', vseed: config_8 },
  { name: 'baseConfig/baseConfigLabel', vseed: config_9 },
  { name: 'baseConfig/baseConfigLegend', vseed: config_10 },
  { name: 'baseConfig/baseConfigLegendBorder', vseed: config_11 },
  { name: 'baseConfig/baseConfigLegendLabel', vseed: config_12 },
  { name: 'baseConfig/baseConfigLegendMaxSize', vseed: config_13 },
  { name: 'baseConfig/baseConfigLegendPosition', vseed: config_14 },
  { name: 'chartType/defaultDetail', vseed: config_15 },
  { name: 'chartType/minimal', vseed: config_16 },
  { name: 'chartType/simple', vseed: config_17 },
  { name: 'chartType/standard', vseed: config_18 },
  { name: 'color/colorMapping', vseed: config_19 },
  { name: 'color/colorScheme', vseed: config_20 },
  { name: 'color/dimension', vseed: config_21 },
  { name: 'color/measure', vseed: config_22 },
  { name: 'color/pivotColorScheme', vseed: config_23 },
  { name: 'combination/basic', vseed: config_24 },
  { name: 'combination/basicV2', vseed: config_25 },
  { name: 'dataset/1m0d', vseed: config_26 },
  { name: 'dataset/1m1d', vseed: config_27 },
  { name: 'dataset/1m3d', vseed: config_28 },
  { name: 'dataset/3m0d', vseed: config_29 },
  { name: 'dataset/3m1d', vseed: config_30 },
  { name: 'dataset/3m3d', vseed: config_31 },
  { name: 'dataset/autoDataset', vseed: config_32 },
  { name: 'dataset/dataset', vseed: config_33 },
  { name: 'dataset/dataset1M0D', vseed: config_34 },
  { name: 'dataset/dataset1M1D', vseed: config_35 },
  { name: 'dataset/dataset1M3D', vseed: config_36 },
  { name: 'dataset/dataset3M0D', vseed: config_37 },
  { name: 'dataset/dataset3M1D', vseed: config_38 },
  { name: 'dataset/dataset3M3D', vseed: config_39 },
  { name: 'dataset/onlyMeasures', vseed: config_40 },
  { name: 'dimensions/columnDimensions', vseed: config_41 },
  { name: 'dimensions/dimensions', vseed: config_42 },
  { name: 'dimensions/pivotDimensions', vseed: config_43 },
  { name: 'dimensions/rowDimensions', vseed: config_44 },
  { name: 'legend/border', vseed: config_45 },
  { name: 'legend/enable', vseed: config_46 },
  { name: 'legend/labelFontColor', vseed: config_47 },
  { name: 'legend/labelFontSize', vseed: config_48 },
  { name: 'legend/labelFontWeight', vseed: config_49 },
  { name: 'legend/maxSize', vseed: config_50 },
  { name: 'legend/position', vseed: config_51 },
  { name: 'locale/enUS', vseed: config_52 },
  { name: 'locale/zhCN', vseed: config_53 },
  { name: 'markStyle/barStyleDimensionCondition', vseed: config_54 },
  { name: 'markStyle/selectorBarDimensionCondition', vseed: config_55 },
  { name: 'measures/measureAutoDataFormat', vseed: config_56 },
  { name: 'measures/measureDataFormat', vseed: config_57 },
  { name: 'measures/measures', vseed: config_58 },
  { name: 'pivotGrid/pivotBasic', vseed: config_59 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_60 },
  { name: 'stackCornerRadius/column', vseed: config_61 },
  { name: 'theme/themeDark', vseed: config_62 },
  { name: 'theme/themeLight', vseed: config_63 },
  { name: 'tooltip/dimension-tooltip', vseed: config_64 }
]

describe('columnParallel', () => {
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
