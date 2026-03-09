import * as Y from 'yjs'
import { VBIMeasure } from '../../../types'

export class MeasureNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  setEncoding(encoding: VBIMeasure['encoding']): this {
    this.yMap.set('encoding', encoding)
    return this
  }

  setAggregate(aggregate: VBIMeasure['aggregate']): this {
    this.yMap.set('aggregate', aggregate)
    return this
  }

  /**
   * 将当前配置转换为 JSON 对象
   * @returns VBIMeasure JSON 对象
   */
  toJson(): VBIMeasure {
    return this.yMap.toJSON() as VBIMeasure
  }

  /**
   * @deprecated 请使用 toJson() 方法
   */
  build(): VBIMeasure {
    return this.toJson()
  }
}
