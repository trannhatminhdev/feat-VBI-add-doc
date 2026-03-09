import * as Y from 'yjs'
import type { VBIFilter, ObserveCallback } from 'src/types'

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

  addWhereFilter(filter: VBIFilter) {
    const yMap = new Y.Map<any>()
    for (const [key, value] of Object.entries(filter)) {
      yMap.set(key, value)
    }
    this.dsl.get('whereFilters').push([yMap])
    return this
  }

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

  removeWhereFilter(index: number) {
    const whereFilters = this.dsl.get('whereFilters')
    if (index >= 0 && index < whereFilters.length) {
      whereFilters.delete(index, 1)
    }
    return this
  }

  clearWhereFilters() {
    const whereFilters = this.dsl.get('whereFilters')
    whereFilters.delete(0, whereFilters.length)
    return this
  }

  /**
   * 获取所有筛选条件
   * @returns 筛选条件数组
   * @deprecated 请使用 toJson() 方法
   */
  getWhereFilters(): VBIFilter[] {
    return this.dsl.get('whereFilters').toJSON()
  }

  /**
   * 将当前所有筛选条件转换为 JSON 数组
   * @returns 筛选条件 JSON 数组
   */
  toJson(): VBIFilter[] {
    return this.dsl.get('whereFilters').toJSON() as VBIFilter[]
  }

  observe(callback: ObserveCallback) {
    this.dsl.get('whereFilters').observe(callback)
  }

  unobserve(callback: ObserveCallback) {
    this.dsl.get('whereFilters').unobserve(callback)
  }
}
