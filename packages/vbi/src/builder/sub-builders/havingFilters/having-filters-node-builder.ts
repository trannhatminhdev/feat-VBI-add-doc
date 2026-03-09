import * as Y from 'yjs'
import { VBIHavingFilter } from '../../../types'

/**
 * @description Having 过滤节点构建器 - 用于配置单个 Having 过滤条件
 * 提供链式 API（如：setValue().setOperator().toJson()）
 */
export class HavingFiltersNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /** 获取字段名 */
  getField(): string {
    return this.yMap.get('field')
  }

  /**
   * @description 设置过滤条件的值
   * @param value - 过滤值
   * @returns 自身
   */
  setValue(value: unknown): this {
    this.yMap.set('value', value)
    return this
  }

  /**
   * @description 设置过滤操作符
   * @param operator - 操作符（eq/neq/gt/gte/lt/lte/contains 等）
   * @returns 自身
   */
  setOperator(operator: string): this {
    this.yMap.set('operator', operator)
    return this
  }

  /**
   * @description 导出为 JSON
   * @returns 过滤条件 JSON
   */
  toJson(): VBIHavingFilter {
    return this.yMap.toJSON() as VBIHavingFilter
  }

  /**
   * @description 导出为 JSON
   * @returns 过滤条件 JSON
   * @deprecated 请使用 toJson() 方法
   */
  build(): VBIHavingFilter {
    return this.toJson()
  }
}
