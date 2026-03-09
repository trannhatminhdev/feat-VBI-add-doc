import * as Y from 'yjs'
import type { ObserveCallback, VBIDimension, VBIDimensionGroup, VBIDimensionTree } from 'src/types'
import { DimensionNodeBuilder } from './dimension-node-builder'

/**
 * @description 维度构建器 - 用于构建和管理图表维度
 * 维度是数据的分类字段，如：时间、地区、产品类别
 */
export class DimensionsBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

  /**
   * @description 添加一个维度
   * @param field - 字段名，如 "category"、"region"
   * @param callback - 可选回调，用于进一步配置维度节点
   * @returns 维度节点或自身（支持链式调用）
   */
  add(field: string): DimensionNodeBuilder
  add(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder
  add(field: string, callback?: (node: DimensionNodeBuilder) => void): DimensionNodeBuilder | DimensionsBuilder {
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

  /**
   * @description 删除指定字段的维度
   * @param field - 字段名
   */
  remove(field: VBIDimension['field']) {
    const dimensions = this.dsl.get('dimensions')
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('dimensions').delete(index, 1)
    }
  }

  /**
   * @description 更新指定维度字段的配置
   * @param field - 字段名
   * @param updates - 更新的配置
   */
  update(field: string, updates: Partial<Omit<VBIDimension, 'field'>>): void {
    const dimensions = this.dsl.get('dimensions') as Y.Array<any>
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Dimension with field "${field}" not found`)
    }

    const dimensionYMap = dimensions.get(index)
    for (const [key, value] of Object.entries(updates)) {
      dimensionYMap.set(key, value)
    }
  }

  /**
   * @description 根据字段名查找维度
   * @param field - 字段名
   * @returns 维度配置
   */
  find(field: VBIDimension['field']): VBIDimension | undefined {
    const dimensions = this.dsl.get('dimensions').toJSON() as VBIDimension[]
    return dimensions.find((d) => d.field === field)
  }

  /**
   * @description 获取所有维度
   * @returns 维度配置数组
   */
  findAll(): VBIDimension[] {
    return this.dsl.get('dimensions').toJSON() as VBIDimension[]
  }

  /**
   * @description 导出所有维度为 JSON 数组
   * @returns 维度配置 JSON 数组
   */
  toJson(): VBIDimension[] {
    return this.dsl.get('dimensions').toJSON() as VBIDimension[]
  }

  /**
   * @description 监听维度变化
   * @param callback - 回调函数
   */
  observe(callback: ObserveCallback) {
    this.dsl.get('dimensions').observe(callback)
  }

  /**
   * @description 取消监听维度变化
   * @param callback - 回调函数
   */
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
