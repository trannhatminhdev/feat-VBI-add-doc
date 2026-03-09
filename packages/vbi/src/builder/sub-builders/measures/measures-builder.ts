import * as Y from 'yjs'
import type { ObserveCallback, VBIMeasure, VBIMeasureGroup, VBIMeasureTree } from 'src/types'
import { MeasureNodeBuilder } from './measure-node-builder'

export class MeasuresBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

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

  removeMeasure(field: VBIMeasure['field']) {
    const measures = this.dsl.get('measures')
    const index = measures.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('measures').delete(index, 1)
    }
  }

  renameMeasure(field: string, newAlias: string): void {
    this.updateMeasure(field, { alias: newAlias })
  }

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

  updateEncoding(field: string, encoding: VBIMeasure['encoding']): void {
    this.updateMeasure(field, { encoding })
  }

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

  /**
   * 获取所有度量配置
   * @returns 度量配置数组
   * @deprecated 请使用 toJson() 方法
   */
  getMeasures(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON()
  }

  /**
   * 将当前所有度量配置转换为 JSON 数组
   * @returns 度量配置 JSON 数组
   */
  toJson(): VBIMeasure[] {
    return this.dsl.get('measures').toJSON() as VBIMeasure[]
  }

  observe(callback: ObserveCallback) {
    this.dsl.get('measures').observe(callback)
  }

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
