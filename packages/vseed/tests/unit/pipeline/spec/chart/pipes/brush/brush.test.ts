import { brush } from 'src/pipeline/spec/chart/pipes/brush/brush'
import type { SpecPipelineContext, AdvancedVSeed, VSeed } from 'src/types'

describe('brush pipe', () => {
  it('should return original spec if brush is disabled', () => {
    const spec = {}
    const context = {
      advancedVSeed: {
        config: {}
      } as unknown as AdvancedVSeed,
      vseed: {
        chartType: 'column',
        brush: { enable: false }
      } as unknown as VSeed
    } as SpecPipelineContext

    expect(brush(spec, context)).toEqual(spec)
  })

  it('should enable brush if configured in vseed', () => {
    const spec = {}
    const context = {
      advancedVSeed: {
        config: {}
      } as unknown as AdvancedVSeed,
      vseed: {
        chartType: 'column',
        brush: { enable: true, brushType: 'x' }
      } as unknown as VSeed
    } as SpecPipelineContext

    const result = brush(spec, context)
    expect(result.brush).toBeDefined()
    expect(result.brush?.visible).toBe(true)
    expect(result.brush?.brushType).toBe('x')
  })
})
