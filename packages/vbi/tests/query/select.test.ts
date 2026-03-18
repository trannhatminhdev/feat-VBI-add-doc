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
          'Sum(profit)': -131728.99600000013,
          'Sum(sales)': 452108.2440000001,
          区域: '华东',
          省份: '浙江',
        },
        {
          'Sum(profit)': -89487.52399999995,
          'Sum(sales)': 400877.5960000003,
          区域: '西南',
          省份: '四川',
        },
        {
          'Sum(profit)': -107603.02000000003,
          'Sum(sales)': 649967.2200000006,
          区域: '华东',
          省份: '江苏',
        },
        {
          'Sum(profit)': 337994.9929999998,
          'Sum(sales)': 1452929.5129999993,
          区域: '中南',
          省份: '广东',
        },
        {
          'Sum(profit)': 47807.06000000001,
          'Sum(sales)': 237328.70000000013,
          区域: '华东',
          省份: '江西',
        },
        {
          'Sum(profit)': 105814.68799999998,
          'Sum(sales)': 457688.16800000006,
          区域: '西北',
          省份: '陕西',
        },
        {
          'Sum(profit)': 257172.06199999977,
          'Sum(sales)': 1178801.1620000016,
          区域: '东北',
          省份: '黑龙江',
        },
        {
          'Sum(profit)': 385463.008,
          'Sum(sales)': 1586782.9879999978,
          区域: '华东',
          省份: '山东',
        },
        {
          'Sum(profit)': 121650.088,
          'Sum(sales)': 582450.5679999999,
          区域: '华东',
          省份: '上海',
        },
        {
          'Sum(profit)': 172031.6850000001,
          'Sum(sales)': 790915.405,
          区域: '华北',
          省份: '河北',
        },
        {
          'Sum(profit)': 142601.73200000002,
          'Sum(sales)': 546903.5320000001,
          区域: '华东',
          省份: '福建',
        },
        {
          'Sum(profit)': 149028.81000000008,
          'Sum(sales)': 628965.1899999997,
          区域: '华东',
          省份: '安徽',
        },
        {
          'Sum(profit)': -42682.192,
          'Sum(sales)': 179270.02800000008,
          区域: '西北',
          省份: '甘肃',
        },
        {
          'Sum(profit)': 153058.17100000003,
          'Sum(sales)': 640196.5709999998,
          区域: '东北',
          省份: '吉林',
        },
        {
          'Sum(profit)': -168038.7240000001,
          'Sum(sales)': 862569.7359999995,
          区域: '东北',
          省份: '辽宁',
        },
        {
          'Sum(profit)': -132032.34800000003,
          'Sum(sales)': 621960.3320000009,
          区域: '中南',
          省份: '湖北',
        },
        {
          'Sum(profit)': 199528.67900000006,
          'Sum(sales)': 853574.798999999,
          区域: '中南',
          省份: '河南',
        },
        {
          'Sum(profit)': 156735.92899999995,
          'Sum(sales)': 723442.2090000004,
          区域: '中南',
          省份: '湖南',
        },
        {
          'Sum(profit)': 91961.94000000003,
          'Sum(sales)': 409147.2,
          区域: '华北',
          省份: '北京',
        },
        {
          'Sum(profit)': 64431.752000000066,
          'Sum(sales)': 361761.9320000001,
          区域: '西南',
          省份: '重庆',
        },
      ],
      locale: 'zh-CN',
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
      groupBy: ['年份'],
      limit: 1000,
      select: [
        {
          field: 'sales',
          alias: '销售额',
          aggr: { func: 'sum' },
        },
        {
          field: 'order_date',
          alias: '年份',
          aggr: { func: 'to_year' },
        },
      ],
    })

    const vseed = await builder.buildVSeed()
    const years = vseed.dataset.map((row) => row['年份']).sort()
    expect(years).toEqual(['2016', '2017', '2018', '2019'])
  })
})
