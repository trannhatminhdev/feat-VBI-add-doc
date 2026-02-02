import { page } from 'src/pipeline/advanced/chart/pipes/page/page'
import type { AdvancedVSeed, VSeed } from 'src/types'

describe('page pipe', () => {
  it('should return original advancedVSeed if page config is missing', () => {
    const vseed = { dataset: [] } as unknown as VSeed
    const advancedVSeed = {} as AdvancedVSeed
    const context = { vseed } as any
    expect(page(advancedVSeed, context)).toBe(advancedVSeed)
  })

  it('should filter dataset based on page config', () => {
    const vseed = {
      dataset: [
        { date: '2023-01-01', value: 10 },
        { date: '2023-01-02', value: 20 },
      ],
      page: {
        field: 'date',
        currentValue: '2023-01-01',
      },
    } as unknown as VSeed
    const advancedVSeed = {} as AdvancedVSeed
    const context = { vseed } as any

    page(advancedVSeed, context)

    expect(context.vseed.dataset).toHaveLength(1)
    expect(context.vseed.dataset[0].value).toBe(10)
  })
})
