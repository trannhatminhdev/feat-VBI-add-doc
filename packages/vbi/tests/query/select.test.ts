import { VBI } from '@visactor/vbi'
import { registerDemoConnector, getDemoConnectorId } from '../demoConnector'

describe('select', () => {
  test('select', async () => {
    // Register the demo connector
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.from(VBI.generateEmptyDSL(connectorId))

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

    expect(vseed).toEqual({
      chartType: 'table',
      dataset: [
        {
          'id-1': 452108.2440000001,
          'id-2': -131728.99600000013,
          'id-3': '华东',
          'id-4': '浙江',
        },
        {
          'id-1': 400877.5960000003,
          'id-2': -89487.52399999995,
          'id-3': '西南',
          'id-4': '四川',
        },
        {
          'id-1': 649967.2200000006,
          'id-2': -107603.02000000003,
          'id-3': '华东',
          'id-4': '江苏',
        },
        {
          'id-1': 1452929.5129999993,
          'id-2': 337994.9929999998,
          'id-3': '中南',
          'id-4': '广东',
        },
        {
          'id-1': 237328.70000000013,
          'id-2': 47807.06000000001,
          'id-3': '华东',
          'id-4': '江西',
        },
        {
          'id-1': 457688.16800000006,
          'id-2': 105814.68799999998,
          'id-3': '西北',
          'id-4': '陕西',
        },
        {
          'id-1': 1178801.1620000016,
          'id-2': 257172.06199999977,
          'id-3': '东北',
          'id-4': '黑龙江',
        },
        {
          'id-1': 1586782.9879999978,
          'id-2': 385463.008,
          'id-3': '华东',
          'id-4': '山东',
        },
        {
          'id-1': 582450.5679999999,
          'id-2': 121650.088,
          'id-3': '华东',
          'id-4': '上海',
        },
        {
          'id-1': 790915.405,
          'id-2': 172031.6850000001,
          'id-3': '华北',
          'id-4': '河北',
        },
        {
          'id-1': 546903.5320000001,
          'id-2': 142601.73200000002,
          'id-3': '华东',
          'id-4': '福建',
        },
        {
          'id-1': 628965.1899999997,
          'id-2': 149028.81000000008,
          'id-3': '华东',
          'id-4': '安徽',
        },
        {
          'id-1': 179270.02800000008,
          'id-2': -42682.192,
          'id-3': '西北',
          'id-4': '甘肃',
        },
        {
          'id-1': 640196.5709999998,
          'id-2': 153058.17100000003,
          'id-3': '东北',
          'id-4': '吉林',
        },
        {
          'id-1': 862569.7359999995,
          'id-2': -168038.7240000001,
          'id-3': '东北',
          'id-4': '辽宁',
        },
        {
          'id-1': 621960.3320000009,
          'id-2': -132032.34800000003,
          'id-3': '中南',
          'id-4': '湖北',
        },
        {
          'id-1': 853574.798999999,
          'id-2': 199528.67900000006,
          'id-3': '中南',
          'id-4': '河南',
        },
        {
          'id-1': 723442.2090000004,
          'id-2': 156735.92899999995,
          'id-3': '中南',
          'id-4': '湖南',
        },
        {
          'id-1': 409147.2,
          'id-2': 91961.94000000003,
          'id-3': '华北',
          'id-4': '北京',
        },
        {
          'id-1': 361761.9320000001,
          'id-2': 64431.752000000066,
          'id-3': '西南',
          'id-4': '重庆',
        },
      ],
      dimensions: [
        { alias: '区域', id: 'id-3', encoding: 'column' },
        { alias: '省份', id: 'id-4', encoding: 'column' },
      ],
      locale: 'zh-CN',
      measures: [
        { alias: 'Sum(sales)', id: 'id-1' },
        { alias: 'Sum(profit)', id: 'id-2' },
      ],
      theme: 'light',
    })
  })

  test('date dimension select uses derived alias in groupBy', async () => {
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.from(VBI.generateEmptyDSL(connectorId))

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
      measures: [{ alias: '销售额', id: 'id-1' }],
    })
    const years = vseed.dataset.map((row) => row['id-2']).sort()
    expect(years).toEqual(['2016', '2017', '2018', '2019'])
  })

  test('duplicate fields use ids in query and vseed metadata', async () => {
    registerDemoConnector()
    const connectorId = getDemoConnectorId()

    const builder = VBI.from(VBI.generateEmptyDSL(connectorId))

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
      { alias: '销售额', id: 'id-1' },
      { alias: '最高销售额', id: 'id-2' },
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
