import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'

/**
 * @description 主题构建器，用于设置和获取当前主题
 */
export class ThemeBuilder {
  private dsl: Y.Map<any>

  /**
   * @description 构造函数
   */
  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 监听主题变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('theme')) {
        callback(e, trans)
      }
    }
    this.dsl.observe(wrapper)
    return () => {
      this.dsl.unobserve(wrapper)
    }
  }

  /**
   * @description 设置主题
   * @param theme - 主题名称
   */
  setTheme(theme: string) {
    this.dsl.set('theme', theme)
  }

  /**
   * @description 获取当前主题
   */
  getTheme(): string {
    return this.dsl.get('theme') || 'light'
  }

  /**
   * @description 导出为 JSON
   */
  toJSON(): string {
    return this.getTheme()
  }
}
