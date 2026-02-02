import { kdeRegressionLine } from 'src/pipeline/spec/chart/pipes/regressionLine/kdeRegressionLine'
import type { SpecPipelineContext, AdvancedVSeed } from 'src/types'
import { vi } from 'vitest'

// Mock @visactor/vutils kde function
vi.mock('@visactor/vutils', async () => {
  const actual = await vi.importActual('@visactor/vutils')
  return {
    ...actual,
    kde: vi.fn().mockReturnValue({
      evaluateGrid: vi.fn().mockReturnValue([
        { x: 10, y: 0.1 },
        { x: 20, y: 0.2 },
      ]),
      bandwidth: 1,
    }),
  }
})

describe('kdeRegressionLine pipe', () => {
  const mockContext = {
    advancedVSeed: {
      chartType: 'histogram',
      config: {
        histogram: {
          regressionLine: {
            kdeRegressionLine: {
              color: 'blue',
              lineWidth: 2,
            }
          },
          binValueType: 'count'
        }
      },
      regressionLine: {
        kdeRegressionLine: { enable: true }
      },
      dimensions: [],
      encoding: { value: ['x'] }
    } as unknown as AdvancedVSeed,
    vseed: {
      dataset: [{ x: 10 }, { x: 20 }, { x: 30 }]
    }
  } as unknown as SpecPipelineContext

  it('should return original spec if regressionLine config is missing', () => {
    const spec = {}
    const context = {
      advancedVSeed: {
        chartType: 'histogram',
        config: {},
      } as unknown as AdvancedVSeed,
      vseed: {}
    } as SpecPipelineContext
    
    expect(kdeRegressionLine(spec, context)).toEqual(spec)
  })

  it('should generate kde regression line marks', () => {
    const spec = {
      data: { id: 'data1' }
    }
    
    const result = kdeRegressionLine(spec as any, mockContext) as any
    expect(result.extensionMark).toBeDefined()
    expect(result.extensionMark).toHaveLength(1)
    expect(result.extensionMark![0].type).toBe('group')
    expect(result.extensionMark![0].name).toContain('kdeRegressionLine')
  })

  it('should handle percentage binValueType', () => {
    const spec = {
      data: { id: 'data1' }
    }
    const context = {
        ...mockContext,
        advancedVSeed: {
            ...mockContext.advancedVSeed,
            config: {
                histogram: {
                    ...mockContext.advancedVSeed.config.histogram,
                    binValueType: 'percentage'
                }
            }
        }
    }
    
    const result = kdeRegressionLine(spec as any, context) as any
    expect(result.extensionMark).toBeDefined()
  })

  it('should generate children marks correctly', () => {
    const spec = {
        data: { id: 'data1' }
    }
    const context = {
        ...mockContext,
        advancedVSeed: {
            ...mockContext.advancedVSeed,
            regressionLine: {
                kdeRegressionLine: { 
                    enable: true,
                    text: 'KDE Label'
                }
            }
        }
    }

    const result = kdeRegressionLine(spec as any, context) as any
    const groupMark = result.extensionMark[0]
    expect(groupMark.children).toHaveLength(2) // line + text
    expect(groupMark.children[1].type).toBe('text')
    expect(groupMark.children[1].style.text).toBe('KDE Label')
  })

  it('should handle array config', () => {
    const spec = {
      data: { id: 'data1' }
    }
    const context = {
      ...mockContext,
      advancedVSeed: {
        ...mockContext.advancedVSeed,
        regressionLine: {
          kdeRegressionLine: [{ enable: true }, { enable: false }]
        }
      }
    } as unknown as SpecPipelineContext

    const result = kdeRegressionLine(spec as any, context) as any
    expect(result.extensionMark).toHaveLength(1)
  })

  it('should handle data callback', () => {
    const spec = {
        data: { id: 'data1' }
    }
    const result = kdeRegressionLine(spec as any, mockContext) as any
    const groupMark = result.extensionMark[0]
    
    // Mock vchart context for data callback
    const mockScaleY = {
        scale: vi.fn().mockImplementation(v => v * 100),
        range: vi.fn().mockReturnValue([0, 100])
    }
    const mockSeries = {
        type: 'bar',
        fieldX: ['x'],
        getYAxisHelper: () => ({ getScale: () => mockScaleY }),
        getViewData: () => ({ latestData: [{ x: 10, 'bin_end': 15, 'bin_start': 5 }] }),
        dataToPositionX: vi.fn().mockReturnValue(50),
        getOption: () => ({ globalScale: { getScale: () => ({ scale: () => 'red' }) } }),
        getSeriesKeys: () => ['group1']
    }
    const mockCtx = {
        vchart: {
            getChart: () => ({
                getAllSeries: () => [mockSeries]
            })
        }
    }

    const dataCallback = groupMark.style.data
    const dataResult = dataCallback({}, mockCtx)
    
    expect(dataResult).not.toBeNull()
    expect(dataResult.linePoints).toHaveLength(2)
    expect(dataResult.color).toBe('red')
  })
})
