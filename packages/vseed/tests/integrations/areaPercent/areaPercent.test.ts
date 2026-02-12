import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './axes/areaPercentXAxis.json'
import config_1 from './axes/areaPercentXAxisEnable.json'
import config_2 from './axes/areaPercentYAxis.json'
import config_3 from './axes/areaPercentYAxisEnable.json'
import config_4 from './chartType/minimal.json'
import config_5 from './chartType/simple.json'
import config_6 from './chartType/standard.json'
import config_7 from './color/dimension.json'
import config_8 from './color/measure.json'
import config_9 from './combination/basic.json'
import config_10 from './combination/basicV2.json'
import config_11 from './dataset/onlyMeasures.json'
import config_12 from './markStyle/lineStyleMeasureCondition.json'
import config_13 from './markStyle/lineStyleParialDatum.json'
import config_14 from './markStyle/pointStyleMeasureCondition.json'
import config_15 from './markStyle/selectorAreaMeasureCondition.json'
import config_16 from './markStyle/selectorAreaPartialDatum.json'
import config_17 from './markStyle/selectorLineMeasureCondition.json'
import config_18 from './markStyle/selectorPointMeasureCondition.json'
import config_19 from './pivotGrid/pivotBasic.json'
import config_20 from './pivotGrid/pivotBasicV2.json'

const cases = [
  { name: 'axes/areaPercentXAxis', vseed: config_0 },
  { name: 'axes/areaPercentXAxisEnable', vseed: config_1 },
  { name: 'axes/areaPercentYAxis', vseed: config_2 },
  { name: 'axes/areaPercentYAxisEnable', vseed: config_3 },
  { name: 'chartType/minimal', vseed: config_4 },
  { name: 'chartType/simple', vseed: config_5 },
  { name: 'chartType/standard', vseed: config_6 },
  { name: 'color/dimension', vseed: config_7 },
  { name: 'color/measure', vseed: config_8 },
  { name: 'combination/basic', vseed: config_9 },
  { name: 'combination/basicV2', vseed: config_10 },
  { name: 'dataset/onlyMeasures', vseed: config_11 },
  { name: 'markStyle/lineStyleMeasureCondition', vseed: config_12 },
  { name: 'markStyle/lineStyleParialDatum', vseed: config_13 },
  { name: 'markStyle/pointStyleMeasureCondition', vseed: config_14 },
  { name: 'markStyle/selectorAreaMeasureCondition', vseed: config_15 },
  { name: 'markStyle/selectorAreaPartialDatum', vseed: config_16 },
  { name: 'markStyle/selectorLineMeasureCondition', vseed: config_17 },
  { name: 'markStyle/selectorPointMeasureCondition', vseed: config_18 },
  { name: 'pivotGrid/pivotBasic', vseed: config_19 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_20 }
]

describe('areaPercent', () => {
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
