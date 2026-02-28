import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './cellStyle/bodyCellStylePivotBasic.json'
import config_1 from './cellStyle/bodyCellStylePivotByValue.json'
import config_2 from './cellStyle/bodyCellStylePivotMulti.json'
import config_3 from './cellStyle/pivotTableBodyCellStyleBasic.json'
import config_4 from './cellStyle/pivotTableBodyCellStyleByValue.json'
import config_5 from './cellStyle/pivotTableBodyCellStyleMulti.json'
import config_6 from './chartType/1MeasureName.json'
import config_7 from './chartType/measureIdToColumn.json'
import config_8 from './chartType/simple.json'
import config_9 from './chartType/standard.json'
import config_10 from './combination/basic.json'
import config_11 from './dataset/onlyDimensions.json'
import config_12 from './dataset/onlyMeasures.json'
import config_13 from './pivotGrid/pivotBasic.json'
import config_14 from './pivotGrid/pivotBasicV2.json'
import config_15 from './pivotGrid/pivotBasicV3.json'
import config_16 from './pivotGrid/pivotBasicV4.json'

const cases = [
  { name: 'cellStyle/bodyCellStylePivotBasic', vseed: config_0 },
  { name: 'cellStyle/bodyCellStylePivotByValue', vseed: config_1 },
  { name: 'cellStyle/bodyCellStylePivotMulti', vseed: config_2 },
  { name: 'cellStyle/pivotTableBodyCellStyleBasic', vseed: config_3 },
  { name: 'cellStyle/pivotTableBodyCellStyleByValue', vseed: config_4 },
  { name: 'cellStyle/pivotTableBodyCellStyleMulti', vseed: config_5 },
  { name: 'chartType/1MeasureName', vseed: config_6 },
  { name: 'chartType/measureIdToColumn', vseed: config_7 },
  { name: 'chartType/simple', vseed: config_8 },
  { name: 'chartType/standard', vseed: config_9 },
  { name: 'combination/basic', vseed: config_10 },
  { name: 'dataset/onlyDimensions', vseed: config_11 },
  { name: 'dataset/onlyMeasures', vseed: config_12 },
  { name: 'pivotGrid/pivotBasic', vseed: config_13 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_14 },
  { name: 'pivotGrid/pivotBasicV3', vseed: config_15 },
  { name: 'pivotGrid/pivotBasicV4', vseed: config_16 }
]

describe('pivotTable', () => {
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
