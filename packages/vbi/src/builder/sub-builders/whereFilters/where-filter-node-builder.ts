import * as Y from 'yjs'
import { VBIFilter } from '../../../types'

/**
 * @description Where 过滤节点构建器 - 用于配置单个 Where 过滤条件
 * 提供链式 API（如：setField().setOperator().setValue()）
 */
export class WhereFilterNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /**
   * @description 设置过滤字段
   * @param field - 字段名
   * @returns 自身
   */
  setField(field: string): this {
    this.yMap.set('field', field)
    return this
  }

  /**
   * @description 设置过滤操作符
   * @param operator - 操作符
   * @returns 自身
   */
  setOperator(operator: string): this {
    this.yMap.set('operator', operator)
    return this
  }

  /**
   * @description 设置过滤值
   * @param value - 过滤值
   * @returns 自身
   */
  setValue(value: unknown): this {
    this.yMap.set('value', value)
    return this
  }

  /**
   * @description 导出为 JSON
   * @returns 过滤条件 JSON
   */
  toJson(): VBIFilter {
    return this.yMap.toJSON() as VBIFilter
  }

  /**
   * @description 导出为 JSON
   * @returns 过滤条件 JSON
   * @deprecated 请使用 toJson() 方法
   */
  build(): VBIFilter {
    return this.toJson()
  }
}
