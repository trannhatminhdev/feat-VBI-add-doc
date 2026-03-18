import * as Y from 'yjs'
import { VBIDimension } from '../../../types'

/**
 * @description 维度节点构建器，用于配置单个维度
 */
export class DimensionNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /**
   * @description 获取节点 ID
   */
  getId(): string {
    return this.yMap.get('id')
  }

  /**
   * @description 获取字段名
   */
  getField(): string {
    return this.yMap.get('field')
  }

  /**
   * @description 设置显示名称
   * @param alias - 显示名称
   */
  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  /**
   * @description 设置日期聚合函数
   * @param aggregate - 日期聚合配置
   */
  setAggregate(aggregate: NonNullable<VBIDimension['aggregate']>): this {
    this.yMap.set('aggregate', aggregate)
    return this
  }

  /**
   * @description 清除日期聚合函数
   */
  clearAggregate(): this {
    this.yMap.delete('aggregate')
    return this
  }

  /**
   * @description 导出为 JSON
   */
  toJSON(): VBIDimension {
    return this.yMap.toJSON() as VBIDimension
  }
}
