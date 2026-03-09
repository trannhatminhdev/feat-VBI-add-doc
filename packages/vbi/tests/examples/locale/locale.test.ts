import { VBI } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('Locale', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('en-US-locale', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'province',
          alias: 'Province',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: 'Sales',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
      ],
      filters: [],
      theme: 'light',
      locale: 'en-US',
      version: 1,
      limit: 50,
    })

    // Apply custom builder code
    const applyBuilder = (builder) => {
      builder.setLocale('en-US')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot()

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot()

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot()
  })

  it('zh-CN-locale', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'bar',
      dimensions: [
        {
          field: 'province',
          alias: '省份',
        },
      ],
      measures: [
        {
          field: 'sales',
          alias: '销售额',
          encoding: 'yAxis',
          aggregate: {
            func: 'sum',
          },
        },
      ],
      filters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 50,
    })

    // Apply custom builder code
    const applyBuilder = (builder) => {
      builder.setLocale('zh-CN')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot()

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot()

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot()
  })
})
