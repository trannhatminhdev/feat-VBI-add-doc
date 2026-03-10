import * as Y from 'yjs'
import type { VBIWhereClause, ObserveCallback } from 'src/types'
import { id } from 'src/utils'
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

    if (!this.dsl.get('whereFilters')) {
      this.doc.transact(() => {
        this.dsl.set('whereFilters', new Y.Array<any>())
      })
    }
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

    this.dsl.get('whereFilters').push([yMap])

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

    this.dsl.get('whereFilters').push([yMap])

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
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const index = whereFilters.toArray().findIndex((item: any) => item.get('id') === id)

    if (index === -1) {
      throw new Error(`Where filter with id ${id} not found`)
    }

    const filterYMap = whereFilters.get(index)
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
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const index = whereFilters.toArray().findIndex((item: any) => item.get('id') === id)

    if (index === -1) {
      throw new Error(`Where group with id ${id} not found`)
    }

    const yMap = whereFilters.get(index)
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
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>

    if (typeof idOrIndex === 'number') {
      if (idOrIndex >= 0 && idOrIndex < whereFilters.length) {
        whereFilters.delete(idOrIndex, 1)
      }
    } else {
      const index = whereFilters.toArray().findIndex((item: any) => item.get('id') === idOrIndex)
      if (index !== -1) {
        whereFilters.delete(index, 1)
      }
    }
    return this
  }

  /**
   * @description 根据 ID 查找条件（过滤或分组）
   * @param id - ID
   */
  find(id: string): WhereFilterNodeBuilder | WhereGroupBuilder | undefined {
    const whereFilters = this.dsl.get('whereFilters') as Y.Array<any>
    const yMap = whereFilters.toArray().find((item: any) => item.get('id') === id)

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
    const whereFilters = this.dsl.get('whereFilters')
    whereFilters.delete(0, whereFilters.length)
    return this
  }

  /**
   * @description 导出所有 Where 过滤条件为 JSON 数组
   */
  toJson(): VBIWhereClause[] {
    return this.dsl.get('whereFilters').toJSON() as VBIWhereClause[]
  }

  /**
   * @description 监听过滤条件变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    this.dsl.get('whereFilters').observe(callback)
    return () => {
      this.dsl.get('whereFilters').unobserve(callback)
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
