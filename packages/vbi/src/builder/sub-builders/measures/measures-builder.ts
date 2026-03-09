import * as Y from 'yjs'
import type { ObserveCallback, VBIMeasure, VBIMeasureGroup, VBIMeasureTree } from 'src/types'
import { MeasureNodeBuilder } from './measure-node-builder'

/**
 * 度量构建器 - 用于构建和管理图表度量
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
   * 添加一个度量
   * @param field - 字段名，如 "sales"、"profit"
   * @param callback - 可选回调，用于进一步配置度量节点
   * @returns 度量节点或自身（支持链式调用）
   */
  addMeasure(field: string, callback?: (node: MeasureNodeBuilder) => void): MeasureNodeBuilder | MeasuresBuilder {
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

  /** 删除指定字段的度量 */
  removeMeasure(field: VBIMeasure['field']) {
    const measures = this.dsl.get('measures')
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('measures').delete(index, 1)
    }
  }

  /** 重命名度量的显示名称 */
  renameMeasure(field: string, newAlias: string): void {
    this.updateMeasure(field, { alias: newAlias })
  }

  /** 更新度量使用的聚合函数（sum/avg/count/max/min/quantile） */
  updateAggregate(field: string, func: string, quantile?: number): void {
    const measures = this.dsl.get('measures') as Y.Array<any>
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Measure with field "${field}" not found`)
    }

    const measureYMap = measures.get(index)
    // Create a new Y.Map for aggregate to ensure it's properly typed
    const newAggregate = new Y.Map()
    newAggregate.set('func', func)
    if (func === 'quantile' && quantile !== undefined) {
      newAggregate.set('quantile', quantile)
    }
    // Replace the entire aggregate object
    measureYMap.set('aggregate', newAggregate)
  }

  /** 更新度量的图表编码位置（yAxis/xAxis/color 等） */
  updateEncoding(field: string, encoding: VBIMeasure['encoding']): void {
    this.updateMeasure(field, { encoding })
  }

  /** 更新度量使用的聚合函数（modifyAggregate 的别名） */
  modifyAggregate = this.updateAggregate.bind(this)

  /** 更新度量的图表编码位置（modifyEncoding 的别名） */
  modifyEncoding = this.updateEncoding.bind(this)

  updateMeasure(field: string, updates: Partial<Omit<VBIMeasure, 'field'>>): void {
    const measures = this.dsl.get('measures') as Y.Array<any>
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Measure with field "${field}" not found`)
    }

    const measureYMap = measures.get(index)
    for (const [key, value] of Object.entries(updates)) {
      measureYMap.set(key, value)
    }
  }

  /** 根据字段名查找度量 */
  find(field: VBIMeasure['field']): VBIMeasure | undefined {
    const measures = this.dsl.get('measures').toJSON() as VBIMeasure[]
    return measures.find((m) => m.field === field)
  }

  /** 获取所有度量 */
  findAllMeasures(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON() as VBIMeasure[]
  }

  /** 导出所有度量为 JSON 数组 */
  toJson(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON() as VBIMeasure[]
  }

  /** 监听度量变化 */
  observe(callback: ObserveCallback) {
    this.dsl.get('measures').observe(callback)
  }

  /** 取消监听度量变化 */
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
