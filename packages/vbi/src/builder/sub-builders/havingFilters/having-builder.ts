import * as Y from 'yjs'
import type { VBIHavingFilter } from 'src/types'
import { HavingFiltersNodeBuilder } from './having-node-builder'
import type { YArrayEvent, Transaction } from 'yjs'

/**
 * @description Having 过滤构建器，用于添加、修改、删除分组后过滤条件。Having 过滤在数据聚合后生效，用于筛选分组结果
 */
export class HavingFiltersBuilder {
  private dsl: Y.Map<any>

  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 添加一个 Having 过滤条件
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder {
    if (!field || typeof field !== 'string') {
      throw new Error('Field is required and must be a string')
    }

    const defaultFilter: VBIHavingFilter = {
      field,
      operator: 'eq',
      value: null,
    }

    const yMap = new Y.Map<any>()
    for (const [key, value] of Object.entries(defaultFilter)) {
      yMap.set(key, value)
    }
    this.dsl.get('havingFilters').push([yMap])

    const filterNode = new HavingFiltersNodeBuilder(yMap)

    callback(filterNode)
    return this
  }

  /**
   * @description 更新指定字段的过滤条件
   * @param field - 字段名
   * @param callback - 回调函数
   */
  update(field: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      throw new Error(`Having filter with field "${field}" not found`)
    }

    const filterYMap = havingFilters.get(index)
    const node = new HavingFiltersNodeBuilder(filterYMap)
    callback(node)
    return this
  }

  /**
   * @description 根据字段名删除 Having 过滤条件
   * @param field - 字段名
   */
  remove(field: string): HavingFiltersBuilder {
    if (!field || typeof field !== 'string') {
      console.error('[HavingFiltersBuilder] Invalid field name:', field)
    }

    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index !== -1) {
      this.dsl.get('havingFilters').delete(index, 1)
    }
    return this
  }

  /**
   * @description 根据字段名查找 Having 过滤条件
   * @param field - 字段名
   */
  find(field: string): HavingFiltersNodeBuilder | undefined {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('field') === field)

    if (index === -1) {
      return undefined
    }

    return new HavingFiltersNodeBuilder(havingFilters.get(index))
  }

  /**
   * @description 获取所有 Having 过滤条件
   */
  findAll(): HavingFiltersNodeBuilder[] {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    return havingFilters.toArray().map((yMap: any) => new HavingFiltersNodeBuilder(yMap))
  }

  /**
   * @description 清空所有 Having 过滤条件
   */
  clear(): this {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    if (havingFilters.length > 0) {
      havingFilters.delete(0, havingFilters.length)
    }
    return this
  }

  /**
   * @description 导出所有 Having 过滤条件为 JSON 数组
   */
  toJson(): VBIHavingFilter[] {
    return (this.dsl.get('havingFilters') as Y.Array<any>).toJSON() as VBIHavingFilter[]
  }

  /**
   * @description 监听过滤条件变化
   * @param callback - 回调函数
   */
  /**
   * @description 监听过滤条件变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: (e: YArrayEvent<any>, trans: Transaction | null) => void): () => void {
    this.dsl.get('havingFilters').observe(callback)
    return () => {
      this.dsl.get('havingFilters').unobserve(callback)
    }
  }
}
