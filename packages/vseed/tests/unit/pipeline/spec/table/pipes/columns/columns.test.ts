import { dimensionTreeToColumns } from 'src/pipeline/spec/table/pipes/columns/dimensionsToColumns'
import { measureTreeToColumns } from 'src/pipeline/spec/table/pipes/columns/measuresToColumns'
import type { AdvancedVSeed, SpecPipelineContext } from 'src/types'

const createContext = (advancedVSeed: Partial<AdvancedVSeed>) => {
  return {
    vseed: {} as SpecPipelineContext['vseed'],
    advancedVSeed: advancedVSeed as AdvancedVSeed,
  } as SpecPipelineContext
}

describe('table column pipes', () => {
  it('builds dimension columns with left aligned group headers', () => {
    const result = dimensionTreeToColumns(
      {} as never,
      createContext({
        locale: 'en-US' as AdvancedVSeed['locale'],
        dimensionTree: [
          {
            id: 'region-group',
            children: [{ id: 'region', alias: 'Region' }],
          },
          { id: 'category' },
        ] as AdvancedVSeed['dimensionTree'],
      }),
    ) as { columns: any[] }

    expect(result.columns[0]).toMatchObject({
      field: 'region-group',
      title: 'region-group',
      headerStyle: {
        textAlign: 'left',
      },
    })
    expect(result.columns[0].columns[0]).toEqual(
      expect.objectContaining({
        field: 'region',
        title: 'Region',
        width: 'auto',
        style: {
          textAlign: 'left',
        },
        headerStyle: {
          textAlign: 'left',
        },
        fieldFormat: expect.any(Function),
      }),
    )
    expect(result.columns[1]).toEqual(
      expect.objectContaining({
        field: 'category',
        title: 'category',
        width: 'auto',
        style: {
          textAlign: 'left',
        },
        headerStyle: {
          textAlign: 'left',
        },
        fieldFormat: expect.any(Function),
      }),
    )
  })

  it('builds measure columns with right aligned group headers', () => {
    const result = measureTreeToColumns(
      {} as never,
      createContext({
        measureTree: [
          {
            id: 'profit-group',
            alias: 'Profit Group',
            children: [{ id: 'profit' }],
          },
        ] as AdvancedVSeed['measureTree'],
      }),
    ) as { columns: any[] }

    expect(result.columns[0]).toMatchObject({
      field: 'profit-group',
      title: 'Profit Group',
      headerStyle: {
        textAlign: 'right',
      },
    })
    expect(result.columns[0].columns[0]).toEqual(
      expect.objectContaining({
        field: 'profit',
        title: 'profit',
        width: 'auto',
        style: {
          textAlign: 'right',
        },
        headerStyle: {
          textAlign: 'right',
        },
        fieldFormat: expect.any(Function),
      }),
    )
  })
})
