import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './chartType/combinationRadar.json'
import config_1 from './chartType/minimal.json'
import config_2 from './chartType/pivotRadar.json'
import config_3 from './chartType/simple.json'
import config_4 from './chartType/standard.json'
import config_5 from './color/dimension.json'
import config_6 from './color/measure.json'
import config_7 from './color/radarMultiMeasure.json'
import config_8 from './combination/basic.json'
import config_9 from './combination/basicV2.json'
import config_10 from './dataset/onlyMeasures.json'
import config_11 from './pivotGrid/pivotBasic.json'
import config_12 from './pivotGrid/pivotBasicV2.json'

const cases = [
  { name: 'chartType/combinationRadar', vseed: config_0 },
  { name: 'chartType/minimal', vseed: config_1 },
  { name: 'chartType/pivotRadar', vseed: config_2 },
  { name: 'chartType/simple', vseed: config_3 },
  { name: 'chartType/standard', vseed: config_4 },
  { name: 'color/dimension', vseed: config_5 },
  { name: 'color/measure', vseed: config_6 },
  { name: 'color/radarMultiMeasure', vseed: config_7 },
  { name: 'combination/basic', vseed: config_8 },
  { name: 'combination/basicV2', vseed: config_9 },
  { name: 'dataset/onlyMeasures', vseed: config_10 },
  { name: 'pivotGrid/pivotBasic', vseed: config_11 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_12 }
]

describe('radar', () => {
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
