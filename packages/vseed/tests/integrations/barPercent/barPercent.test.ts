import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './axes/barPercentXAxis.json'
import config_1 from './axes/barPercentXAxisEnable.json'
import config_2 from './axes/barPercentYAxis.json'
import config_3 from './axes/barPercentYAxisEnable.json'
import config_4 from './chartType/minimal.json'
import config_5 from './chartType/simple.json'
import config_6 from './chartType/standard.json'
import config_7 from './color/dimension.json'
import config_8 from './color/measure.json'
import config_9 from './combination/basic.json'
import config_10 from './combination/basicV2.json'
import config_11 from './dataset/onlyMeasures.json'
import config_12 from './pivotGrid/pivotBasic.json'
import config_13 from './pivotGrid/pivotBasicV2.json'

const cases = [
  { name: 'axes/barPercentXAxis', vseed: config_0 },
  { name: 'axes/barPercentXAxisEnable', vseed: config_1 },
  { name: 'axes/barPercentYAxis', vseed: config_2 },
  { name: 'axes/barPercentYAxisEnable', vseed: config_3 },
  { name: 'chartType/minimal', vseed: config_4 },
  { name: 'chartType/simple', vseed: config_5 },
  { name: 'chartType/standard', vseed: config_6 },
  { name: 'color/dimension', vseed: config_7 },
  { name: 'color/measure', vseed: config_8 },
  { name: 'combination/basic', vseed: config_9 },
  { name: 'combination/basicV2', vseed: config_10 },
  { name: 'dataset/onlyMeasures', vseed: config_11 },
  { name: 'pivotGrid/pivotBasic', vseed: config_12 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_13 }
]

describe('barPercent', () => {
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
