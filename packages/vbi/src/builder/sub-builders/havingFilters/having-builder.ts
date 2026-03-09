import * as Y from 'yjs'
import type { VBIHavingFilter } from 'src/types'
import { materialize } from '../../../utils'
import { HavingFiltersNodeBuilder } from './having-filters-node-builder'
import type { YArrayEvent, Transaction } from 'yjs'

/**
 * Having 过滤构建器 - 用于构建 SQL HAVING 条件
 * 这些过滤在数据聚合后生效，用于筛选分组结果
 * 例如：只显示销售额 > 1000 的地区、平均分 >= 60 的班级
 */
export class HavingFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
  }

  /**
   * 添加一个 Having 过滤条件
   * @param field - 字段名
   * @param callback - 可选回调，用于进一步配置节点
   * @returns 自身（支持链式调用）
   */
  addFilter(field: string, callback?: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder {
    if (!field || typeof field !== 'string') {
      throw new Error('Field is required and must be a string')
    }

    const defaultFilter: VBIHavingFilter = {
      field,
      operator: 'eq',
      value: null,
    }

    const yMap = materialize(defaultFilter) as Y.Map<any>
    this.dsl.get('havingFilters').push([yMap])

    const filterNode = new HavingFiltersNodeBuilder(yMap)

    if (callback) {
      callback(filterNode)
    }
    return this
  }

  /** 根据字段名删除 Having 过滤条件 */
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

  /** 更新指定字段的过滤条件 */
  updateFilter(field: string, updates: Partial<Omit<VBIHavingFilter, 'field'>>): boolean {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return false
    }

    const filterYMap = havingFilters.get(index)
    for (const [key, value] of Object.entries(updates)) {
      filterYMap.set(key, value)
    }
    return true
  }

  /** 根据字段名查找 Having 过滤条件 */
  find(field: string): VBIHavingFilter | undefined {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return undefined
    }

    return havingFilters.get(index).toJSON() as VBIHavingFilter
  }

  /** 获取所有 Having 过滤条件 */
  findAllHavingFilters(): VBIHavingFilter[] {
    return (this.dsl.get('havingFilters') as Y.Array<any>).toJSON() as VBIHavingFilter[]
  }

  /** 导出所有 Having 过滤条件为 JSON 数组 */
  toJson(): VBIHavingFilter[] {
    return (this.dsl.get('havingFilters') as Y.Array<any>).toJSON() as VBIHavingFilter[]
  }

  /** 清空所有 Having 过滤条件 */
  clear(): void {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    if (havingFilters.length > 0) {
      havingFilters.delete(0, havingFilters.length)
    }
  }

  /** 监听过滤条件变化 */
  observe(callback: (e: YArrayEvent<any>, trans: Transaction | null) => void): void {
    ;(this.dsl.get('havingFilters') as Y.Array<any>).observe(callback)
  }

  /** 取消监听过滤条件变化 */
  unobserve(callback: (e: YArrayEvent<any>, trans: Transaction | null) => void): void {
    ;(this.dsl.get('havingFilters') as Y.Array<any>).unobserve(callback)
  }

  /** 获取过滤条件数量 */
  getCount(): number {
    return (this.dsl.get('havingFilters') as Y.Array<any>).length
  }

  /** 检查是否没有过滤条件 */
  isEmpty(): boolean {
    return this.getCount() === 0
  }
}
