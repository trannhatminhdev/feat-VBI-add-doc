import * as Y from 'yjs'
import { VBIHavingFilter } from '../../../types'
import { zVBIHavingFilter } from '../../../types/dsl/havingFilters/having'
import type { ZodIssue } from 'zod'

/**
 * @description Having 过滤节点构建器 - 用于配置单个 Having 过滤条件
 * 提供链式 API（如：value().operator().toJson()）
 */
export class HavingFiltersNodeBuilder {
  private validationErrors: string[] = []

  constructor(private yMap: Y.Map<any>) {}

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
   * @description 导出为 JSON（自动验证）
   * @returns 过滤条件 JSON
   */
  toJson(): VBIHavingFilter {
    const data = this.yMap.toJSON() as VBIHavingFilter
    const result = zVBIHavingFilter.safeParse(data)

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue: ZodIssue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ')
      throw new Error(`HavingFilter validation failed: ${errorMessages}`)
    }

    return result.data
  }

  /**
   * @description 导出为 JSON（自动验证）
   * @returns 过滤条件 JSON
   * @deprecated 请使用 toJson() 方法
   */
  build(): VBIHavingFilter {
    return this.toJson()
  }

  /**
   * @description 获取验证错误列表
   * @returns 验证错误数组
   */
  getValidationErrors(): string[] {
    return [...this.validationErrors]
  }

  /**
   * @description 检查是否有验证错误
   * @returns 是否有错误
   */
  hasValidationErrors(): boolean {
    return this.validationErrors.length > 0
  }

  /**
   * @description 清除验证错误
   */
  clearValidationErrors(): void {
    this.validationErrors = []
  }
}
