import * as Y from 'yjs'
import type { ObserveCallback, VBIMeasure, VBIMeasureGroup, VBIMeasureTree } from 'src/types'
import { MeasureNodeBuilder } from './mea-node-builder'
import { id } from 'src/utils'
import { getOrCreateMeasures, locateMeasureIndexById, normalizeMeasureNodeIds } from './measure-utils'
import { getRecommendedMeasureEncodingsForChartType } from '../chart-type/measure-encoding'

/**
 * @description 度量构建器，用于添加、修改、删除度量配置。度量是数据的数值字段，如：销售额、利润、数量
 */
export class MeasuresBuilder {
  private dsl: Y.Map<any>
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl

    doc.transact(() => {
      const measures = getOrCreateMeasures(this.dsl)
      normalizeMeasureNodeIds(measures)
    })
  }

  /**
   * @description 添加一个度量
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder {
    const measures = getOrCreateMeasures(this.dsl)
    const chartType = this.dsl.get('chartType') || 'table'
    const [encoding] = getRecommendedMeasureEncodingsForChartType(chartType, measures.length + 1).slice(-1)
    const measure: VBIMeasure = {
      id: id.uuid(),
      alias: field,
      field,
      encoding,
      aggregate: { func: 'sum' },
    }

    const yMap = new Y.Map<any>()

    for (const [key, value] of Object.entries(measure)) {
      yMap.set(key, value)
    }
    measures.push([yMap])

    const node = new MeasureNodeBuilder(yMap)

    callback(node)
    return this
  }

  /**
   * @description 删除指定 ID 的度量
   * @param id - 度量 ID
   */
  remove(id: string): MeasuresBuilder {
    const measures = getOrCreateMeasures(this.dsl)
    const index = locateMeasureIndexById(measures, id)
    if (index !== -1) {
      measures.delete(index, 1)
    }
    return this
  }

  /**
   * @description 更新度量配置
   * @param id - 度量 ID
   * @param callback - 回调函数
   */
  update(id: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder {
    const measures = getOrCreateMeasures(this.dsl)
    const index = locateMeasureIndexById(measures, id)

    if (index === -1) {
      throw new Error(`Measure with id "${id}" not found`)
    }

    const measureYMap = measures.get(index)
    const node = new MeasureNodeBuilder(measureYMap)
    callback(node)
    return this
  }

  /**
   * @description 按回调条件查找第一个度量，行为与 Array.find 一致
   * @param predicate - 查找条件
   */
  find(predicate: (node: MeasureNodeBuilder, index: number) => boolean): MeasureNodeBuilder | undefined {
    const measures = getOrCreateMeasures(this.dsl)
    const items = measures.toArray() as Y.Map<any>[]
    for (let index = 0; index < items.length; index++) {
      const node = new MeasureNodeBuilder(items[index])
      if (predicate(node, index)) {
        return node
      }
    }
    return undefined
  }

  /**
   * @description 获取所有度量
   */
  findAll(): MeasureNodeBuilder[] {
    const measures = getOrCreateMeasures(this.dsl)
    return measures.toArray().map((yMap: any) => new MeasureNodeBuilder(yMap))
  }

  /**
   * @description 导出所有度量为 JSON 数组
   */
  toJSON(): VBIMeasure[] {
    const measures = getOrCreateMeasures(this.dsl)
    return measures.toJSON() as VBIMeasure[]
  }

  /**
   * @description 监听度量变化
   * @param callback - 回调函数
   */
  /**
   * @description 监听度量变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const measures = getOrCreateMeasures(this.dsl)
    measures.observe(callback as any)
    return () => {
      measures.unobserve(callback as any)
    }
  }

  static isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure {
    return 'encoding' in node || 'aggregate' in node
  }

  static isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup {
    return 'children' in node
  }
}
