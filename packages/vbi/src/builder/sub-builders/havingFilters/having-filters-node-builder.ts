import * as Y from 'yjs'
import { VBIHavingFilter, FilterOperator, LogicalOperator } from '../../../types'
import { zVBIHavingFilter } from '../../../types/dsl/havingFilters/having'
import type { ZodIssue } from 'zod'

/**
 * Having 过滤节点构建器 - 用于配置单个 Having 过滤条件
 * 提供链式 API（如：setValue().setOperator().toJson()）
 */
export class HavingFiltersNodeBuilder {
  private validationErrors: string[] = []

  constructor(private yMap: Y.Map<any>) {}

  /** 设置过滤条件的值 */
  setValue(value: unknown): this {
    this.yMap.set('value', value)
    return this
  }

  /** 设置过滤操作符（eq/neq/gt/gte/lt/lte/contains 等） */
  setOperator(operator: FilterOperator): this {
    const validOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith', 'between']
    if (!validOperators.includes(operator)) {
      this.validationErrors.push(`Invalid operator: "${operator}". Valid options: ${validOperators.join(', ')}`)
      return this
    }
    this.yMap.set('operator', operator)
    return this
  }

  /** 设置多条件组合逻辑（and/or） */
  setLogical(logical: LogicalOperator): this {
    if (logical !== 'and' && logical !== 'or') {
      this.validationErrors.push('Logical must be either "and" or "or"')
      return this
    }
    this.yMap.set('logical', logical)
    return this
  }

  /** 导出为 JSON（自动验证） */
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

  /** @deprecated 请使用 toJson() 方法 */
  build(): VBIHavingFilter {
    return this.toJson()
  }

  /** 获取验证错误列表 */
  getValidationErrors(): string[] {
    return [...this.validationErrors]
  }

  /** 检查是否有验证错误 */
  hasValidationErrors(): boolean {
    return this.validationErrors.length > 0
  }

  /** 清除验证错误 */
  clearValidationErrors(): void {
    this.validationErrors = []
  }
}
