import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './annotationPoint/scatter.json'
import config_1 from './chartType/combinationScatter.json'
import config_2 from './chartType/defaultMeasures.json'
import config_3 from './chartType/matrix.json'
import config_4 from './chartType/minimal.json'
import config_5 from './chartType/simple.json'
import config_6 from './chartType/standard.json'
import config_7 from './color/dimension.json'
import config_8 from './color/measure.json'
import config_9 from './color/scatterMultiMeasure.json'
import config_10 from './combination/basic.json'
import config_11 from './combination/basicV2.json'
import config_12 from './crosshair/crosshiarWIthFormat.json'
import config_13 from './dataset/onlyMeasures.json'
import config_14 from './measures/defaultParentIdForScatter.json'
import config_15 from './pivotGrid/pivotBasic.json'
import config_16 from './pivotGrid/pivotBasicV2.json'
import config_17 from './regressionLine/linear.json'
import config_18 from './regressionLine/logistic.json'
import config_19 from './regressionLine/lowess.json'
import config_20 from './regressionLine/pivotLogistic.json'
import config_21 from './regressionLine/pivotRegressionWithConfidenceInterval.json'
import config_22 from './regressionLine/polynomial.json'
import config_23 from './regressionLine/scatter-legend.json'
import config_24 from './regressionLine/scatterLinear.json'
import config_25 from './regressionLine/scatterLogistic.json'
import config_26 from './regressionLine/scatterLowess.json'
import config_27 from './regressionLine/scatterPolynomial.json'
import config_28 from './regressionLine/scatter_minPoints.json'
import config_29 from './size/scatterSize.json'
import config_30 from './size/scatterSizeRange.json'
import config_31 from './tooltip/scatter.json'

const cases = [
  { name: 'annotationPoint/scatter', vseed: config_0 },
  { name: 'chartType/combinationScatter', vseed: config_1 },
  { name: 'chartType/defaultMeasures', vseed: config_2 },
  { name: 'chartType/matrix', vseed: config_3 },
  { name: 'chartType/minimal', vseed: config_4 },
  { name: 'chartType/simple', vseed: config_5 },
  { name: 'chartType/standard', vseed: config_6 },
  { name: 'color/dimension', vseed: config_7 },
  { name: 'color/measure', vseed: config_8 },
  { name: 'color/scatterMultiMeasure', vseed: config_9 },
  { name: 'combination/basic', vseed: config_10 },
  { name: 'combination/basicV2', vseed: config_11 },
  { name: 'crosshair/crosshiarWIthFormat', vseed: config_12 },
  { name: 'dataset/onlyMeasures', vseed: config_13 },
  { name: 'measures/defaultParentIdForScatter', vseed: config_14 },
  { name: 'pivotGrid/pivotBasic', vseed: config_15 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_16 },
  { name: 'regressionLine/linear', vseed: config_17 },
  { name: 'regressionLine/logistic', vseed: config_18 },
  { name: 'regressionLine/lowess', vseed: config_19 },
  { name: 'regressionLine/pivotLogistic', vseed: config_20 },
  { name: 'regressionLine/pivotRegressionWithConfidenceInterval', vseed: config_21 },
  { name: 'regressionLine/polynomial', vseed: config_22 },
  { name: 'regressionLine/scatter-legend', vseed: config_23 },
  { name: 'regressionLine/scatterLinear', vseed: config_24 },
  { name: 'regressionLine/scatterLogistic', vseed: config_25 },
  { name: 'regressionLine/scatterLowess', vseed: config_26 },
  { name: 'regressionLine/scatterPolynomial', vseed: config_27 },
  { name: 'regressionLine/scatter_minPoints', vseed: config_28 },
  { name: 'size/scatterSize', vseed: config_29 },
  { name: 'size/scatterSizeRange', vseed: config_30 },
  { name: 'tooltip/scatter', vseed: config_31 }
]

describe('scatter', () => {
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
