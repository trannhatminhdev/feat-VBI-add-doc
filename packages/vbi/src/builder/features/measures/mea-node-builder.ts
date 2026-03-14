import * as Y from 'yjs'
import { VBIMeasure } from '../../../types'

/**
 * @description 度量节点构建器，用于配置单个度量
 */
export class MeasureNodeBuilder {
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
   * @description 设置图表编码位置
   * @param encoding - 编码位置（yAxis/xAxis/color/size）
   */
  setEncoding(encoding: VBIMeasure['encoding']): this {
    this.yMap.set('encoding', encoding)
    return this
  }

  /**
   * @description 设置聚合函数
   * @param aggregate - 聚合配置
   */
  setAggregate(aggregate: VBIMeasure['aggregate']): this {
    this.yMap.set('aggregate', aggregate)
    return this
  }

  /**
   * @description 导出为 JSON
   */
  toJson(): VBIMeasure {
    return this.yMap.toJSON() as VBIMeasure
  }
}
