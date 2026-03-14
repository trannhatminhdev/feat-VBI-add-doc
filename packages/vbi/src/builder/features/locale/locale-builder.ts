import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'

/**
 * @description 语言构建器，用于设置和获取当前语言
 */
export class LocaleBuilder {
  private dsl: Y.Map<any>

  /**
   * @description 构造函数
   */
  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 监听语言变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('locale')) {
        callback(e, trans)
      }
    }
    this.dsl.observe(wrapper)
    return () => {
      this.dsl.unobserve(wrapper)
    }
  }

  /**
   * @description 设置语言
   * @param locale - 语言名称
   */
  setLocale(locale: string) {
    this.dsl.set('locale', locale)
  }

  /**
   * @description 获取当前语言
   */
  getLocale(): string {
    return this.dsl.get('locale') || 'zh-CN'
  }

  /**
   * @description 导出为 JSON
   */
  toJSON(): string {
    return this.getLocale()
  }
}
