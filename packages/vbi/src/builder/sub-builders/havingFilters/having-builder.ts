import * as Y from 'yjs'
import type { VBIHavingClause, ObserveCallback } from 'src/types'
import { id } from 'src/utils'
import { createHavingRoot, ensureHavingRoot, findEntry, getHavingConditions, isHavingGroup } from './having-utils'
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

    this.doc.transact(() => {
      if (!this.dsl.get('havingFilter') && !this.dsl.get('havingFilters')) {
        this.dsl.set('havingFilter', createHavingRoot())
        return
      }

      ensureHavingRoot(this.dsl)
    })
  }

  private getRoot(): Y.Map<any> {
    return ensureHavingRoot(this.dsl)
  }

  private getConditions(): Y.Array<any> {
    return getHavingConditions(this.getRoot())
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

    this.getConditions().push([yMap])

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

    this.getConditions().push([yMap])

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
    const havingFilters = this.getConditions()
    const match = findEntry(havingFilters, id)

    if (!match) {
      throw new Error(`Having filter with id ${id} not found`)
    }

    if (!HavingFiltersBuilder.isNode(match.item)) {
      throw new Error(`Item with id ${id} is not a filter`)
    }

    const filterYMap = match.item
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
    const havingFilters = this.getConditions()
    const match = findEntry(havingFilters, id)

    if (!match) {
      throw new Error(`Having group with id ${id} not found`)
    }

    const yMap = match.item
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
    const havingFilters = this.getConditions()

    if (typeof idOrIndex === 'number') {
      if (idOrIndex >= 0 && idOrIndex < havingFilters.length) {
        havingFilters.delete(idOrIndex, 1)
      }
    } else {
      const match = findEntry(havingFilters, idOrIndex)
      if (match) {
        match.collection.delete(match.index, 1)
      }
    }
    return this
  }

  /**
   * @description 根据 ID 查找条件（过滤或分组）
   * @param id - ID
   */
  find(id: string): HavingFiltersNodeBuilder | HavingGroupBuilder | undefined {
    const havingFilters = this.getConditions()
    const match = findEntry(havingFilters, id)
    const yMap = match?.item

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
    const havingFilters = this.getConditions()
    havingFilters.delete(0, havingFilters.length)
    return this
  }

  /**
   * @description 导出所有 Having 过滤条件为 JSON 数组
   */
  toJson(): VBIHavingClause[] {
    return this.getConditions().toJSON() as VBIHavingClause[]
  }

  /**
   * @description 监听过滤条件变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const havingFilter = this.getRoot()
    havingFilter.observeDeep(callback as any)
    return () => {
      havingFilter.unobserveDeep(callback as any)
    }
  }

  /**
   * @description 判断是否为分组节点
   */
  static isGroup(yMap: Y.Map<any>): boolean {
    return isHavingGroup(yMap)
  }

  /**
   * @description 判断是否为叶子节点
   */
  static isNode(yMap: Y.Map<any>): boolean {
    return yMap.get('field') !== undefined
  }
}
