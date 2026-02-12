import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './chartType/aggression-label.json'
import config_1 from './chartType/aggression.json'
import config_2 from './chartType/boxPlotWithStyle.json'
import config_3 from './chartType/detail-label.json'
import config_4 from './chartType/maxWidth.json'
import config_5 from './chartType/measureGroups.json'
import config_6 from './chartType/multi-measures.json'
import config_7 from './chartType/onlyMeasure.json'
import config_8 from './chartType/onlyMeasureGroup.json'
import config_9 from './chartType/pivotBoxplot.json'
import config_10 from './chartType/simple.json'
import config_11 from './legend/legend.json'
import config_12 from './pivotGrid/pivotBasic.json'
import config_13 from './pivotGrid/pivotBasicV2.json'
import config_14 from './tooltip/basic.json'

const cases = [
  { name: 'chartType/aggression-label', vseed: config_0 },
  { name: 'chartType/aggression', vseed: config_1 },
  { name: 'chartType/boxPlotWithStyle', vseed: config_2 },
  { name: 'chartType/detail-label', vseed: config_3 },
  { name: 'chartType/maxWidth', vseed: config_4 },
  { name: 'chartType/measureGroups', vseed: config_5 },
  { name: 'chartType/multi-measures', vseed: config_6 },
  { name: 'chartType/onlyMeasure', vseed: config_7 },
  { name: 'chartType/onlyMeasureGroup', vseed: config_8 },
  { name: 'chartType/pivotBoxplot', vseed: config_9 },
  { name: 'chartType/simple', vseed: config_10 },
  { name: 'legend/legend', vseed: config_11 },
  { name: 'pivotGrid/pivotBasic', vseed: config_12 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_13 },
  { name: 'tooltip/basic', vseed: config_14 }
]

describe('boxplot', () => {
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
