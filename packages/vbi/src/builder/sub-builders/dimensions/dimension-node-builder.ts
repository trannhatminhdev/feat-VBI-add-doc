import * as Y from 'yjs'
import { VBIDimension } from '../../../types'

export class DimensionNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  /** 设置维度显示名称 */
  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  /** 导出为 JSON */
  toJson(): VBIDimension {
    return this.yMap.toJSON() as VBIDimension
  }

  /** @deprecated 请使用 toJson() 方法 */
  build(): VBIDimension {
    return this.toJson()
  }
}
