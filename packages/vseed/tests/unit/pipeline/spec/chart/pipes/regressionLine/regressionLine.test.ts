import { generateRegressionLinePipe } from 'src/pipeline/spec/chart/pipes/regressionLine/linearRegressionLine'
import type { SpecPipelineContext, AdvancedVSeed } from 'src/types'
import { vi } from 'vitest'

describe('generateRegressionLinePipe', () => {
  const mockRegressionFunction = vi.fn().mockReturnValue({
    confidenceInterval: vi.fn().mockReturnValue([]),
    evaluateGrid: vi.fn().mockReturnValue([]),
  })

  const pipe = generateRegressionLinePipe(
    'linearRegressionLine',
    mockRegressionFunction
  )

  it('should return original spec if regressionLine config is missing', () => {
    const spec = {}
    const context = {
      advancedVSeed: {
        chartType: 'scatter',
        config: {},
      } as unknown as AdvancedVSeed,
    } as SpecPipelineContext
    
    expect(pipe(spec, context)).toEqual(spec)
  })

  it('should generate regression line marks', () => {
    const spec = {
      data: { id: 'data1' }
    }
    const context = {
      advancedVSeed: {
        chartType: 'scatter',
        config: { scatter: { regressionLine: {} } },
        regressionLine: {
          linearRegressionLine: { enable: true }
        }
      } as unknown as AdvancedVSeed,
    } as SpecPipelineContext

    const result = pipe(spec as any, context) as any
    expect(result.extensionMark).toBeDefined()
    expect(result.extensionMark).toHaveLength(1)
    expect(result.extensionMark![0].type).toBe('group')
  })
  
    it('should generate regression line marks with array config', () => {
    const spec = {
      data: { id: 'data1' }
    }
    const context = {
      advancedVSeed: {
        chartType: 'scatter',
        config: { scatter: { regressionLine: {} } },
        regressionLine: {
          linearRegressionLine: [{ enable: true }, { enable: false }]
        }
      } as unknown as AdvancedVSeed,
    } as SpecPipelineContext

    const result = pipe(spec as any, context) as any
    expect(result.extensionMark).toBeDefined()
    expect(result.extensionMark).toHaveLength(1) // only one enabled
  })
})
