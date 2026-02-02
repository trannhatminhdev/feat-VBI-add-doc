import { ecdfRegressionLine } from 'src/pipeline/spec/chart/pipes/regressionLine/ecdfRegressionLine'
import type { SpecPipelineContext, AdvancedVSeed } from 'src/types'
import { vi } from 'vitest'

// Mock @visactor/vutils ecdf function
vi.mock('@visactor/vutils', async () => {
  const actual = await vi.importActual('@visactor/vutils')
  return {
    ...actual,
    ecdf: vi.fn().mockReturnValue({
      evaluateGrid: vi.fn().mockReturnValue([
        { x: 10, y: 0.1 },
        { x: 20, y: 0.2 },
      ]),
    }),
  }
})

describe('ecdfRegressionLine pipe', () => {
  const mockContext = {
    advancedVSeed: {
      chartType: 'histogram',
      config: {
        histogram: {
          regressionLine: {
            ecdfRegressionLine: {
              color: 'blue',
              lineWidth: 2,
            }
          }
        }
      },
      regressionLine: {
        ecdfRegressionLine: { enable: true }
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
    
    expect(ecdfRegressionLine(spec, context)).toEqual(spec)
  })

  it('should generate ecdf regression line marks', () => {
    const spec = {
      data: { id: 'data1' },
      axes: [{ orient: 'left', domainLine: {}, tick: {}, title: {}, label: {} }]
    }
    
    const result = ecdfRegressionLine(spec as any, mockContext) as any
    expect(result.extensionMark).toBeDefined()
    expect(result.extensionMark).toHaveLength(1)
    expect(result.extensionMark![0].type).toBe('group')
    expect(result.extensionMark![0].name).toContain('ecdfRegressionLine')
    
    // Check if right axis is added
    expect(result.axes).toHaveLength(2)
    expect(result.axes[1].orient).toBe('right')
    expect(result.axes[1].type).toBe('linear')
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
                ecdfRegressionLine: { 
                    enable: true,
                    text: 'ECDF Label'
                }
            }
        }
    }

    const result = ecdfRegressionLine(spec as any, context) as any
    const groupMark = result.extensionMark[0]
    expect(groupMark.children).toHaveLength(2) // line + text
    expect(groupMark.children[1].type).toBe('text')
    expect(groupMark.children[1].style.text).toBe('ECDF Label')
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
          ecdfRegressionLine: [{ enable: true }, { enable: false }]
        }
      }
    } as unknown as SpecPipelineContext

    const result = ecdfRegressionLine(spec as any, context) as any
    expect(result.extensionMark).toHaveLength(1)
  })

  it('should handle data callback', () => {
    const spec = {
        data: { id: 'data1' }
    }
    const result = ecdfRegressionLine(spec as any, mockContext) as any
    const groupMark = result.extensionMark[0]
    
    // Mock vchart context for data callback
    const mockScaleY = {
        range: vi.fn().mockReturnValue([0, 100])
    }
    const mockSeries = {
        type: 'bar',
        fieldX: ['x'],
        getYAxisHelper: () => ({ getScale: () => mockScaleY }),
        getViewData: () => ({ latestData: [{ x: 10 }] }),
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
