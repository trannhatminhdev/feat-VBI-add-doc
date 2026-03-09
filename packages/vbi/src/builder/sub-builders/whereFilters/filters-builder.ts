import * as Y from 'yjs'
import type { VBIFilter, ObserveCallback } from 'src/types'
import { WhereFilterNodeBuilder } from './where-filter-node-builder'

/**
 * @description Where 过滤构建器 - 用于构建 SQL WHERE 条件
 * 这些过滤在数据查询前生效，用于筛选原始数据
 * 例如：只显示 2024 年的数据、排除某些地区
 */
export class WhereFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl

    if (!this.dsl.get('whereFilters')) {
      this.doc.transact(() => {
        this.dsl.set('whereFilters', new Y.Array<any>())
      })
    }
  }

  /**
   * @description 添加一个 Where 过滤条件
   * @param field - 字段名
   * @param callback - 可选回调，用于进一步配置过滤节点
   * @returns 自身或节点构建器（支持链式调用）
   */
  add(field: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder {
    const filter: VBIFilter = {
      field,
    }

    const yMap = new Y.Map<any>()
    for (const [key, value] of Object.entries(filter)) {
      yMap.set(key, value)
    }
    this.dsl.get('whereFilters').push([yMap])

    const node = new WhereFilterNodeBuilder(yMap)

    callback(node)
    return this
  }

  /**
   * @description 更新指定字段的过滤条件
   * @param field - 字段名
   * @param callback - 回调函数，用于进一步配置节点
   * @returns 是否成功更新
   */
  update(field: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder {
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const index = whereFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Where filter with field ${field} not found`)
    }

    const filterYMap = whereFilters.get(index)
    const node = new WhereFilterNodeBuilder(filterYMap)
    callback(node)
    return this
  }

  /**
   * @description 删除指定字段的过滤条件
   * @param field - 字段名
   * @returns 是否成功删除
   */
  remove(field: string): WhereFiltersBuilder {
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const index = whereFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return this
    }

    whereFilters.delete(index, 1)
    return this
  }

  /**
   * @description 根据字段名查找过滤条件
   * @param field - 字段名
   * @returns 过滤条件节点构建器
   */
  find(field: string): WhereFilterNodeBuilder | undefined {
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const index = whereFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return undefined
    }

    return new WhereFilterNodeBuilder(whereFilters.get(index))
  }

  /**
   * @description 获取所有 Where 过滤条件
   * @returns 过滤条件节点构建器数组
   */
  findAll(): WhereFilterNodeBuilder[] {
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    return whereFilters.toArray().map((yMap: any) => new WhereFilterNodeBuilder(yMap))
  }

  /**
   * @description 清空所有 Where 过滤条件
   * @returns 自身（支持链式调用）
   */
  clear() {
    const whereFilters = this.dsl.get('whereFilters')
    whereFilters.delete(0, whereFilters.length)
    return this
  }

  /**
   * @description 导出所有 Where 过滤条件为 JSON 数组
   * @returns 过滤条件 JSON 数组
   */
  toJson(): VBIFilter[] {
    return this.dsl.get('whereFilters').toJSON() as VBIFilter[]
  }

  /**
   * @description 监听过滤条件变化
   * @param callback - 回调函数
   */
  observe(callback: ObserveCallback) {
    this.dsl.get('whereFilters').observe(callback)
  }

  /**
   * @description 取消监听过滤条件变化
   * @param callback - 回调函数
   */
  unobserve(callback: ObserveCallback) {
    this.dsl.get('whereFilters').unobserve(callback)
  }
}
