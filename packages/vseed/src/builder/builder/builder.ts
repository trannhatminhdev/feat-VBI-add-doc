import type {
  AdvancedPipe,
  AdvancedPipeline,
  AdvancedVSeed,
  ChartType,
  CustomThemeConfig,
  Locale,
  Spec,
  SpecPipe,
  SpecPipeline,
  VSeed,
  VSeedBuilder,
} from 'src/types'
import { buildAdvanced } from './buildAdvanced'
import { buildSpec } from './buildSpec'
import { build } from './build'
import { intl } from 'src/i18n'
import { getColorIdMap, getColorItems } from './advanced'

export class Builder implements VSeedBuilder {
  private _vseed: VSeed
  private _advancedVSeed: AdvancedVSeed | null = null
  private _spec: Spec | null = null
  private _performance: Record<string, string | number> = {}

  private _locale: Locale

  /**
   * @description 创建 Builder 实例
   * @param vseed 完整的 VSeed DSL 对象，包含图表类型、数据集、编码映射等信息
   */
  constructor(vseed: VSeed) {
    this._vseed = vseed
    this._locale = vseed.locale || intl.getLocale()
  }

  /**
   * @description 获取当前 Builder 使用的语言环境
   */
  get locale() {
    return this._locale
  }

  /**
   * @description 构建最终的图表 Spec (VChart Spec 或 VTable Spec)
   * @returns 构建好的 Spec 对象，可直接用于 VChart 或 VTable 渲染
   * @example
   * const spec = builder.build();
   */
  build = <T extends Spec>(): T => build(this) as T

  /**
   * @description 基于给定的高级配置构建 Spec
   * @param advanced 高级配置对象 (AdvancedVSeed)，通常由 buildAdvanced 生成并修改后传入
   * @returns 构建好的 Spec 对象
   */
  buildSpec = (advanced: AdvancedVSeed): Spec => buildSpec(this, advanced)

  /**
   * @description 构建中间层的高级配置 (AdvancedVSeed)
   * AdvancedVSeed 包含了比原始 DSL 更详细、但比最终 Spec 更抽象的配置信息。
   * 用户可以在此基础上进行微调，然后再调用 buildSpec 生成最终 Spec。
   * @returns AdvancedVSeed 对象，如果构建失败则返回 null
   */
  buildAdvanced = (): AdvancedVSeed | null => buildAdvanced(this)

  /**
   * @description 获取当前 DSL 中定义的所有颜色映射项
   * @returns 颜色项数组，包含 id 和 alias
   */
  getColorItems = () => getColorItems(this)

  /**
   * @description 获取颜色 ID 到详细信息的映射表
   * @returns 颜色 ID 映射对象
   */
  getColorIdMap = () => getColorIdMap(this)

  /**
   * @description 获取当前 Builder持有的 VSeed DSL
   * @returns VSeed 对象
   */
  get vseed() {
    return this._vseed
  }

  /**
   * @description 设置 VSeed DSL
   * @param value 新的 VSeed 对象
   */
  set vseed(value) {
    this._vseed = value
  }

  /**
   * @description 获取中间层的 AdvancedVSeed, 用于分离式构建
   * @returns AdvancedVSeed 对象
   */
  get advancedVSeed() {
    return this._advancedVSeed
  }

  /**
   *
   * @description 设置获取中间层的 AdvancedVSeed, 用于分离式构建
   * @param value AdvancedVSeed 对象
   */
  set advancedVSeed(value) {
    this._advancedVSeed = value
  }

  /**
   * @description 获取当前 Builder持有的 Spec
   * @returns Spec 对象
   */
  get spec() {
    return this._spec
  }

  /**
   * @description 设置当前 Builder持有的 Spec
   * @param value Spec 对象
   */
  set spec(value) {
    this._spec = value
  }

  /**
   * @description 获取性能统计信息
   * 包含构建 Spec 和 AdvancedVSeed 各个阶段的耗时
   * @returns 性能统计对象
   */
  get performance() {
    return this._performance
  }

  /**
   * @description 设置性能统计信息
   * @param value 性能统计对象
   */
  set performance(value) {
    this._performance = value
  }

  /**
   * @description 获取指定图表类型的 Advanced Pipeline (高级配置构建管线)
   * @param chartType 图表类型 (如 'bar', 'line', 'pie' 等)
   * @returns AdvancedPipeline 数组
   */
  static getAdvancedPipeline = (chartType: ChartType) => {
    const customPipe = Builder._customAdvancedPipe[chartType] as AdvancedPipe
    const pipeline = Builder._advancedPipelineMap[chartType] as AdvancedPipeline
    if (customPipe) {
      pipeline.push(customPipe)
    }
    return pipeline
  }

  /**
   * @description 获取指定图表类型的 Spec Pipeline (Spec 构建管线)
   * @param chartType 图表类型
   * @returns SpecPipeline 数组
   */

  static getSpecPipeline = (chartType: ChartType) => {
    const customPipe = Builder._customSpecPipe[chartType] as SpecPipe
    const pipeline = Builder._specPipelineMap[chartType] as SpecPipeline
    if (customPipe) {
      pipeline.push(customPipe)
    }
    return pipeline
  }

  /**
   * @description 根据主题 Key 获取主题配置
   * @param themeKey 主题 Key (如 'light', 'dark')，默认为 'light'
   * @example Builder.getTheme('light') // 获取浅色主题配置
   * @returns 主题配置对象
   */
  static getTheme = (themeKey?: string) => Builder._themeMap[themeKey || 'light']

  /**
   * @description 获取所有已注册的主题配置映射表
   * @example Builder.getThemeMap()
   * @returns 主题配置映射表，Key 为主题名，Value 为配置
   */
  static getThemeMap = () => Builder._themeMap

  /**
   * @description 静态工厂方法，从 VSeed DSL 创建 Builder 实例
   * @param vseed 完整的 VSeed DSL 对象
   * @returns 新的 Builder 实例
   * @example
   * const builder = Builder.from(vseedJson);
   */
  static from = (vseed: VSeed) => new Builder(vseed)

  static _advancedPipelineMap: Partial<Record<ChartType, AdvancedPipeline>> = {}
  static _specPipelineMap: Partial<Record<ChartType, SpecPipeline>> = {}
  static _customAdvancedPipe: Partial<Record<ChartType, AdvancedPipe>> = {}
  static _customSpecPipe: Partial<Record<ChartType, SpecPipe>> = {}
  static _themeMap: Record<string, CustomThemeConfig> = {}
}
