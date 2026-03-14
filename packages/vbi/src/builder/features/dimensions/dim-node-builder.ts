import * as Y from 'yjs'
import { VBIDimension } from '../../../types'

/**
 * @description 维度节点构建器，用于配置单个维度
 */
export class DimensionNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

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
   * @description 导出为 JSON
   */
  toJson(): VBIDimension {
    return this.yMap.toJSON() as VBIDimension
  }
}
