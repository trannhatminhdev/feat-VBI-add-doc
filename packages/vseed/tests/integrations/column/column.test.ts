import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
import config_0 from './analysis/sortLegendBySelf.json'
import config_1 from './annotation/annotationAreaColumn.json'
import config_2 from './annotation/annotationPointValue.json'
import config_3 from './annotationPoint/stack-columns.json'
import config_4 from './annotationPoint/value.json'
import config_5 from './axes/columnXAxis.json'
import config_6 from './axes/columnXAxisEnable.json'
import config_7 from './axes/columnYAxis.json'
import config_8 from './axes/columnYAxisEnable.json'
import config_9 from './backgroundColor/backgroundColor.json'
import config_10 from './chartType/minimal.json'
import config_11 from './chartType/simple.json'
import config_12 from './chartType/standard.json'
import config_13 from './color/columnParallelMultiMeasure.json'
import config_14 from './color/dimension.json'
import config_15 from './color/measure.json'
import config_16 from './combination/basic.json'
import config_17 from './combination/basicV2.json'
import config_18 from './dataset/onlyMeasures.json'
import config_19 from './feedback/sameAlias.json'
import config_20 from './format/autoFormat.json'
import config_21 from './format/fractionDigits.json'
import config_22 from './format/ratioAndSymbol.json'
import config_23 from './format/roundingMode.json'
import config_24 from './format/roundingPriority.json'
import config_25 from './format/significantDigits.json'
import config_26 from './format/suffixAndPrefix.json'
import config_27 from './format/thousandSeparator.json'
import config_28 from './format/type.json'
import config_29 from './interaction/interactionBrushEnable.json'
import config_30 from './interaction/interactionBrushKeepSelection.json'
import config_31 from './label/basic.json'
import config_32 from './label/enable.json'
import config_33 from './label/wrap.json'
import config_34 from './markStyle/barStyleValue.json'
import config_35 from './markStyle/selectorBarValue.json'
import config_36 from './measures/measureGroups.json'
import config_37 from './pivotGrid/pivotBasic.json'
import config_38 from './pivotGrid/pivotBasicV2.json'
import config_39 from './regressionLine/columnPolynomial.json'
import config_40 from './regressionLine/columnPolynomial_sync.json'
import config_41 from './regressionLine/columnPolynomial_with_shadow.json'
import config_42 from './regressionLine/minPoints_column_polynomialRegressionLine.json'
import config_43 from './sort/sortLegendBySelf.json'
import config_44 from './stackCornerRadius/stack-column.json'
import config_45 from './theme/dark.json'
import config_46 from './theme/light.json'
import config_47 from './tooltip/column.json'
import config_48 from './tooltip/enable.json'
import config_49 from './tooltip/same.json'

const cases = [
  { name: 'analysis/sortLegendBySelf', vseed: config_0 },
  { name: 'annotation/annotationAreaColumn', vseed: config_1 },
  { name: 'annotation/annotationPointValue', vseed: config_2 },
  { name: 'annotationPoint/stack-columns', vseed: config_3 },
  { name: 'annotationPoint/value', vseed: config_4 },
  { name: 'axes/columnXAxis', vseed: config_5 },
  { name: 'axes/columnXAxisEnable', vseed: config_6 },
  { name: 'axes/columnYAxis', vseed: config_7 },
  { name: 'axes/columnYAxisEnable', vseed: config_8 },
  { name: 'backgroundColor/backgroundColor', vseed: config_9 },
  { name: 'chartType/minimal', vseed: config_10 },
  { name: 'chartType/simple', vseed: config_11 },
  { name: 'chartType/standard', vseed: config_12 },
  { name: 'color/columnParallelMultiMeasure', vseed: config_13 },
  { name: 'color/dimension', vseed: config_14 },
  { name: 'color/measure', vseed: config_15 },
  { name: 'combination/basic', vseed: config_16 },
  { name: 'combination/basicV2', vseed: config_17 },
  { name: 'dataset/onlyMeasures', vseed: config_18 },
  { name: 'feedback/sameAlias', vseed: config_19 },
  { name: 'format/autoFormat', vseed: config_20 },
  { name: 'format/fractionDigits', vseed: config_21 },
  { name: 'format/ratioAndSymbol', vseed: config_22 },
  { name: 'format/roundingMode', vseed: config_23 },
  { name: 'format/roundingPriority', vseed: config_24 },
  { name: 'format/significantDigits', vseed: config_25 },
  { name: 'format/suffixAndPrefix', vseed: config_26 },
  { name: 'format/thousandSeparator', vseed: config_27 },
  { name: 'format/type', vseed: config_28 },
  { name: 'interaction/interactionBrushEnable', vseed: config_29 },
  { name: 'interaction/interactionBrushKeepSelection', vseed: config_30 },
  { name: 'label/basic', vseed: config_31 },
  { name: 'label/enable', vseed: config_32 },
  { name: 'label/wrap', vseed: config_33 },
  { name: 'markStyle/barStyleValue', vseed: config_34 },
  { name: 'markStyle/selectorBarValue', vseed: config_35 },
  { name: 'measures/measureGroups', vseed: config_36 },
  { name: 'pivotGrid/pivotBasic', vseed: config_37 },
  { name: 'pivotGrid/pivotBasicV2', vseed: config_38 },
  { name: 'regressionLine/columnPolynomial', vseed: config_39 },
  { name: 'regressionLine/columnPolynomial_sync', vseed: config_40 },
  { name: 'regressionLine/columnPolynomial_with_shadow', vseed: config_41 },
  { name: 'regressionLine/minPoints_column_polynomialRegressionLine', vseed: config_42 },
  { name: 'sort/sortLegendBySelf', vseed: config_43 },
  { name: 'stackCornerRadius/stack-column', vseed: config_44 },
  { name: 'theme/dark', vseed: config_45 },
  { name: 'theme/light', vseed: config_46 },
  { name: 'tooltip/column', vseed: config_47 },
  { name: 'tooltip/enable', vseed: config_48 },
  { name: 'tooltip/same', vseed: config_49 }
]

describe('column', () => {
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
