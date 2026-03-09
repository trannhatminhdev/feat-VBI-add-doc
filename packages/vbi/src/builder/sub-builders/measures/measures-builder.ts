import * as Y from 'yjs'
import type { ObserveCallback, VBIMeasure, VBIMeasureGroup, VBIMeasureTree } from 'src/types'
import { MeasureNodeBuilder } from './measure-node-builder'

/**
 * @description 度量构建器 - 用于构建和管理图表度量
 * 度量是数据的数值字段，如：销售额、利润、数量
 * 支持聚合函数（sum、avg、count、max、min 等）
 */
export class MeasuresBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

  /**
   * @description 添加一个度量
   * @param field - 字段名，如 "sales"、"profit"
   * @param callback - 可选回调，用于进一步配置度量节点
   * @returns 度量节点或自身（支持链式调用）
   */
  add(field: string): MeasureNodeBuilder
  add(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder
  add(field: string, callback?: (node: MeasureNodeBuilder) => void): MeasureNodeBuilder | MeasuresBuilder {
    const measure: VBIMeasure = {
      alias: field,
      field,
      encoding: 'yAxis',
      aggregate: { func: 'sum' },
    }

    const yMap = new Y.Map<any>()

    for (const [key, value] of Object.entries(measure)) {
      yMap.set(key, value)
    }
    this.dsl.get('measures').push([yMap])

    const node = new MeasureNodeBuilder(yMap)

    if (callback) {
      callback(node)
      return this
    }
    return node
  }

  /**
   * @description 删除指定字段的度量
   * @param field - 字段名
   */
  remove(field: VBIMeasure['field']): MeasuresBuilder {
    const measures = this.dsl.get('measures')
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('measures').delete(index, 1)
    }
    return this
  }

  /**
   * @description 更新度量配置
   * @param field - 字段名
   * @param callback - 回调函数，用于进一步配置度量节点
   */
  update(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder {
    const measures = this.dsl.get('measures') as Y.Array<any>
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Measure with field "${field}" not found`)
    }

    const measureYMap = measures.get(index)
    const node = new MeasureNodeBuilder(measureYMap)
    callback(node)
    return this
  }

  /**
   * @description 根据字段名查找度量
   * @param field - 字段名
   * @returns 度量节点构建器
   */
  find(field: VBIMeasure['field']): MeasureNodeBuilder | undefined {
    const measures = this.dsl.get('measures') as Y.Array<any>
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return undefined
    }

    return new MeasureNodeBuilder(measures.get(index))
  }

  /**
   * @description 获取所有度量
   * @returns 度量节点构建器数组
   */
  findAll(): MeasureNodeBuilder[] {
    const measures = this.dsl.get('measures') as Y.Array<any>
    return measures.toArray().map((yMap: any) => new MeasureNodeBuilder(yMap))
  }

  /**
   * @description 导出所有度量为 JSON 数组
   * @returns 度量配置 JSON 数组
   */
  toJson(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON() as VBIMeasure[]
  }

  /**
   * @description 监听度量变化
   * @param callback - 回调函数
   */
  observe(callback: ObserveCallback) {
    this.dsl.get('measures').observe(callback)
  }

  /**
   * @description 取消监听度量变化
   * @param callback - 回调函数
   */
  unobserve(callback: ObserveCallback) {
    this.dsl.get('measures').unobserve(callback)
  }

  static isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure {
    return 'field' in node
  }

  static isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup {
    return 'children' in node
  }
}
