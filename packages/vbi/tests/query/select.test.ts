import { VBI } from '@visactor/vbi'
import { registerDemoConnector, getDemoConnectorId } from '../demoConnector'

describe('select', () => {
  test('select', async () => {
    // Register the demo connector
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.createChart(VBI.generateEmptyChartDSL(connectorId))

    builder.measures
      .add('sales', (node) => {
        node.setAlias('Sum(sales)').setAggregate({ func: 'sum' })
      })
      .add('profit', (node) => {
        node.setAlias('Sum(profit)').setAggregate({ func: 'sum' })
      })

    builder.dimensions
      .add('area', (node) => {
        node.setAlias('区域')
      })
      .add('province', (node) => {
        node.setAlias('省份')
      })
    builder.limit.setLimit(20)

    const vseed = await builder.buildVSeed()
    const areas = vseed.dataset.map((row) => row['id-3'] as string)
    const areaGroups = areas.filter((area, index) => index === 0 || area !== areas[index - 1])

    expect(vseed).toMatchObject({
      chartType: 'table',
      dimensions: [
        { alias: '区域', id: 'id-3', encoding: 'column' },
        { alias: '省份', id: 'id-4', encoding: 'column' },
      ],
      locale: 'zh-CN',
      measures: [
        { alias: 'Sum(sales)', id: 'id-1', encoding: 'column' },
        { alias: 'Sum(profit)', id: 'id-2', encoding: 'column' },
      ],
      theme: 'light',
    })
    expect(vseed.dataset).toHaveLength(20)
    expect(areaGroups).toHaveLength(new Set(areas).size)
  })

  test('date dimension select uses derived alias in groupBy', async () => {
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.createChart(VBI.generateEmptyChartDSL(connectorId))

    builder.measures.add('sales', (node) => {
      node.setAlias('销售额').setAggregate({ func: 'sum' })
    })

    builder.dimensions.add('order_date', (node) => {
      node.setAlias('年份').setAggregate({ func: 'toYear' })
    })

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toEqual({
      groupBy: ['id-2'],
      limit: 1000,
      orderBy: [{ field: 'id-2', order: 'asc' }],
      select: [
        {
          field: 'sales',
          alias: 'id-1',
          aggr: { func: 'sum' },
        },
        {
          field: 'order_date',
          alias: 'id-2',
          aggr: { func: 'to_year' },
        },
      ],
    })

    const vseed = await builder.buildVSeed()
    expect(vseed).toMatchObject({
      dimensions: [{ alias: '年份', id: 'id-2', encoding: 'column' }],
      measures: [{ alias: '销售额', id: 'id-1', encoding: 'column' }],
    })
    const years = vseed.dataset.map((row) => row['id-2']).sort()
    expect(years).toEqual(['2016', '2017', '2018', '2019'])
  })

  test('duplicate fields use ids in query and vseed metadata', async () => {
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.createChart(VBI.generateEmptyChartDSL(connectorId))

    builder.measures
      .add('sales', (node) => {
        node.setAlias('销售额').setAggregate({ func: 'sum' })
      })
      .add('sales', (node) => {
        node.setAlias('最高销售额').setAggregate({ func: 'max' })
      })

    builder.dimensions
      .add('area', (node) => {
        node.setAlias('区域')
      })
      .add('area', (node) => {
        node.setAlias('区域副本')
      })

    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toEqual({
      groupBy: ['area', 'area'],
      limit: 1000,
      orderBy: [{ field: 'id-3', order: 'asc' }],
      select: [
        {
          field: 'sales',
          alias: 'id-1',
          aggr: { func: 'sum' },
        },
        {
          field: 'sales',
          alias: 'id-2',
          aggr: { func: 'max' },
        },
        {
          field: 'area',
          alias: 'id-3',
        },
        {
          field: 'area',
          alias: 'id-4',
        },
      ],
    })

    const vseed = await builder.buildVSeed()
    expect(vseed.measures).toEqual([
      { alias: '销售额', id: 'id-1', encoding: 'column' },
      { alias: '最高销售额', id: 'id-2', encoding: 'column' },
    ])
    expect(vseed.dimensions).toEqual([
      { alias: '区域', id: 'id-3', encoding: 'column' },
      { alias: '区域副本', id: 'id-4', encoding: 'column' },
    ])
    expect(Object.keys(vseed.dataset[0]).sort()).toEqual(['id-1', 'id-2', 'id-3', 'id-4'])
    expect(vseed.dataset[0]['id-3']).toBe(vseed.dataset[0]['id-4'])
    expect(vseed.dataset[0]['id-1']).not.toBe(vseed.dataset[0]['id-2'])
  })
})
