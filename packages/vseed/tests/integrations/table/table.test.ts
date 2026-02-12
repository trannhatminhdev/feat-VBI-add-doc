import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './cellStyle/bodyCellStyleTableBasic.json'
import config_1 from './cellStyle/bodyCellStyleTableByValue.json'
import config_2 from './cellStyle/bodyCellStyleTableGlobal.json'
import config_3 from './cellStyle/bodyCellStyleTableMulti.json'
import config_4 from './cellStyle/tableBodyCellStyle.json'
import config_5 from './cellStyle/tableBodyCellStyleByValue.json'
import config_6 from './cellStyle/tableBodyCellStyleGlobal.json'
import config_7 from './cellStyle/tableBodyCellStyleMulti.json'
import config_8 from './chartType/auto.json'
import config_9 from './chartType/basic.json'
import config_10 from './chartType/group.json'
import config_11 from './chartType/simple.json'
import config_12 from './chartType/standard.json'
import config_13 from './combination/basic.json'
import config_14 from './dataset/onlyMeasures.json'
import config_15 from './dimensions/tree.json'
import config_16 from './pivotGrid/pivotBasic.json'

const cases = [
  { name: 'cellStyle/bodyCellStyleTableBasic', vseed: config_0 },
  { name: 'cellStyle/bodyCellStyleTableByValue', vseed: config_1 },
  { name: 'cellStyle/bodyCellStyleTableGlobal', vseed: config_2 },
  { name: 'cellStyle/bodyCellStyleTableMulti', vseed: config_3 },
  { name: 'cellStyle/tableBodyCellStyle', vseed: config_4 },
  { name: 'cellStyle/tableBodyCellStyleByValue', vseed: config_5 },
  { name: 'cellStyle/tableBodyCellStyleGlobal', vseed: config_6 },
  { name: 'cellStyle/tableBodyCellStyleMulti', vseed: config_7 },
  { name: 'chartType/auto', vseed: config_8 },
  { name: 'chartType/basic', vseed: config_9 },
  { name: 'chartType/group', vseed: config_10 },
  { name: 'chartType/simple', vseed: config_11 },
  { name: 'chartType/standard', vseed: config_12 },
  { name: 'combination/basic', vseed: config_13 },
  { name: 'dataset/onlyMeasures', vseed: config_14 },
  { name: 'dimensions/tree', vseed: config_15 },
  { name: 'pivotGrid/pivotBasic', vseed: config_16 }
]

describe('table', () => {
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
