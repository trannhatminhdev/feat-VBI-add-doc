import * as Y from 'yjs'
import type { VBIHavingFilter } from 'src/types'
import { materialize } from '../../../utils'
import { HavingFiltersNodeBuilder } from './having-filters-node-builder'
import type { YArrayEvent, Transaction } from 'yjs'

/**
 * HavingFiltersBuilder - 用于构建和管理筛选条件
 * 支持添加、删除、修改筛选条件
 */
export class HavingFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

  /**
   * 添加筛选条件
   * @param field - 字段名
   * @param operator - 操作符
   * @param value - 筛选值
   * @returns HavingFiltersNodeBuilder 或 HavingFiltersBuilder（链式调用）
   */
  addFilter(field: string, operator: string, value: unknown): HavingFiltersNodeBuilder
  addFilter(
    field: string,
    operator: string,
    value: unknown,
    callback: (node: HavingFiltersNodeBuilder) => void,
  ): HavingFiltersBuilder
  addFilter(
    field: string,
    operator: string,
    value: unknown,
    callback?: (node: HavingFiltersNodeBuilder) => void,
  ): HavingFiltersNodeBuilder | HavingFiltersBuilder {
    if (!field || typeof field !== 'string') {
      throw new Error('Field is required and must be a string')
    }

    const defaultFilter: VBIHavingFilter = {
      field,
      operator: operator as any,
      value,
    }

    const yMap = materialize(defaultFilter) as Y.Map<any>
    this.dsl.get('havingFilters').push([yMap])

    const filterNode = new HavingFiltersNodeBuilder(yMap)

    if (callback) {
      callback(filterNode)
      return this
    } else {
      return filterNode
    }
  }

  /**
   * 移除筛选条件
   * @param field - 字段名
   * @returns 是否成功移除
   */
  removeFilter(field: string): boolean {
    if (!field || typeof field !== 'string') {
      console.error('[HavingFiltersBuilder] Invalid field name:', field)
      return false
    }

    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index !== -1) {
      this.dsl.get('havingFilters').delete(index, 1)
      return true
    }
    return false
  }

  /**
   * 获取所有筛选条件
   * @returns 筛选条件数组
   */
  getFilters(): VBIHavingFilter[] {
    return (this.dsl.get('havingFilters') as Y.Array<any>).toJSON() as VBIHavingFilter[]
  }

  /**
   * 清空所有筛选条件
   */
  clear(): void {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    if (havingFilters.length > 0) {
      havingFilters.delete(0, havingFilters.length)
    }
  }

  /**
   * 观察筛选条件变化
   * @param callback - 回调函数
   */
  observe(callback: (e: YArrayEvent<any>, trans: Transaction | null) => void): void {
    ;(this.dsl.get('havingFilters') as Y.Array<any>).observe(callback)
  }

  /**
   * 取消观察筛选条件变化
   * @param callback - 回调函数
   */
  unobserve(callback: (e: YArrayEvent<any>, trans: Transaction | null) => void): void {
    ;(this.dsl.get('havingFilters') as Y.Array<any>).unobserve(callback)
  }

  /**
   * 获取筛选条件数量
   */
  getCount(): number {
    return (this.dsl.get('havingFilters') as Y.Array<any>).length
  }

  /**
   * 检查是否为空
   */
  isEmpty(): boolean {
    return this.getCount() === 0
  }
}
