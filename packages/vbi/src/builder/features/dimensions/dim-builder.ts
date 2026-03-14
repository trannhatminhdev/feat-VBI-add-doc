import * as Y from 'yjs'
import type { ObserveCallback, VBIDimension, VBIDimensionGroup, VBIDimensionTree } from 'src/types'
import { DimensionNodeBuilder } from './dim-node-builder'

/**
 * @description 维度构建器，用于添加、修改、删除维度配置。维度是数据的分类字段，如：时间、地区、产品类别
 */
export class DimensionsBuilder {
  private dsl: Y.Map<any>
  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 添加一个维度
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder {
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

    callback(node)
    return this
  }

  /**
   * @description 删除指定字段的维度
   * @param field - 字段名
   */
  remove(field: VBIDimension['field']): DimensionsBuilder {
    const dimensions = this.dsl.get('dimensions')
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)
    if (index !== -1) {
      this.dsl.get('dimensions').delete(index, 1)
    }
    return this
  }

  /**
   * @description 更新指定维度字段的配置
   * @param field - 字段名
   * @param callback - 回调函数
   */
  update(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder {
    const dimensions = this.dsl.get('dimensions') as Y.Array<any>
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Dimension with field "${field}" not found`)
    }

    const dimensionYMap = dimensions.get(index)
    const node = new DimensionNodeBuilder(dimensionYMap)
    callback(node)
    return this
  }

  /**
   * @description 根据字段名查找维度
   * @param field - 字段名
   */
  find(field: VBIDimension['field']): DimensionNodeBuilder | undefined {
    const dimensions = this.dsl.get('dimensions') as Y.Array<any>
    const index = dimensions.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return undefined
    }

    return new DimensionNodeBuilder(dimensions.get(index))
  }

  /**
   * @description 获取所有维度
   */
  findAll(): DimensionNodeBuilder[] {
    const dimensions = this.dsl.get('dimensions') as Y.Array<any>
    return dimensions.toArray().map((yMap: any) => new DimensionNodeBuilder(yMap))
  }

  /**
   * @description 导出所有维度为 JSON 数组
   */
  toJSON(): VBIDimension[] {
    return this.dsl.get('dimensions').toJSON() as VBIDimension[]
  }

  /**
   * @description 监听维度变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    this.dsl.get('dimensions').observe(callback)
    return () => {
      this.dsl.get('dimensions').unobserve(callback)
    }
  }

  static isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension {
    return 'alias' in node && !('children' in node)
  }

  static isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup {
    return 'children' in node
  }
}
