import * as Y from 'yjs'
import type { ObserveDeepCallback, VBIDimension, VBIDimensionGroup, VBIDimensionTree } from 'src/types'
import { DimensionNodeBuilder } from './dim-node-builder'
import { id } from 'src/utils'
import { getOrCreateDimensions, locateDimensionIndexById, normalizeDimensionNodeIds } from './dimension-utils'
import { getRecommendedDimensionEncodingsForChartType } from '../chart-type/dimension-encoding'

/**
 * @description 维度构建器，用于添加、修改、删除维度配置。维度是数据的分类字段，如：时间、地区、产品类别
 */
export class DimensionsBuilder {
  private doc: Y.Doc
  private dsl: Y.Map<any>
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl

    doc.transact(() => {
      const dimensions = getOrCreateDimensions(this.dsl)
      normalizeDimensionNodeIds(dimensions)
    })
  }

  /**
   * @description 添加一个维度
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder {
    const dimensions = getOrCreateDimensions(this.dsl)
    const chartType = this.dsl.get('chartType') || 'table'
    const [encoding] = getRecommendedDimensionEncodingsForChartType(chartType, dimensions.length + 1).slice(-1)
    const dimension: VBIDimension = {
      id: id.uuid(),
      alias: field,
      field,
      encoding,
    }

    const yMap = new Y.Map<any>()
    this.doc.transact(() => {
      for (const [key, value] of Object.entries(dimension)) {
        yMap.set(key, value)
      }

      const dimensions = getOrCreateDimensions(this.dsl)
      dimensions.push([yMap])
      const node = new DimensionNodeBuilder(yMap)
      callback(node)
    })

    return this
  }

  /**
   * @description 删除指定 ID 的维度
   * @param id - 维度 ID
   */
  remove(id: string): DimensionsBuilder {
    this.doc.transact(() => {
      const dimensions = getOrCreateDimensions(this.dsl)
      const index = locateDimensionIndexById(dimensions, id)
      if (index !== -1) {
        dimensions.delete(index, 1)
      }
    })
    return this
  }

  /**
   * @description 更新指定维度 ID 的配置
   * @param id - 维度 ID
   * @param callback - 回调函数
   */
  update(id: string, callback: (node: DimensionNodeBuilder) => void): DimensionsBuilder {
    this.doc.transact(() => {
      const dimensions = getOrCreateDimensions(this.dsl)
      const index = locateDimensionIndexById(dimensions, id)

      if (index === -1) {
        throw new Error(`Dimension with id "${id}" not found`)
      }

      const dimensionYMap = dimensions.get(index)
      const node = new DimensionNodeBuilder(dimensionYMap)
      callback(node)
    })
    return this
  }

  /**
   * @description 按回调条件查找第一个维度，行为与 Array.find 一致
   * @param predicate - 查找条件
   */
  find(predicate: (node: DimensionNodeBuilder, index: number) => boolean): DimensionNodeBuilder | undefined {
    const dimensions = getOrCreateDimensions(this.dsl)
    const items = dimensions.toArray() as Y.Map<any>[]
    for (let index = 0; index < items.length; index++) {
      const node = new DimensionNodeBuilder(items[index])
      if (predicate(node, index)) {
        return node
      }
    }
    return undefined
  }

  /**
   * @description 获取所有维度
   */
  findAll(): DimensionNodeBuilder[] {
    const dimensions = getOrCreateDimensions(this.dsl)
    return dimensions.toArray().map((yMap: any) => new DimensionNodeBuilder(yMap))
  }

  /**
   * @description 导出所有维度为 JSON 数组
   */
  toJSON(): VBIDimension[] {
    const dimensions = getOrCreateDimensions(this.dsl)
    return dimensions.toJSON() as VBIDimension[]
  }

  /**
   * @description 监听维度变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveDeepCallback): () => void {
    const dimensions = getOrCreateDimensions(this.dsl)
    dimensions.observeDeep(callback)
    return () => {
      dimensions.unobserveDeep(callback)
    }
  }

  static isDimensionNode(node: VBIDimensionTree[0]): node is VBIDimension {
    return 'alias' in node && !('children' in node)
  }

  static isDimensionGroup(node: VBIDimensionTree[0]): node is VBIDimensionGroup {
    return 'children' in node
  }
}
