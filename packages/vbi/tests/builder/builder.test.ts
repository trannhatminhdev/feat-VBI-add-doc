import { createVBI, VBI } from '@visactor/vbi'
import { VBIChartDSL } from 'src/types/dsl'
import { getConnector, registerConnector } from 'src/builder/connector'

describe('VBI', () => {
  test('build', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.measures.add('sales', (node) => {
      node.setAlias('Max Sales').setAggregate({ func: 'max' }).setEncoding('yAxis')
    })
    builder.dimensions.add('area', (node) => {
      node.setAlias('Area')
    })

    expect(builder.build()).toEqual({
      dimensions: [
        {
          id: 'id-2',
          alias: 'Area',
          field: 'area',
          encoding: 'column',
        },
      ],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [
        {
          id: 'id-1',
          aggregate: {
            func: 'max',
          },
          alias: 'Max Sales',
          encoding: 'yAxis',
          field: 'sales',
        },
      ],
    })
  })

  test('isEmpty', () => {
    const builder = VBI.createChart({} as VBIChartDSL)
    expect(builder.isEmpty()).toBe(true)

    builder.dimensions.add('area', () => {})
    expect(builder.isEmpty()).toBe(false)

    const dimensionId = builder.dimensions.find((node) => node.getField() === 'area')?.getId()
    if (dimensionId) {
      builder.dimensions.remove(dimensionId)
    }
    expect(builder.isEmpty()).toBe(true)

    builder.measures.add('sales', () => {})
    expect(builder.isEmpty()).toBe(false)
  })

  test('supports custom DSL adapters', async () => {
    type CustomQueryDSL = {
      source: 'factory' | 'instance'
      count: number
    }

    type CustomSeedDSL = {
      type: 'custom-seed'
      chartType: string
      queryDSL: CustomQueryDSL
    }

    const CustomVBI = createVBI<CustomQueryDSL, CustomSeedDSL>({
      adapters: {
        buildVQuery: ({ vbiDSL }) => ({
          source: 'factory',
          count: vbiDSL.measures.length,
        }),
        buildVSeed: async ({ queryDSL, vbiDSL }) => ({
          type: 'custom-seed',
          chartType: vbiDSL.chartType as string,
          queryDSL,
        }),
      },
    })

    const builder = CustomVBI.createChart(VBI.generateEmptyChartDSL('custom'), {
      adapters: {
        buildVQuery: ({ vbiDSL }) => ({
          source: 'instance',
          count: vbiDSL.dimensions.length,
        }),
      },
    })

    expect(builder.buildVQuery()).toEqual({
      source: 'instance',
      count: 0,
    })

    expect(await builder.buildVSeed()).toEqual({
      type: 'custom-seed',
      chartType: 'table',
      queryDSL: {
        source: 'instance',
        count: 0,
      },
    })
  })

  test('getConnector throws for unregistered connector', async () => {
    const unregisteredId = 'unregistered-connector-id'

    await expect(getConnector(unregisteredId)).rejects.toThrow(`connector ${unregisteredId} not registered`)
  })

  test('getConnector handles async factory function', async () => {
    const testConnectorId = 'test-async-connector'
    registerConnector(testConnectorId, async () => ({
      discoverSchema: async () => [{ name: 'test', type: 'string' }],
      query: async () => ({ dataset: [] }),
    }))

    const connector = await getConnector(testConnectorId)
    const schema = await connector.discoverSchema()
    expect(schema).toEqual([{ name: 'test', type: 'string' }])
  })

  test('createVBI uses defaultBuilderOptions when createChart is called without overrides', async () => {
    type CustomQueryDSL = {
      source: 'factory' | 'instance'
      count: number
    }

    type CustomSeedDSL = {
      type: 'custom-seed'
      chartType: string
      queryDSL: CustomQueryDSL
    }

    const CustomVBI = createVBI<CustomQueryDSL, CustomSeedDSL>({
      adapters: {
        buildVQuery: ({ vbiDSL }) => ({
          source: 'factory',
          count: vbiDSL.measures.length,
        }),
        buildVSeed: async ({ queryDSL, vbiDSL }) => ({
          type: 'custom-seed',
          chartType: vbiDSL.chartType as string,
          queryDSL,
        }),
      },
    })

    // Call createChart WITHOUT second parameter - should use defaultBuilderOptions
    const builder = CustomVBI.createChart(VBI.generateEmptyChartDSL('custom'))

    expect(builder.buildVQuery()).toEqual({
      source: 'factory',
      count: 0,
    })
  })
})
