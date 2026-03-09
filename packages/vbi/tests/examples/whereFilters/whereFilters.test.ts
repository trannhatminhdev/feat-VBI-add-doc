import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

describe('WhereFilters', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })

  it('add-where-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [],
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.add('product_type', (node) => {
        node.setOperator('eq').setValue('Office Supplies')
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
        "version": 1,
        "whereFilters": [
          {
            "field": "product_type",
            "operator": "eq",
            "value": "Office Supplies",
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [],
        "limit": 20,
        "select": [],
        "where": {
          "conditions": [
            {
              "field": "product_type",
              "op": "eq",
              "value": "Office Supplies",
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('add-multiple-where-filters', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [],
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.add('product_type', (n) => n.setOperator('eq')).add('province', (n) => n.setOperator('in'))
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
        "version": 1,
        "whereFilters": [
          {
            "field": "product_type",
            "operator": "eq",
          },
          {
            "field": "province",
            "operator": "in",
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [],
        "limit": 20,
        "select": [],
        "where": {
          "conditions": [
            {
              "field": "product_type",
              "op": "eq",
              "value": undefined,
            },
            {
              "field": "province",
              "op": "in",
              "value": undefined,
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('bar-by-province-with-filter', async () => {
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
          encoding: 'xAxis',
          aggregate: {
            func: 'sum',
          },
        },
      ],
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      filters: [],
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.add('sales', (node) => {
        node.setOperator('gt').setValue(100000)
      })
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "省份",
            "field": "province",
          },
        ],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "销售额",
            "encoding": "xAxis",
            "field": "sales",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilters": [
          {
            "field": "sales",
            "operator": "gt",
            "value": 100000,
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "province",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "省份",
            "field": "province",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "sales",
              "op": "gt",
              "value": 100000,
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "bar",
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('clear-where-filters', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [],
      whereFilters: [
        {
          field: 'product_type',
          operator: 'eq',
          value: 'Office Supplies',
        },
        {
          field: 'province',
          operator: 'eq',
          value: 'Beijing',
        },
      ],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.clear()
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
        "version": 1,
        "whereFilters": [],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [],
        "limit": 20,
        "select": [],
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [
          {
            "amount": 2,
            "area": "华东",
            "city": "杭州",
            "country_or_region": "中国",
            "customer_id": "曾惠-14485",
            "customer_name": "曾惠",
            "customer_type": "公司",
            "delivery_date": "2019-04-29",
            "delivery_method": "二级",
            "discount": 0.4,
            "id": "1",
            "order_date": "2019-04-27",
            "order_id": "US-2019-1357144",
            "product_id": "办公用-用品-10002717",
            "product_name": "Fiskars 剪刀, 蓝色",
            "product_sub_type": "用品",
            "product_type": "办公用品",
            "profit": -60.704,
            "province": "浙江",
            "sales": 129.696,
          },
          {
            "amount": 2,
            "area": "西南",
            "city": "内江",
            "country_or_region": "中国",
            "customer_id": "许安-10165",
            "customer_name": "许安",
            "customer_type": "消费者",
            "delivery_date": "2019-06-16",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "2",
            "order_date": "2019-06-15",
            "order_id": "CN-2019-1973789",
            "product_id": "办公用-信封-10004832",
            "product_name": "GlobeWeis 搭扣信封, 红色",
            "product_sub_type": "信封",
            "product_type": "办公用品",
            "profit": 42.56,
            "province": "四川",
            "sales": 125.44,
          },
          {
            "amount": 2,
            "area": "西南",
            "city": "内江",
            "country_or_region": "中国",
            "customer_id": "许安-10165",
            "customer_name": "许安",
            "customer_type": "消费者",
            "delivery_date": "2019-06-19",
            "delivery_method": "标准级",
            "discount": 0.4,
            "id": "3",
            "order_date": "2019-06-16",
            "order_id": "CN-2019-1973789",
            "product_id": "办公用-装订-10001505",
            "product_name": "Cardinal 孔加固材料, 回收",
            "product_sub_type": "装订机",
            "product_type": "办公用品",
            "profit": 4.2,
            "province": "四川",
            "sales": 31.92,
          },
          {
            "amount": 4,
            "area": "华东",
            "city": "镇江",
            "country_or_region": "中国",
            "customer_id": "宋良-17170",
            "customer_name": "宋良",
            "customer_type": "公司",
            "delivery_date": "2019-12-10",
            "delivery_method": "标准级",
            "discount": 0.4,
            "id": "4",
            "order_date": "2019-12-09",
            "order_id": "US-2019-3017568",
            "product_id": "办公用-用品-10003746",
            "product_name": "Kleencut 开信刀, 工业",
            "product_sub_type": "用品",
            "product_type": "办公用品",
            "profit": -27.104,
            "province": "江苏",
            "sales": 321.216,
          },
          {
            "amount": 3,
            "area": "中南",
            "city": "汕头",
            "country_or_region": "中国",
            "customer_id": "万兰-15730",
            "customer_name": "万兰",
            "customer_type": "消费者",
            "delivery_date": "2018-06-02",
            "delivery_method": "二级",
            "discount": 0,
            "id": "5",
            "order_date": "2018-05-31",
            "order_id": "CN-2018-2975416",
            "product_id": "办公用-器具-10003452",
            "product_name": "KitchenAid 搅拌机, 黑色",
            "product_sub_type": "器具",
            "product_type": "办公用品",
            "profit": 550.2,
            "province": "广东",
            "sales": 1375.92,
          },
          {
            "amount": 9,
            "area": "华东",
            "city": "景德镇",
            "country_or_region": "中国",
            "customer_id": "俞明-18325",
            "customer_name": "俞明",
            "customer_type": "消费者",
            "delivery_date": "2017-10-31",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "6",
            "order_date": "2017-10-27",
            "order_id": "CN-2017-4497736",
            "product_id": "技术-设备-10001640",
            "product_name": "柯尼卡 打印机, 红色",
            "product_sub_type": "设备",
            "product_type": "技术",
            "profit": 3783.78,
            "province": "江西",
            "sales": 11129.58,
          },
          {
            "amount": 2,
            "area": "华东",
            "city": "景德镇",
            "country_or_region": "中国",
            "customer_id": "俞明-18325",
            "customer_name": "俞明",
            "customer_type": "消费者",
            "delivery_date": "2017-10-31",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "7",
            "order_date": "2017-10-27",
            "order_id": "CN-2017-4497736",
            "product_id": "办公用-装订-10001029",
            "product_name": "Ibico 订书机, 实惠",
            "product_sub_type": "装订机",
            "product_type": "办公用品",
            "profit": 172.76,
            "province": "江西",
            "sales": 479.92,
          },
          {
            "amount": 4,
            "area": "华东",
            "city": "景德镇",
            "country_or_region": "中国",
            "customer_id": "俞明-18325",
            "customer_name": "俞明",
            "customer_type": "消费者",
            "delivery_date": "2017-10-31",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "8",
            "order_date": "2017-10-27",
            "order_id": "CN-2017-4497736",
            "product_id": "家具-椅子-10000578",
            "product_name": "SAFCO 扶手椅, 可调",
            "product_sub_type": "椅子",
            "product_type": "家具",
            "profit": 2684.08,
            "province": "江西",
            "sales": 8659.84,
          },
          {
            "amount": 5,
            "area": "华东",
            "city": "景德镇",
            "country_or_region": "中国",
            "customer_id": "俞明-18325",
            "customer_name": "俞明",
            "customer_type": "消费者",
            "delivery_date": "2017-10-31",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "9",
            "order_date": "2017-10-27",
            "order_id": "CN-2017-4497736",
            "product_id": "办公用-纸张-10001629",
            "product_name": "Green Bar 计划信息表, 多色",
            "product_sub_type": "纸张",
            "product_type": "办公用品",
            "profit": 46.9,
            "province": "江西",
            "sales": 588,
          },
          {
            "amount": 2,
            "area": "华东",
            "city": "景德镇",
            "country_or_region": "中国",
            "customer_id": "俞明-18325",
            "customer_name": "俞明",
            "customer_type": "消费者",
            "delivery_date": "2017-10-31",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "10",
            "order_date": "2017-10-27",
            "order_id": "CN-2017-4497736",
            "product_id": "办公用-系固-10004801",
            "product_name": "Stockwell 橡皮筋, 整包",
            "product_sub_type": "系固件",
            "product_type": "办公用品",
            "profit": 33.88,
            "province": "江西",
            "sales": 154.28,
          },
          {
            "amount": 2,
            "area": "西北",
            "city": "榆林",
            "country_or_region": "中国",
            "customer_id": "谢雯-21700",
            "customer_name": "谢雯",
            "customer_type": "小型企业",
            "delivery_date": "2016-12-24",
            "delivery_method": "二级",
            "discount": 0,
            "id": "11",
            "order_date": "2016-12-22",
            "order_id": "CN-2016-4195213",
            "product_id": "技术-设备-10000001",
            "product_name": "爱普生 计算器, 耐用",
            "product_sub_type": "设备",
            "product_type": "技术",
            "profit": 4.2,
            "province": "陕西",
            "sales": 434.28,
          },
          {
            "amount": 4,
            "area": "东北",
            "city": "哈尔滨",
            "country_or_region": "中国",
            "customer_id": "康青-19585",
            "customer_name": "康青",
            "customer_type": "消费者",
            "delivery_date": "2019-06-06",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "12",
            "order_date": "2019-06-01",
            "order_id": "CN-2019-5801711",
            "product_id": "技术-复印-10002416",
            "product_name": "惠普 墨水, 红色",
            "product_sub_type": "复印机",
            "product_type": "技术",
            "profit": 639.52,
            "province": "黑龙江",
            "sales": 2368.8,
          },
          {
            "amount": 3,
            "area": "华东",
            "city": "青岛",
            "country_or_region": "中国",
            "customer_id": "赵婵-10885",
            "customer_name": "赵婵",
            "customer_type": "消费者",
            "delivery_date": "2017-06-09",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "13",
            "order_date": "2017-06-05",
            "order_id": "CN-2017-2752724",
            "product_id": "办公用-信封-10000017",
            "product_name": "Jiffy 局间信封, 银色",
            "product_sub_type": "信封",
            "product_type": "办公用品",
            "profit": 88.62,
            "province": "山东",
            "sales": 683.76,
          },
          {
            "amount": 5,
            "area": "华东",
            "city": "青岛",
            "country_or_region": "中国",
            "customer_id": "赵婵-10885",
            "customer_name": "赵婵",
            "customer_type": "消费者",
            "delivery_date": "2017-06-09",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "14",
            "order_date": "2017-06-05",
            "order_id": "CN-2017-2752724",
            "product_id": "技术-配件-10004920",
            "product_name": "SanDisk 键区, 可编程",
            "product_sub_type": "配件",
            "product_type": "技术",
            "profit": 344.4,
            "province": "山东",
            "sales": 1326.5,
          },
          {
            "amount": 2,
            "area": "华东",
            "city": "青岛",
            "country_or_region": "中国",
            "customer_id": "赵婵-10885",
            "customer_name": "赵婵",
            "customer_type": "消费者",
            "delivery_date": "2017-06-09",
            "delivery_method": "标准级",
            "discount": 0,
            "id": "15",
            "order_date": "2017-06-05",
            "order_id": "CN-2017-2752724",
            "product_id": "技术-电话-10004349",
            "product_name": "诺基亚 充电器, 蓝色",
            "product_sub_type": "电话",
            "product_type": "技术",
            "profit": 2849.28,
            "province": "山东",
            "sales": 5936.56,
          },
          {
            "amount": 7,
            "area": "华东",
            "city": "徐州",
            "country_or_region": "中国",
            "customer_id": "刘斯-20965",
            "customer_name": "刘斯云",
            "customer_type": "公司",
            "delivery_date": "2018-11-25",
            "delivery_method": "一级",
            "discount": 0.4,
            "id": "16",
            "order_date": "2018-11-22",
            "order_id": "US-2018-2511714",
            "product_id": "办公用-器具-10003582",
            "product_name": "KitchenAid 冰箱, 黑色",
            "product_sub_type": "器具",
            "product_type": "办公用品",
            "profit": -3962.728,
            "province": "江苏",
            "sales": 10336.452,
          },
          {
            "amount": 3,
            "area": "华东",
            "city": "徐州",
            "country_or_region": "中国",
            "customer_id": "刘斯-20965",
            "customer_name": "刘斯云",
            "customer_type": "公司",
            "delivery_date": "2018-11-25",
            "delivery_method": "一级",
            "discount": 0,
            "id": "17",
            "order_date": "2018-11-22",
            "order_id": "US-2018-2511714",
            "product_id": "办公用-标签-10004648",
            "product_name": "Novimex 圆形标签, 红色",
            "product_sub_type": "标签",
            "product_type": "办公用品",
            "profit": 38.22,
            "province": "江苏",
            "sales": 85.26,
          },
          {
            "amount": 7,
            "area": "华东",
            "city": "上海",
            "country_or_region": "中国",
            "customer_id": "白鹄-14050",
            "customer_name": "白鹄",
            "customer_type": "消费者",
            "delivery_date": "2019-10-03",
            "delivery_method": "二级",
            "discount": 0,
            "id": "18",
            "order_date": "2019-10-02",
            "order_id": "CN-2019-5631342",
            "product_id": "技术-配件-10001200",
            "product_name": "Memorex 键盘, 实惠",
            "product_sub_type": "配件",
            "product_type": "技术",
            "profit": 1071.14,
            "province": "上海",
            "sales": 2330.44,
          },
          {
            "amount": 1,
            "area": "华东",
            "city": "上海",
            "country_or_region": "中国",
            "customer_id": "白鹄-14050",
            "customer_name": "白鹄",
            "customer_type": "消费者",
            "delivery_date": "2019-10-04",
            "delivery_method": "二级",
            "discount": 0,
            "id": "19",
            "order_date": "2019-10-02",
            "order_id": "CN-2019-5631342",
            "product_id": "办公用-用品-10000039",
            "product_name": "Acme 尺子, 工业",
            "product_sub_type": "用品",
            "product_type": "办公用品",
            "profit": 23.94,
            "province": "上海",
            "sales": 85.54,
          },
          {
            "amount": 5,
            "area": "华东",
            "city": "上海",
            "country_or_region": "中国",
            "customer_id": "白鹄-14050",
            "customer_name": "白鹄",
            "customer_type": "消费者",
            "delivery_date": "2019-10-04",
            "delivery_method": "二级",
            "discount": 0,
            "id": "20",
            "order_date": "2019-10-02",
            "order_id": "CN-2019-5631342",
            "product_id": "办公用-装订-10004589",
            "product_name": "Avery 孔加固材料, 耐用",
            "product_sub_type": "装订机",
            "product_type": "办公用品",
            "profit": 2.1,
            "province": "上海",
            "sales": 137.9,
          },
        ],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('column-by-area-multiple-filters', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [
        {
          field: 'area',
          alias: '区域',
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
      whereFilters: [],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      filters: [],
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters
        .add('sales', (node) => node.setOperator('gt').setValue(500000))
        .add('area', (node) => node.setOperator('in').setValue(['华东', '华北']))
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "connectorId": "demoSupermarket",
        "dimensions": [
          {
            "alias": "区域",
            "field": "area",
          },
        ],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [
          {
            "aggregate": {
              "func": "sum",
            },
            "alias": "销售额",
            "encoding": "yAxis",
            "field": "sales",
          },
        ],
        "theme": "light",
        "version": 1,
        "whereFilters": [
          {
            "field": "sales",
            "operator": "gt",
            "value": 500000,
          },
          {
            "field": "area",
            "operator": "in",
            "value": [
              "华东",
              "华北",
            ],
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [
          "area",
        ],
        "limit": 20,
        "select": [
          {
            "aggr": {
              "func": "sum",
            },
            "alias": "销售额",
            "field": "sales",
          },
          {
            "alias": "区域",
            "field": "area",
          },
        ],
        "where": {
          "conditions": [
            {
              "field": "sales",
              "op": "gt",
              "value": 500000,
            },
            {
              "field": "area",
              "op": "in",
              "value": [
                "华东",
                "华北",
              ],
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "column",
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })

  it('remove-where-filter', async () => {
    const builder = VBI.from({
      connectorId: 'demoSupermarket',
      chartType: 'table',
      dimensions: [],
      measures: [],
      whereFilters: [
        {
          field: 'product_type',
          operator: 'eq',
          value: 'Office Supplies',
        },
        {
          field: 'province',
          operator: 'eq',
          value: 'Beijing',
        },
      ],
      havingFilters: [],
      theme: 'light',
      locale: 'zh-CN',
      version: 1,
      limit: 20,
    })

    // Apply custom builder code
    const applyBuilder = (builder: VBIBuilder) => {
      builder.whereFilters.remove('product_type')
    }
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "connectorId": "demoSupermarket",
        "dimensions": [],
        "havingFilters": [],
        "limit": 20,
        "locale": "zh-CN",
        "measures": [],
        "theme": "light",
        "version": 1,
        "whereFilters": [
          {
            "field": "province",
            "operator": "eq",
            "value": "Beijing",
          },
        ],
      }
    `)

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot(`
      {
        "groupBy": [],
        "limit": 20,
        "select": [],
        "where": {
          "conditions": [
            {
              "field": "province",
              "op": "eq",
              "value": "Beijing",
            },
          ],
          "op": "and",
        },
      }
    `)

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot(`
      {
        "chartType": "table",
        "dataset": [],
        "locale": "zh-CN",
        "theme": "light",
      }
    `)
  })
})
