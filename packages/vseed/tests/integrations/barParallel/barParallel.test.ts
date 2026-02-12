import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './axes/barParallelXAxis.json'
import config_1 from './axes/barParallelXAxisEnable.json'
import config_2 from './axes/barParallelYAxis.json'
import config_3 from './axes/barParallelYAxisEnable.json'
import config_4 from './barWidth/styleBarWidth.json'
import config_5 from './chartType/minimal.json'
import config_6 from './chartType/simple.json'
import config_7 from './chartType/standard.json'
import config_8 from './color/dimension.json'
import config_9 from './color/measure.json'
import config_10 from './combination/basic.json'
import config_11 from './combination/basicV2.json'
import config_12 from './dataset/1m1d.json'
import config_13 from './dataset/onlyMeasures.json'
import config_14 from './markStyle/barStyleArray.json'
import config_15 from './markStyle/barStyleMeasureCondition.json'
import config_16 from './markStyle/multiBarStyle.json'
import config_17 from './markStyle/selectorBarMeasureCondition.json'
import config_18 from './pivotGrid/pivotBasic.json'
import config_19 from './pivotGrid/pivotBasicV2.json'

const cases = [
  { name: 'axes/barParallelXAxis', vseed: config_0 },
  { name: 'axes/barParallelXAxisEnable', vseed: config_1 },
  { name: 'axes/barParallelYAxis', vseed: config_2 },
  { name: 'axes/barParallelYAxisEnable', vseed: config_3 },
  { name: 'barWidth/styleBarWidth', vseed: config_4 },
  { name: 'chartType/minimal', vseed: config_5 },
  { name: 'chartType/simple', vseed: config_6 },
  { name: 'chartType/standard', vseed: config_7 },
  { name: 'color/dimension', vseed: config_8 },
  { name: 'color/measure', vseed: config_9 },
  { name: 'combination/basic', vseed: config_10 },
  { name: 'combination/basicV2', vseed: config_11 },
  { name: 'dataset/1m1d', vseed: config_12 },
  { name: 'dataset/onlyMeasures', vseed: config_13 },
  { name: 'markStyle/barStyleArray', vseed: config_14 },
  { name: 'markStyle/barStyleMeasureCondition', vseed: config_15 },
  { name: 'markStyle/multiBarStyle', vseed: config_16 },
  { name: 'markStyle/selectorBarMeasureCondition', vseed: config_17 },
  { name: 'pivotGrid/pivotBasic', vseed: config_18 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_19 }
]

describe('barParallel', () => {
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
