import { pivotColumns } from 'src/pipeline/spec/table/pipes/columns/pivotColumns'
import type { AdvancedVSeed, SpecPipelineContext } from 'src/types'

const createContext = (advancedVSeed: Partial<AdvancedVSeed>) => {
  return {
    vseed: {} as SpecPipelineContext['vseed'],
    advancedVSeed: advancedVSeed as AdvancedVSeed,
  } as SpecPipelineContext
}

describe('pivotColumns', () => {
  it('builds pivot table columns with centered header alignment', () => {
    const result = pivotColumns(
      {} as never,
      createContext({
        locale: 'en-US' as AdvancedVSeed['locale'],
        encoding: {
          column: ['date'],
        } as AdvancedVSeed['encoding'],
        dimensionTree: [
          { id: 'date', alias: 'Date' },
          { id: 'region', alias: 'Region' },
        ] as AdvancedVSeed['dimensionTree'],
      }),
    ) as { columns: any[] }

    expect(result.columns).toEqual([
      expect.objectContaining({
        dimensionKey: 'date',
        title: 'Date',
        width: 'auto',
        headerStyle: {
          textAlign: 'center',
        },
        headerFormat: expect.any(Function),
      }),
    ])
  })
})
