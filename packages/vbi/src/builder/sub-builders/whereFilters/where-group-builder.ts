import * as Y from 'yjs'
import type { VBIWhereGroup } from 'src/types'
import { WhereFilterNodeBuilder } from './where-node-builder'

/**
 * @description Where 分组构建器，用于配置一组条件的逻辑关系（AND/OR）
 */
export class WhereGroupBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /**
   * @description 获取逻辑操作符
   */
  getOp(): 'and' | 'or' {
    return this.yMap.get('op')
  }

  /**
   * @description 设置逻辑操作符
   * @param op - 逻辑操作符
   */
  setOp(op: 'and' | 'or'): this {
    this.yMap.set('op', op)
    return this
  }

  /**
   * @description 添加一个 Where 过滤条件到分组
   * @param field - 字段名
   * @param callback - 回调函数
   */
  add(field: string, callback: (node: WhereFilterNodeBuilder) => void): this {
    const yMap = new Y.Map<any>()
    yMap.set('field', field)

    const conditions = this.yMap.get('conditions') as Y.Array<any>
    conditions.push([yMap])

    const node = new WhereFilterNodeBuilder(yMap)
    callback(node)
    return this
  }

  /**
   * @description 添加一个嵌套分组到当前分组
   * @param op - 逻辑操作符
   * @param callback - 回调函数
   */
  addGroup(op: 'and' | 'or', callback: (group: WhereGroupBuilder) => void): this {
    const yMap = new Y.Map<any>()
    yMap.set('op', op)
    yMap.set('conditions', new Y.Array<any>())

    const conditions = this.yMap.get('conditions') as Y.Array<any>
    conditions.push([yMap])

    const group = new WhereGroupBuilder(yMap)
    callback(group)
    return this
  }

  /**
   * @description 删除指定字段的过滤条件（仅在当前层级）
   * @param field - 字段名
   */
  remove(field: string): this {
    const conditions = this.yMap.get('conditions') as Y.Array<any>
    const index = conditions.toArray().findIndex((item: any) => item.get('field') === field)

    if (index !== -1) {
      conditions.delete(index, 1)
    }
    return this
  }

  /**
   * @description 删除指定索引的分组
   * @param index - 索引
   */
  removeAt(index: number): this {
    const conditions = this.yMap.get('conditions') as Y.Array<any>
    if (index >= 0 && index < conditions.length) {
      conditions.delete(index, 1)
    }
    return this
  }

  /**
   * @description 清空分组内所有条件
   */
  clear(): this {
    const conditions = this.yMap.get('conditions') as Y.Array<any>
    conditions.delete(0, conditions.length)
    return this
  }

  /**
   * @description 导出为 JSON
   */
  toJson(): VBIWhereGroup {
    return this.yMap.toJSON() as VBIWhereGroup
  }
}
