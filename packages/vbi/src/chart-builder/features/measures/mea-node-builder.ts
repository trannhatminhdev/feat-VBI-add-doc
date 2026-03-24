import * as Y from 'yjs'
import type { VBIMeasure, VBIMeasureFormat, VBISort } from 'src/types'

/**
 * @description 度量节点构建器，用于配置单个度量
 */
export class MeasureNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /**
   * @description 获取节点 ID
   */
  getId(): string {
    return this.yMap.get('id')
  }

  /**
   * @description 获取字段名
   */
  getField(): string {
    return this.yMap.get('field')
  }

  /**
   * @description 获取图表编码位置
   */
  getEncoding(): VBIMeasure['encoding'] | undefined {
    return this.yMap.get('encoding')
  }

  /**
   * @description 获取排序配置
   */
  getSort(): VBISort | undefined {
    return this.yMap.get('sort')
  }

  /**
   * @description 设置显示名称
   * @param alias - 显示名称
   */
  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  /**
   * @description 设置图表编码位置
   * @param encoding - 指标编码位置
   */
  setEncoding(encoding: NonNullable<VBIMeasure['encoding']>): this {
    this.yMap.set('encoding', encoding)
    return this
  }

  /**
   * @description 设置排序配置
   * @param sort - 排序配置
   */
  setSort(sort: VBISort): this {
    this.yMap.set('sort', sort)
    return this
  }

  /**
   * @description 设置聚合函数
   * @param aggregate - 聚合配置
   */
  setAggregate(aggregate: VBIMeasure['aggregate']): this {
    this.yMap.set('aggregate', aggregate)
    return this
  }

  /**
   * @description 设置数值格式
   * @param format - 格式配置
   */
  setFormat(format: VBIMeasureFormat): this {
    this.yMap.set('format', format)
    return this
  }

  /**
   * @description 获取数值格式
   */
  getFormat(): VBIMeasureFormat | undefined {
    return this.yMap.get('format')
  }

  /**
   * @description 清除数值格式配置
   */
  clearFormat(): this {
    this.yMap.delete('format')
    return this
  }

  /**
   * @description 清除排序配置
   */
  clearSort(): this {
    this.yMap.delete('sort')
    return this
  }

  /**
   * @description 导出为 JSON
   */
  toJSON(): VBIMeasure {
    return this.yMap.toJSON() as VBIMeasure
  }
}
