import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './analysis/binCountHistogram.json'
import config_1 from './analysis/binHistogram.json'
import config_2 from './analysis/binStepHistogram.json'
import config_3 from './analysis/binValueTypeHistogram.json'
import config_4 from './annotation/point.json'
import config_5 from './annotationPoint/histogram-annotaion-points.json'
import config_6 from './chartType/KDEHistogramWithPercentageMode.json'
import config_7 from './chartType/binCountHistogram.json'
import config_8 from './chartType/binStepHistogram.json'
import config_9 from './chartType/binValueTypeHistogram.json'
import config_10 from './chartType/histogramOfBinData.json'
import config_11 from './chartType/pivotHistogram.json'
import config_12 from './chartType/simple.json'
import config_13 from './chartType/simpleHistogram.json'
import config_14 from './pivotGrid/pivotBasic.json'
import config_15 from './pivotGrid/pivotBasicV2.json'
import config_16 from './pivotGrid/pivotBasicV3.json'
import config_17 from './regressionLine/histogramEcdf.json'
import config_18 from './regressionLine/histogramEcdf_sync.json'
import config_19 from './regressionLine/histogramKde.json'
import config_20 from './regressionLine/histogramKdePercentage.json'
import config_21 from './regressionLine/regressionECDFHistogram.json'
import config_22 from './regressionLine/regressionHistogramWithKDE.json'
import config_23 from './regressionLine/regressionKDEHistogram.json'
import config_24 from './tooltip/basic.json'

const cases = [
  { name: 'analysis/binCountHistogram', vseed: config_0 },
  { name: 'analysis/binHistogram', vseed: config_1 },
  { name: 'analysis/binStepHistogram', vseed: config_2 },
  { name: 'analysis/binValueTypeHistogram', vseed: config_3 },
  { name: 'annotation/point', vseed: config_4 },
  { name: 'annotationPoint/histogram-annotaion-points', vseed: config_5 },
  { name: 'chartType/KDEHistogramWithPercentageMode', vseed: config_6 },
  { name: 'chartType/binCountHistogram', vseed: config_7 },
  { name: 'chartType/binStepHistogram', vseed: config_8 },
  { name: 'chartType/binValueTypeHistogram', vseed: config_9 },
  { name: 'chartType/histogramOfBinData', vseed: config_10 },
  { name: 'chartType/pivotHistogram', vseed: config_11 },
  { name: 'chartType/simple', vseed: config_12 },
  { name: 'chartType/simpleHistogram', vseed: config_13 },
  { name: 'pivotGrid/pivotBasic', vseed: config_14 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_15 },
  { name: 'pivotGrid/pivotBasicV3', vseed: config_16 },
  { name: 'regressionLine/histogramEcdf', vseed: config_17 },
  { name: 'regressionLine/histogramEcdf_sync', vseed: config_18 },
  { name: 'regressionLine/histogramKde', vseed: config_19 },
  { name: 'regressionLine/histogramKdePercentage', vseed: config_20 },
  { name: 'regressionLine/regressionECDFHistogram', vseed: config_21 },
  { name: 'regressionLine/regressionHistogramWithKDE', vseed: config_22 },
  { name: 'regressionLine/regressionKDEHistogram', vseed: config_23 },
  { name: 'tooltip/basic', vseed: config_24 }
]

describe('histogram', () => {
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
