import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './analysis/sortByDimensionOfBar.json'
import config_1 from './annotation/annotationAreaBar.json'
import config_2 from './annotation/annotationAreaSelectorHorizontal.json'
import config_3 from './axes/barXAxis.json'
import config_4 from './axes/barXAxisEnable.json'
import config_5 from './axes/barYAxis.json'
import config_6 from './axes/barYAxisEnable.json'
import config_7 from './axes/xAxisHorizontal.json'
import config_8 from './axes/yAxisHorizontal.json'
import config_9 from './barStyle/nearlyEqual.json'
import config_10 from './baseConfig/baseConfigBackgroundColor.json'
import config_11 from './chartType/minimal.json'
import config_12 from './chartType/simple.json'
import config_13 from './chartType/standard.json'
import config_14 from './color/dimension.json'
import config_15 from './color/measure.json'
import config_16 from './color/pivot-color-dim.json'
import config_17 from './combination/basic.json'
import config_18 from './combination/basicV2.json'
import config_19 from './dataset/onlyMeasures.json'
import config_20 from './markStyle/barStylePartialDatum.json'
import config_21 from './markStyle/selectorBarPartialDatum.json'
import config_22 from './pivotGrid/pivotBasic.json'
import config_23 from './pivotGrid/pivotBasicV2.json'
import config_24 from './tooltip/bar.json'

const cases = [
  { name: 'analysis/sortByDimensionOfBar', vseed: config_0 },
  { name: 'annotation/annotationAreaBar', vseed: config_1 },
  { name: 'annotation/annotationAreaSelectorHorizontal', vseed: config_2 },
  { name: 'axes/barXAxis', vseed: config_3 },
  { name: 'axes/barXAxisEnable', vseed: config_4 },
  { name: 'axes/barYAxis', vseed: config_5 },
  { name: 'axes/barYAxisEnable', vseed: config_6 },
  { name: 'axes/xAxisHorizontal', vseed: config_7 },
  { name: 'axes/yAxisHorizontal', vseed: config_8 },
  { name: 'barStyle/nearlyEqual', vseed: config_9 },
  { name: 'baseConfig/baseConfigBackgroundColor', vseed: config_10 },
  { name: 'chartType/minimal', vseed: config_11 },
  { name: 'chartType/simple', vseed: config_12 },
  { name: 'chartType/standard', vseed: config_13 },
  { name: 'color/dimension', vseed: config_14 },
  { name: 'color/measure', vseed: config_15 },
  { name: 'color/pivot-color-dim', vseed: config_16 },
  { name: 'combination/basic', vseed: config_17 },
  { name: 'combination/basicV2', vseed: config_18 },
  { name: 'dataset/onlyMeasures', vseed: config_19 },
  { name: 'markStyle/barStylePartialDatum', vseed: config_20 },
  { name: 'markStyle/selectorBarPartialDatum', vseed: config_21 },
  { name: 'pivotGrid/pivotBasic', vseed: config_22 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_23 },
  { name: 'tooltip/bar', vseed: config_24 }
]

describe('bar', () => {
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
