import * as Y from 'yjs'
import { VBIDimension } from '../../../types'

export class DimensionNodeBuilder {
  constructor(private yMap: Y.Map<any>) {}

  setAlias(alias: string): this {
    this.yMap.set('alias', alias)
    return this
  }

  /**
   * 将当前配置转换为 JSON 对象
   * @returns VBIDimension JSON 对象
   */
  toJson(): VBIDimension {
    return this.yMap.toJSON() as VBIDimension
  }

  /**
   * @deprecated 请使用 toJson() 方法
   */
  build(): VBIDimension {
    return this.toJson()
  }
}
