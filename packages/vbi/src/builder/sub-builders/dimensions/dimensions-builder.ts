import * as Y from 'yjs'
import type { ObserveCallback, VBIDimension, VBIDimensionGroup, VBIDimensionTree } from 'src/types'
import { DimensionNodeBuilder } from './dimension-node-builder'

export class DimensionsBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

  addDimension(
    field: string,
    callback?: (node: DimensionNodeBuilder) => void,
  ): DimensionNodeBuilder | DimensionsBuilder {
    const dimension: VBIDimension = {
      alias: field,
      field,
    }

    const yMap = new Y.Map<any>()
    for (const [key, value] of Object.entries(dimension)) {
      yMap.set(key, value)
    }

    this.dsl.get('dimensions').push([yMap])
    const node = new DimensionNodeBuilder(yMap)

    if (callback) {
      callback(node)
      return this
    }
    return node
  }

  removeDimension(field: VBIDimension['field']) {
    const dimensions = this.dsl.get('dimensions')
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('dimensions').delete(index, 1)
    }
  }

  /**
   * 获取所有维度配置
   * @returns 维度配置数组
   * @deprecated 请使用 toJson() 方法
   */
  getDimensions(): VBIDimension[] {
    return this.dsl.get('dimensions').toJSON()
  }

  /**
   * 将当前所有维度配置转换为 JSON 数组
   * @returns 维度配置 JSON 数组
   */
  toJson(): VBIDimension[] {
    return this.dsl.get('dimensions').toJSON() as VBIDimension[]
  }

  observe(callback: ObserveCallback) {
    this.dsl.get('dimensions').observe(callback)
  }

  unobserve(callback: ObserveCallback) {
    this.dsl.get('dimensions').unobserve(callback)
  }

  static isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension {
    return 'alias' in node && !('children' in node)
  }

  static isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup {
    return 'children' in node
  }
}
