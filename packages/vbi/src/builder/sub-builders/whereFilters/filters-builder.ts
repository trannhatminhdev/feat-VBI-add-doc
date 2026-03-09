import * as Y from 'yjs'
import type { VBIFilter, ObserveCallback } from 'src/types'

/**
 * Where 过滤构建器 - 用于构建 SQL WHERE 条件
 * 这些过滤在数据查询前生效，用于筛选原始数据
 * 例如：只显示 2024 年的数据、排除某些地区
 */
export class WhereFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl

    // Ensure whereFilters array exists in Y.Map
    if (!this.dsl.get('whereFilters')) {
      this.doc.transact(() => {
        this.dsl.set('whereFilters', new Y.Array<any>())
      })
    }
  }

  /** 添加一个 Where 过滤条件 */
  addWhereFilter(filter: VBIFilter) {
    const yMap = new Y.Map<any>()
    for (const [key, value] of Object.entries(filter)) {
      yMap.set(key, value)
    }
    this.dsl.get('whereFilters').push([yMap])
    return this
  }

  /** 更新指定索引的过滤条件 */
  updateWhereFilter(index: number, filter: Partial<VBIFilter>) {
    const whereFilters = this.dsl.get('whereFilters')
    if (index >= 0 && index < whereFilters.length) {
      const oldFilter = whereFilters.get(index)
      const updated = { ...oldFilter.toJSON(), ...filter }
      const yMap = new Y.Map<any>()
      for (const [key, value] of Object.entries(updated)) {
        yMap.set(key, value)
      }
      whereFilters.delete(index, 1)
      whereFilters.insert(index, [yMap])
    }
    return this
  }

  /** 删除指定索引的过滤条件 */
  removeWhereFilter(index: number) {
    const whereFilters = this.dsl.get('whereFilters')
    if (index >= 0 && index < whereFilters.length) {
      whereFilters.delete(index, 1)
    }
    return this
  }

  /** 根据索引查找过滤条件 */
  find(index: number): VBIFilter | undefined {
    const whereFilters = this.dsl.get('whereFilters')
    if (index >= 0 && index < whereFilters.length) {
      return whereFilters.get(index).toJSON() as VBIFilter
    }
    return undefined
  }

  /** 获取所有 Where 过滤条件 */
  findAllWhereFilters(): VBIFilter[] {
    return this.dsl.get('whereFilters').toJSON() as VBIFilter[]
  }

  /** 清空所有 Where 过滤条件 */
  clear() {
    const whereFilters = this.dsl.get('whereFilters')
    whereFilters.delete(0, whereFilters.length)
    return this
  }

  /** 导出所有 Where 过滤条件为 JSON 数组 */
  toJson(): VBIFilter[] {
    return this.dsl.get('whereFilters').toJSON() as VBIFilter[]
  }

  /** 监听过滤条件变化 */
  observe(callback: ObserveCallback) {
    this.dsl.get('whereFilters').observe(callback)
  }

  /** 取消监听过滤条件变化 */
  unobserve(callback: ObserveCallback) {
    this.dsl.get('whereFilters').unobserve(callback)
  }
}
