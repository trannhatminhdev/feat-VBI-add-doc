import * as Y from 'yjs'
import { VBIMeasure } from '../../../types'

export class MeasureNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /** 获取字段名 */
  getField(): string {
    return this.yMap.get('field')
  }

  /** 设置度量显示名称 */
  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  /** 设置图表编码位置（yAxis/xAxis/color 等） */
  setEncoding(encoding: VBIMeasure['encoding']): this {
    this.yMap.set('encoding', encoding)
    return this
  }

  /** 设置聚合函数（sum/avg/count/max/min 等） */
  setAggregate(aggregate: VBIMeasure['aggregate']): this {
    this.yMap.set('aggregate', aggregate)
    return this
  }

  /** 导出为 JSON */
  toJson(): VBIMeasure {
    return this.yMap.toJSON() as VBIMeasure
  }

  /** @deprecated 请使用 toJson() 方法 */
  build(): VBIMeasure {
    return this.toJson()
  }
}
