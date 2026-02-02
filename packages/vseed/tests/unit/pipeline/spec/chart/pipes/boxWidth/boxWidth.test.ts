import { boxMaxWidth } from 'src/pipeline/spec/chart/pipes/boxWidth/boxMaxWidth'
import { boxGapInGroup } from 'src/pipeline/spec/chart/pipes/boxWidth/boxGapInGroup'
import type { SpecPipelineContext, AdvancedVSeed, VSeed } from 'src/types'

describe('boxWidth pipes', () => {
  describe('boxMaxWidth', () => {
    it('should set boxMaxWidth if configured', () => {
      const spec = {}
      const context = {
        advancedVSeed: {
          config: {
            boxPlot: { boxMaxWidth: 20 }
          }
        } as unknown as AdvancedVSeed,
        vseed: {
          chartType: 'boxPlot'
        } as unknown as VSeed
      } as SpecPipelineContext

      const result = boxMaxWidth(spec, context) as any
      expect(result.boxMaxWidth).toBe(20)
    })

    it('should return original spec if not configured', () => {
      const spec = {}
      const context = {
        advancedVSeed: {
          config: {}
        } as unknown as AdvancedVSeed,
        vseed: {
          chartType: 'boxPlot'
        } as unknown as VSeed
      } as SpecPipelineContext

      const result = boxMaxWidth(spec, context) as any
      expect(result.boxMaxWidth).toBeUndefined()
    })
  })

  describe('boxGapInGroup', () => {
      it('should set boxGapInGroup if configured', () => {
        const spec = {}
        const context = {
          advancedVSeed: {
            config: {
              boxPlot: { boxGapInGroup: 5 }
            }
          } as unknown as AdvancedVSeed,
          vseed: {
            chartType: 'boxPlot'
          } as unknown as VSeed
        } as SpecPipelineContext
  
        const result = boxGapInGroup(spec, context) as any
        expect(result.boxGapInGroup).toBe(5)
      })
  })
})
