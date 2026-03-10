import * as Y from 'yjs'
import type { VBIHavingClause, ObserveCallback } from 'src/types'
import { id } from 'src/utils'
import { HavingFiltersNodeBuilder } from './having-node-builder'
import { HavingGroupBuilder } from './having-group-builder'

/**
 * @description Having 过滤构建器，用于添加、修改、删除分组后过滤条件。Having 过滤在数据聚合后生效，用于筛选分组结果
 */
export class HavingFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl

    if (!this.dsl.get('havingFilters')) {
      this.doc.transact(() => {
        this.dsl.set('havingFilters', new Y.Array<any>())
      })
    }
  }

  /**
   * @description 添加一个 Having 过滤条件
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder {
    const yMap = new Y.Map<any>()
    yMap.set('id', id.uuid())
    yMap.set('field', field)

    this.dsl.get('havingFilters').push([yMap])

    const node = new HavingFiltersNodeBuilder(yMap)
    callback(node)
    return this
  }

  /**
   * @description 添加一个 Having 分组
   * @param op - 逻辑操作符
   * @param callback - 回调函数
   */
  addGroup(op: 'and' | 'or', callback: (group: HavingGroupBuilder) => void): HavingFiltersBuilder {
    const yMap = new Y.Map<any>()
    yMap.set('id', id.uuid())
    yMap.set('op', op)
    yMap.set('conditions', new Y.Array<any>())

    this.dsl.get('havingFilters').push([yMap])

    const group = new HavingGroupBuilder(yMap)
    callback(group)
    return this
  }

  /**
   * @description 更新指定 ID 的过滤条件
   * @param id - 过滤条件 ID
   * @param callback - 回调函数
   */
  update(id: string, callback: (node: HavingFiltersNodeBuilder) => void): HavingFiltersBuilder {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('id') === id)

    if (index === -1) {
      throw new Error(`Having filter with id ${id} not found`)
    }

    const filterYMap = havingFilters.get(index)
    const node = new HavingFiltersNodeBuilder(filterYMap)
    callback(node)
    return this
  }

  /**
   * @description 更新指定 ID 的分组
   * @param id - 分组 ID
   * @param callback - 回调函数
   */
  updateGroup(id: string, callback: (group: HavingGroupBuilder) => void): HavingFiltersBuilder {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const index = havingFilters.toArray().findIndex((item: any) => item.get('id') === id)

    if (index === -1) {
      throw new Error(`Having group with id ${id} not found`)
    }

    const yMap = havingFilters.get(index)
    if (!HavingFiltersBuilder.isGroup(yMap)) {
      throw new Error(`Item with id ${id} is not a group`)
    }

    const group = new HavingGroupBuilder(yMap)
    callback(group)
    return this
  }

  /**
   * @description 删除指定 ID 的条件或指定索引的项
   * @param idOrIndex - ID 或索引
   */
  remove(idOrIndex: string | number): HavingFiltersBuilder {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>

    if (typeof idOrIndex === 'number') {
      if (idOrIndex >= 0 && idOrIndex < havingFilters.length) {
        havingFilters.delete(idOrIndex, 1)
      }
    } else {
      const index = havingFilters.toArray().findIndex((item: any) => item.get('id') === idOrIndex)
      if (index !== -1) {
        havingFilters.delete(index, 1)
      }
    }
    return this
  }

  /**
   * @description 根据 ID 查找条件（过滤或分组）
   * @param id - ID
   */
  find(id: string): HavingFiltersNodeBuilder | HavingGroupBuilder | undefined {
    const havingFilters = this.dsl.get('havingFilters') as Y.Array<any>
    const yMap = havingFilters.toArray().find((item: any) => item.get('id') === id)

    if (!yMap) {
      return undefined
    }

    if (HavingFiltersBuilder.isGroup(yMap)) {
      return new HavingGroupBuilder(yMap)
    }
    return new HavingFiltersNodeBuilder(yMap)
  }

  /**
   * @description 清空所有 Having 过滤条件
   */
  clear() {
    const havingFilters = this.dsl.get('havingFilters')
    havingFilters.delete(0, havingFilters.length)
    return this
  }

  /**
   * @description 导出所有 Having 过滤条件为 JSON 数组
   */
  toJson(): VBIHavingClause[] {
    return this.dsl.get('havingFilters').toJSON() as VBIHavingClause[]
  }

  /**
   * @description 监听过滤条件变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    this.dsl.get('havingFilters').observe(callback)
    return () => {
      this.dsl.get('havingFilters').unobserve(callback)
    }
  }

  /**
   * @description 判断是否为分组节点
   */
  static isGroup(yMap: Y.Map<any>): boolean {
    return yMap.get('op') !== undefined && yMap.get('conditions') !== undefined
  }

  /**
   * @description 判断是否为叶子节点
   */
  static isNode(yMap: Y.Map<any>): boolean {
    return yMap.get('field') !== undefined
  }
}
