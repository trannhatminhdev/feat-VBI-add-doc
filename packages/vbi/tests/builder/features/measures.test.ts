import { VBI } from '@visactor/vbi'
import { VBIChartDSL } from 'src/types/chartDSL'
import { MeasuresBuilder } from 'src/chart-builder/features/measures/mea-builder'
import { registerDemoConnector } from '../../demoConnector'

describe('MeasuresBuilder', () => {
  test('addMeasure', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.measures.add('sales', (node) => {
      node.setAlias('Max(sales)').setAggregate({ func: 'max' })
    })

    expect(builder.build()).toEqual({
      uuid: builder.getUUID(),
      dimensions: [],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [
        {
          id: 'id-1',
          aggregate: {
            func: 'max',
          },
          alias: 'Max(sales)',
          encoding: 'column',
          field: 'sales',
        },
      ],
    })
  })

  test('addMeasure callback', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)
    builder.measures
      .add('sales', (node) => {
        node.setAlias('sum(sales)')
      })
      .add('orders', (node) => {
        node.setAlias('Min(orders)').setAggregate({ func: 'min' })
      })

    expect(builder.build()).toEqual({
      uuid: builder.getUUID(),
      dimensions: [],
      whereFilter: { id: 'root', op: 'and', conditions: [] },
      havingFilter: { id: 'root', op: 'and', conditions: [] },
      measures: [
        {
          id: 'id-1',
          aggregate: {
            func: 'sum',
          },
          alias: 'sum(sales)',
          encoding: 'column',
          field: 'sales',
        },
        {
          id: 'id-2',
          aggregate: {
            func: 'min',
          },
          alias: 'Min(orders)',
          encoding: 'column',
          field: 'orders',
        },
      ],
    })
  })

  test('removeMeasure', () => {
    const dsl = {
      measures: [
        { field: 'sales', alias: '销售额', aggregate: { func: 'sum' } },
        { field: 'orders', alias: '订单数', aggregate: { func: 'count' } },
      ],
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.remove('id-1')

    expect(builder.build().measures).toEqual([
      { id: 'id-2', field: 'orders', alias: '订单数', aggregate: { func: 'count' } },
    ])
  })

  test('removeMeasure not found', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.remove('notExist')

    expect(builder.build().measures).toEqual([{ id: 'id-1', field: 'sales', alias: '销售额' }])
  })

  test('updateMeasure', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额', aggregate: { func: 'sum' } }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.update('id-1', (node) => {
      node.setAlias('新销售额').setAggregate({ func: 'avg' })
    })

    expect(builder.build().measures).toEqual([
      { id: 'id-1', field: 'sales', alias: '新销售额', aggregate: { func: 'avg' } },
    ])
  })

  test('updateMeasure throws error if not found', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    expect(() => {
      builder.measures.update('notExist', (node) => {
        node.setAlias('新销售额')
      })
    }).toThrow('Measure with id "notExist" not found')
  })

  test('findMeasure', () => {
    const dsl = {
      measures: [
        { field: 'sales', alias: '销售额' },
        { field: 'orders', alias: '订单数' },
      ],
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')

    expect(node?.getField()).toBe('sales')
    expect(node?.toJSON()).toEqual({ id: 'id-1', field: 'sales', alias: '销售额' })
  })

  test('findMeasure returns undefined if not found', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'notExist')

    expect(node).toBeUndefined()
  })

  test('findAllMeasures', () => {
    const dsl = {
      measures: [
        { field: 'sales', alias: '销售额' },
        { field: 'orders', alias: '订单数' },
      ],
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const nodes = builder.measures.findAll()

    expect(nodes.length).toBe(2)
    expect(nodes[0].getField()).toBe('sales')
    expect(nodes[1].getField()).toBe('orders')
  })

  test('findAllMeasures returns empty array when no measures', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const nodes = builder.measures.findAll()

    expect(nodes).toEqual([])
  })

  test('toJSON', () => {
    const dsl = {
      measures: [
        { field: 'sales', alias: '销售额' },
        { field: 'orders', alias: '订单数' },
      ],
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const json = builder.measures.toJSON()

    expect(json).toEqual([
      { id: 'id-1', field: 'sales', alias: '销售额' },
      { id: 'id-2', field: 'orders', alias: '订单数' },
    ])
  })

  test('toJSON returns empty array when no measures', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const json = builder.measures.toJSON()

    expect(json).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }
    const unobserve = builder.measures.observe(callback)

    builder.measures.add('sales', (node) => {
      node.setAlias('销售额')
    })

    expect(callCount).toBe(1)

    unobserve()

    builder.measures.add('orders', (node) => {
      node.setAlias('订单数')
    })

    expect(callCount).toBe(1)
  })

  test('observe reacts to nested measure updates', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    let callCount = 0
    const unobserve = builder.measures.observe(() => {
      callCount++
    })

    builder.measures.add('sales', (node) => {
      node.setAlias('销售额')
    })

    const measureId = builder.measures.toJSON()[0]?.id

    builder.measures.update(measureId, (node) => {
      node.setAlias('收入')
    })

    expect(callCount).toBe(2)

    unobserve()
  })

  test('isMeasureNode', () => {
    const node = { field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } }
    const group = { field: 'group1', children: [], alias: 'group' }

    expect(MeasuresBuilder.isMeasureNode(node as unknown as any)).toBe(true)
    expect(MeasuresBuilder.isMeasureNode(group)).toBe(false)
  })

  test('isMeasureGroup', () => {
    const node = { field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } }
    const group = { field: 'group1', children: [], alias: 'group' }

    expect(MeasuresBuilder.isMeasureGroup(node as unknown as any)).toBe(false)
    expect(MeasuresBuilder.isMeasureGroup(group)).toBe(true)
  })

  test('MeasureNodeBuilder getField', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')

    expect(node?.getField()).toBe('sales')
  })

  test('MeasureNodeBuilder getId', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')

    expect(node?.getId()).toBe('id-1')
  })

  test('MeasureNodeBuilder setAlias', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')
    node?.setAlias('新销售额')

    expect(builder.measures.toJSON()[0].alias).toBe('新销售额')
  })

  test('MeasureNodeBuilder getEncoding', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额', encoding: 'primaryYAxis' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((item) => item.getId() === 'id-1')

    expect(node?.getEncoding()).toBe('primaryYAxis')
  })

  test('MeasureNodeBuilder setEncoding', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')
    node?.setEncoding('xAxis')

    expect(builder.measures.toJSON()[0].encoding).toBe('xAxis')
  })

  test('addMeasure uses chart type recommendations', () => {
    const builder = VBI.createChart({ chartType: 'dualAxis' } as VBIChartDSL)

    builder.measures.add('sales', () => {})
    builder.measures.add('profit', () => {})
    builder.measures.add('discount', () => {})

    expect(builder.measures.toJSON().map((measure) => measure.encoding)).toEqual([
      'primaryYAxis',
      'secondaryYAxis',
      'secondaryYAxis',
    ])
  })

  test('MeasureNodeBuilder setAggregate', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')
    node?.setAggregate({ func: 'avg' })

    expect(builder.measures.toJSON()[0].aggregate).toEqual({ func: 'avg' })
  })

  test('MeasureNodeBuilder setAggregate supports extended funcs', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((item) => item.getId() === 'id-1')
    node?.setAggregate({ func: 'countDistinct' })

    expect(builder.measures.toJSON()[0].aggregate).toEqual({ func: 'countDistinct' })
  })

  test('MeasureNodeBuilder setAggregate supports quantile', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((item) => item.getId() === 'id-1')
    node?.setAggregate({ func: 'quantile', quantile: 0.75 })

    expect(builder.measures.toJSON()[0].aggregate).toEqual({ func: 'quantile', quantile: 0.75 })
  })

  test('MeasureNodeBuilder toJSON', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((node) => node.getId() === 'id-1')
    const json = node?.toJSON()

    expect(json).toEqual({ id: 'id-1', field: 'sales', alias: '销售额' })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures
      .add('sales', (node) => node.setAlias('销售额'))
      .add('orders', (node) => node.setAlias('订单数'))
      .add('profit', (node) => node.setAlias('利润'))

    const json = builder.measures.toJSON()

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('sales')
    expect(json[1].field).toBe('orders')
    expect(json[2].field).toBe('profit')
  })

  test('buildVQuery keeps extended aggregate configs', () => {
    const dsl = {
      measures: [
        { field: 'customer_id', alias: '客户去重数', aggregate: { func: 'countDistinct' } },
        { field: 'sales', alias: '销售额中位数', aggregate: { func: 'median' } },
        { field: 'profit', alias: '利润总体方差', aggregate: { func: 'variancePop' } },
        { field: 'discount', alias: '利润分位数', aggregate: { func: 'quantile', quantile: 0.9 } },
      ],
    } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    expect(builder.buildVQuery().select).toEqual([
      { field: 'customer_id', alias: 'id-1', aggr: { func: 'count_distinct' } },
      { field: 'sales', alias: 'id-2', aggr: { func: 'median' } },
      { field: 'profit', alias: 'id-3', aggr: { func: 'variance_pop' } },
      { field: 'discount', alias: 'id-4', aggr: { func: 'quantile', quantile: 0.9 } },
    ])
  })

  test('buildVSeed preserves measure encoding', async () => {
    registerDemoConnector()
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'product_type', alias: 'product_type', encoding: 'column' }],
      measures: [
        { id: 'id-2', field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } },
        { id: 'id-3', field: 'profit', alias: '利润', encoding: 'secondaryYAxis', aggregate: { func: 'avg' } },
      ],
    } as VBIChartDSL)

    const vSeedDSL = await builder.buildVSeed()

    expect(vSeedDSL.measures).toEqual([
      { id: 'id-2', alias: '销售额', encoding: 'yAxis' },
      { id: 'id-3', alias: '利润', encoding: 'secondaryYAxis' },
    ])
    expect(vSeedDSL.dimensions).toEqual([{ id: 'id-1', alias: 'product_type', encoding: 'column' }])
  })

  test('MeasureNodeBuilder setFormat with autoFormat', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.update('id-1', (node) => {
      node.setFormat({ autoFormat: true })
    })

    const json = builder.measures.toJSON()
    expect(json[0].format).toEqual({ autoFormat: true })
  })

  test('MeasureNodeBuilder setFormat with custom format', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const customFormat = {
      type: 'number' as const,
      ratio: 10000,
      symbol: '万',
      prefix: '¥',
      fractionDigits: 2,
    }

    builder.measures.update('id-1', (node) => {
      node.setFormat(customFormat)
    })

    const json = builder.measures.toJSON()
    expect(json[0].format).toEqual(customFormat)
  })

  test('MeasureNodeBuilder getFormat returns format', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.update('id-1', (node) => {
      node.setFormat({ autoFormat: true })
    })

    const node = builder.measures.find((n) => n.getId() === 'id-1')
    expect(node?.getFormat()).toEqual({ autoFormat: true })
  })

  test('MeasureNodeBuilder getFormat returns undefined when not set', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    const node = builder.measures.find((n) => n.getId() === 'id-1')
    expect(node?.getFormat()).toBeUndefined()
  })

  test('MeasureNodeBuilder clearFormat removes format', () => {
    const dsl = { measures: [{ field: 'sales', alias: '销售额' }] } as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.update('id-1', (node) => {
      node.setFormat({ autoFormat: true })
    })
    builder.measures.update('id-1', (node) => {
      node.clearFormat()
    })

    const node = builder.measures.find((n) => n.getId() === 'id-1')
    expect(node?.getFormat()).toBeUndefined()
    expect(node?.toJSON().format).toBeUndefined()
  })

  test('MeasureNodeBuilder setFormat chaining', () => {
    const dsl = {} as VBIChartDSL
    const builder = VBI.createChart(dsl)

    builder.measures.add('sales', (node) => {
      node.setAlias('销售额').setFormat({ autoFormat: true }).setAggregate({ func: 'sum' })
    })

    const json = builder.measures.toJSON()
    expect(json[0].format).toEqual({ autoFormat: true })
    expect(json[0].alias).toBe('销售额')
    expect(json[0].aggregate).toEqual({ func: 'sum' })
  })

  test('buildVSeed maps autoFormat format correctly', async () => {
    registerDemoConnector()
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'product_type', alias: 'product_type' }],
      measures: [{ id: 'id-2', field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } }],
    } as VBIChartDSL)

    builder.measures.update('id-2', (node) => {
      node.setFormat({ autoFormat: true })
    })

    const vSeedDSL = await builder.buildVSeed()

    expect(vSeedDSL.measures).toEqual([{ id: 'id-2', alias: '销售额', encoding: 'yAxis', autoFormat: true }])
  })

  test('buildVSeed maps custom format correctly', async () => {
    registerDemoConnector()
    const customFormat = {
      type: 'number' as const,
      ratio: 10000,
      symbol: '万',
      prefix: '¥',
      fractionDigits: 2,
    }
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'product_type', alias: 'product_type' }],
      measures: [{ id: 'id-2', field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } }],
    } as VBIChartDSL)

    builder.measures.update('id-2', (node) => {
      node.setFormat(customFormat)
    })

    const vSeedDSL = await builder.buildVSeed()

    expect(vSeedDSL.measures).toEqual([
      {
        id: 'id-2',
        alias: '销售额',
        encoding: 'yAxis',
        autoFormat: false,
        numFormat: {
          type: 'number',
          ratio: 10000,
          symbol: '万',
          prefix: '¥',
          fractionDigits: 2,
        },
      },
    ])
  })

  test('buildVSeed omits format fields when format not set', async () => {
    registerDemoConnector()
    const builder = VBI.createChart({
      connectorId: 'demoSupermarket',
      chartType: 'column',
      dimensions: [{ id: 'id-1', field: 'product_type', alias: 'product_type' }],
      measures: [{ id: 'id-2', field: 'sales', alias: '销售额', encoding: 'yAxis', aggregate: { func: 'sum' } }],
    } as VBIChartDSL)

    const vSeedDSL = await builder.buildVSeed()

    expect(vSeedDSL.measures![0]).not.toHaveProperty('autoFormat')
    expect(vSeedDSL.measures![0]).not.toHaveProperty('numFormat')
  })
})
