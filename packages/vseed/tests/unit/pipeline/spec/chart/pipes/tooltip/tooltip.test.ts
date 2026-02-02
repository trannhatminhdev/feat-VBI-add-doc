import { createDimensionContent, tooltip } from 'src/pipeline/spec/chart/pipes/tooltip/tooltip'
import type { FoldInfo, UnfoldInfo, Measures, AdvancedVSeed, VSeed } from 'src/types'

describe('tooltip pipe', () => {
  it('should generate tooltip config', () => {
    const spec = {}
    const context = {
      advancedVSeed: {
        chartType: 'line',
        config: { line: { tooltip: { enable: true } } },
        datasetReshapeInfo: [{
          foldInfo: {},
          unfoldInfo: {}
        }],
        encoding: {},
        dimensions: [],
        measures: [],
        reshapeMeasures: []
      } as unknown as AdvancedVSeed,
      vseed: { measures: [] } as unknown as VSeed
    } as any

    const result = tooltip(spec, context)
    expect(result.tooltip).toBeDefined()
    expect(result.tooltip!.visible).toBe(true)
  })
})

describe('createDimensionContent', () => {
  const foldInfo = {
    measureId: 'mid',
    measureValue: 'mval',
    foldMap: { 'm1': 'Measure 1' }
  } as unknown as FoldInfo

  const unfoldInfo = {
    encodingColor: 'colorId',
    colorIdMap: {
      'c1': { alias: 'Color 1' }
    }
  } as unknown as UnfoldInfo

  const measures: Measures = [
    { id: 'm1', field: 'f1' } as any
  ]

  it('should handle non-measure tooltip', () => {
    const tooltips = [] as string[]
    const colors = ['c1']
    const result = createDimensionContent(tooltips, colors, measures, foldInfo, unfoldInfo, false)
    
    expect(result).toHaveLength(1)
    const keyFn = result[0].key as (v: unknown) => string
    
    expect(keyFn({ colorId: 'c1' })).toBe('Color 1')
  })

  it('should handle measure tooltip', () => {
    const tooltips = ['m1']
    const colors = [] as string[]
    const result = createDimensionContent(tooltips, colors, measures, foldInfo, unfoldInfo, false)

    expect(result).toHaveLength(1)
    const keyFn = result[0].key as (v: unknown) => string
    
    expect(keyFn({ mid: 'm1' })).toBe('Measure 1')
  })
  
  it('should handle multi measure group', () => {
      const tooltips = [] as string[]
      const colors = ['c1']
      const result = createDimensionContent(tooltips, colors, measures, foldInfo, unfoldInfo, true)
      
      const keyFn = result[0].key as (v: unknown) => string
      // hasMeasureIdInColor is false (c1 is not in measures)
      // should return colorAlias-meaAlias
      expect(keyFn({ colorId: 'c1', '__MeaName__': 'MName' })).toBe('Color 1-MName')
  })
})
