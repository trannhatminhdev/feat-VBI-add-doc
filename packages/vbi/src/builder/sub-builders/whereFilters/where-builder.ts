import * as Y from 'yjs'
import type { VBIWhereClause, ObserveCallback } from 'src/types'
import { id } from 'src/utils'
import { createWhereRoot, ensureWhereRoot, findEntry, getWhereConditions, isWhereGroup } from './where-utils'
import { WhereFilterNodeBuilder } from './where-node-builder'
import { WhereGroupBuilder } from './where-group-builder'

/**
 * @description Where 过滤构建器，用于添加、修改、删除行级过滤条件。Where 过滤在数据查询前生效，用于筛选原始数据
 */
export class WhereFiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl

    this.doc.transact(() => {
      if (!this.dsl.get('whereFilter') && !this.dsl.get('whereFilters')) {
        this.dsl.set('whereFilter', createWhereRoot())
        return
      }

      ensureWhereRoot(this.dsl)
    })
  }

  private getRoot(): Y.Map<any> {
    return ensureWhereRoot(this.dsl)
  }

  private getConditions(): Y.Array<any> {
    return getWhereConditions(this.getRoot())
  }

  /**
   * @description 添加一个 Where 过滤条件
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder {
    const yMap = new Y.Map<any>()
    yMap.set('id', id.uuid())
    yMap.set('field', field)

    this.getConditions().push([yMap])

    const node = new WhereFilterNodeBuilder(yMap)
    callback(node)
    return this
  }

  /**
   * @description 添加一个 Where 分组
   * @param op - 逻辑操作符
   * @param callback - 回调函数
   */
  addGroup(op: 'and' | 'or', callback: (group: WhereGroupBuilder) => void): WhereFiltersBuilder {
    const yMap = new Y.Map<any>()
    yMap.set('id', id.uuid())
    yMap.set('op', op)
    yMap.set('conditions', new Y.Array<any>())

    this.getConditions().push([yMap])

    const group = new WhereGroupBuilder(yMap)
    callback(group)
    return this
  }

  /**
   * @description 更新指定 ID 的过滤条件
   * @param id - 过滤条件 ID
   * @param callback - 回调函数
   */
  update(id: string, callback: (node: WhereFilterNodeBuilder) => void): WhereFiltersBuilder {
    const whereFilters = this.getConditions()
    const match = findEntry(whereFilters, id)

    if (!match) {
      throw new Error(`Where filter with id ${id} not found`)
    }

    if (!WhereFiltersBuilder.isNode(match.item)) {
      throw new Error(`Item with id ${id} is not a filter`)
    }

    const filterYMap = match.item
    const node = new WhereFilterNodeBuilder(filterYMap)
    callback(node)
    return this
  }

  /**
   * @description 更新指定 ID 的分组
   * @param id - 分组 ID
   * @param callback - 回调函数
   */
  updateGroup(id: string, callback: (group: WhereGroupBuilder) => void): WhereFiltersBuilder {
    const whereFilters = this.getConditions()
    const match = findEntry(whereFilters, id)

    if (!match) {
      throw new Error(`Where group with id ${id} not found`)
    }

    const yMap = match.item
    if (!WhereFiltersBuilder.isGroup(yMap)) {
      throw new Error(`Item with id ${id} is not a group`)
    }

    const group = new WhereGroupBuilder(yMap)
    callback(group)
    return this
  }

  /**
   * @description 删除指定 ID 的条件或指定索引的项
   * @param idOrIndex - ID 或索引
   */
  remove(idOrIndex: string | number): WhereFiltersBuilder {
    const whereFilters = this.getConditions()

    if (typeof idOrIndex === 'number') {
      if (idOrIndex >= 0 && idOrIndex < whereFilters.length) {
        whereFilters.delete(idOrIndex, 1)
      }
    } else {
      const match = findEntry(whereFilters, idOrIndex)
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
  find(id: string): WhereFilterNodeBuilder | WhereGroupBuilder | undefined {
    const whereFilters = this.getConditions()
    const match = findEntry(whereFilters, id)
    const yMap = match?.item

    if (!yMap) {
      return undefined
    }

    if (WhereFiltersBuilder.isGroup(yMap)) {
      return new WhereGroupBuilder(yMap)
    }
    return new WhereFilterNodeBuilder(yMap)
  }

  /**
   * @description 清空所有 Where 过滤条件
   */
  clear() {
    const whereFilters = this.getConditions()
    whereFilters.delete(0, whereFilters.length)
    return this
  }

  /**
   * @description 导出所有 Where 过滤条件为 JSON 数组
   */
  toJson(): VBIWhereClause[] {
    return this.getConditions().toJSON() as VBIWhereClause[]
  }

  /**
   * @description 监听过滤条件变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const whereFilter = this.getRoot()
    whereFilter.observeDeep(callback as any)
    return () => {
      whereFilter.unobserveDeep(callback as any)
    }
  }

  /**
   * @description 判断是否为分组节点
   */
  static isGroup(yMap: Y.Map<any>): boolean {
    return isWhereGroup(yMap)
  }

  /**
   * @description 判断是否为叶子节点
   */
  static isNode(yMap: Y.Map<any>): boolean {
    return yMap.get('field') !== undefined
  }
}
