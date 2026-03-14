import * as Y from 'yjs'
import type { ObserveCallback, VBIMeasure, VBIMeasureGroup, VBIMeasureTree } from 'src/types'
import { MeasureNodeBuilder } from './mea-node-builder'

/**
 * @description 度量构建器，用于添加、修改、删除度量配置。度量是数据的数值字段，如：销售额、利润、数量
 */
export class MeasuresBuilder {
  private dsl: Y.Map<any>
  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 添加一个度量
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: MeasureNodeBuilder) => void): MeasuresBuilder {
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

    callback(node)
    return this
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
   * @param callback - 回调函数
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
   */
  findAll(): MeasureNodeBuilder[] {
    const measures = this.dsl.get('measures') as Y.Array<any>
    return measures.toArray().map((yMap: any) => new MeasureNodeBuilder(yMap))
  }

  /**
   * @description 导出所有度量为 JSON 数组
   */
  toJSON(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON() as VBIMeasure[]
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
    this.dsl.get('measures').observe(callback)
    return () => {
      this.dsl.get('measures').unobserve(callback)
    }
  }

  static isMeasureNode(node: VBIMeasureTree[0]): node is VBIMeasure {
    return 'encoding' in node || 'aggregate' in node
  }

  static isMeasureGroup(node: VBIMeasureTree[0]): node is VBIMeasureGroup {
    return 'children' in node
  }
}
