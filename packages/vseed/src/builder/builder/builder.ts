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
import { prepare } from './prepare'
import { intl } from 'src/i18n'
import { getColorIdMap, getColorItems } from './advanced'

export class Builder<S extends Spec = Spec> implements VSeedBuilder {
  private _vseed: VSeed
  private _advancedVSeed: AdvancedVSeed | null = null
  private _spec: Spec | null = null
  private _performance: Record<string, string | number> = {}

  private _locale: Locale

  private _isPrepared: boolean = false

  /**
   * @description 初始化 Builder 实例
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
   * @description 异步执行动态过滤器代码。在 build() 前调用，用于执行 dynamicFilter 中的 code。幂等方法，多次调用不会重复执行
   */
  prepare = async (): Promise<void> => prepare(this)

  /**
   * @description 生成最终的图表配置 (Spec)。这是最常用的核心方法。如果配置中包含 dynamicFilter code，需要先调用 prepare()
   */
  build = <T = S>(): T => build(this) as T

  /**
   * @description 将中间层配置 (AdvancedVSeed) 转换为最终 Spec。仅当你需要深度定制中间层配置时使用
   */
  buildSpec = <T = S>(advanced: AdvancedVSeed): T => buildSpec(this, advanced) as T

  /**
   * @description 生成中间层配置 (AdvancedVSeed)，即图表模版。比原始 VSeed 更详细，暴露了更多图表细节
   */
  buildAdvanced = (): AdvancedVSeed | null => buildAdvanced(this)

  /**
   * @description 获取数据中涉及颜色的字段信息。常用于生成图表的图例或颜色筛选器 UI
   */
  getColorItems = () => getColorItems(this)

  /**
   * @description 获取颜色字段的详细映射表。Key 为颜色 ID，Value 为详细信息
   */
  getColorIdMap = () => getColorIdMap(this)

  /**
   * @description 获取当前的 VSeed 输入数据
   */
  get vseed() {
    return this._vseed
  }

  /**
   * @description 更新 VSeed 输入数据。更新后会清除 prepare() 的缓存状态
   */
  set vseed(value) {
    this._vseed = value
    this._isPrepared = false
  }

  /**
   * @description 获取 prepare() 状态
   */
  get isPrepared() {
    return this._isPrepared
  }

  /**
   * @description 设置 prepare() 状态
   */
  set isPrepared(value: boolean) {
    this._isPrepared = value
  }

  /**
   * @description 获取当前的 AdvancedVSeed 中间配置对象
   */
  get advancedVSeed() {
    return this._advancedVSeed
  }

  /**
   * @description 设置 AdvancedVSeed 中间配置对象。通常用于缓存或复用已有的中间配置
   */
  set advancedVSeed(value) {
    this._advancedVSeed = value
  }

  /**
   * @description 获取当前生成的最终 Spec 对象
   */
  get spec() {
    return this._spec
  }

  /**
   * @description 设置 Spec 对象。通常用于缓存
   */
  set spec(value) {
    this._spec = value
  }

  /**
   * @description 获取构建过程中的性能统计信息。包含各阶段耗时 (单位: ms)
   */
  get performance() {
    return this._performance
  }

  /**
   * @description 设置性能统计信息
   */
  set performance(value) {
    this._performance = value
  }

  /**
   * @description [内部方法] 获取指定图表类型的模版构建管线，用于调试 VSeed 到 AdvancedVSeed 的转换过程
   */
  static getAdvancedPipeline = (chartType: ChartType) => {
    const customPipe = Builder._customAdvancedPipe[chartType] as AdvancedPipe
    const originalPipeline = Builder._advancedPipelineMap[chartType] as AdvancedPipeline
    if (!originalPipeline) return originalPipeline

    const pipeline = [...originalPipeline]
    if (customPipe) {
      pipeline.push(customPipe)
    }
    return pipeline
  }

  /**
   * @description [内部方法] 获取指定图表类型的 Spec 构建管线，用于调试 AdvancedVSeed 到 Spec 的转换过程
   */
  static getSpecPipeline = (chartType: ChartType) => {
    const customPipe = Builder._customSpecPipe[chartType] as SpecPipe
    const originalPipeline = Builder._specPipelineMap[chartType] as SpecPipeline
    if (!originalPipeline) return originalPipeline

    const pipeline = [...originalPipeline]
    if (customPipe) {
      pipeline.push(customPipe)
    }
    return pipeline
  }

  /**
   * @description 获取指定主题的配置。不传 themeKey 默认返回 'light' 主题
   */
  static getTheme = (themeKey?: string): CustomThemeConfig => Builder._themeMap[themeKey || 'light']

  /**
   * @description 获取所有已注册的主题配置
   */
  static getThemeMap = (): Record<string, CustomThemeConfig> => Builder._themeMap

  /**
   * @description 静态工厂方法，用于便捷地创建 Builder 实例
   */
  static from = <T extends Spec = Spec>(vseed: VSeed) => new Builder<T>(vseed)

  /**
   * @description [扩展方法] 注册新图表类型的模版构建管线
   */
  static registerAdvancedPipeline = (chartType: ChartType, pipeline: AdvancedPipeline) => {
    Builder._advancedPipelineMap[chartType] = pipeline
  }

  /**
   * @description [扩展方法] 注册新图表类型的 Spec 构建管线
   */
  static registerSpecPipeline = (chartType: ChartType, pipeline: SpecPipeline) => {
    Builder._specPipelineMap[chartType] = pipeline
  }

  /**
   * @description [扩展方法] 修改现有图表的模版构建逻辑，插入自定义 Pipe 影响生成的 AdvancedVSeed
   */
  static updateAdvanced = (chartType: ChartType, pipe: AdvancedPipe) => {
    Builder._customAdvancedPipe[chartType] = pipe
  }

  /**
   * @description [扩展方法] 修改现有图表的 Spec 构建逻辑，插入自定义 Pipe 影响生成的最终 Spec
   */
  static updateSpec = (chartType: ChartType, pipe: SpecPipe) => {
    Builder._customSpecPipe[chartType] = pipe
  }

  /**
   * @description [扩展方法] 注册自定义主题
   */
  static registerTheme = (key: string, theme: CustomThemeConfig) => {
    Builder._themeMap[key] = theme
  }

  private static _advancedPipelineMap: Partial<Record<ChartType, AdvancedPipeline>> = {}
  private static _specPipelineMap: Partial<Record<ChartType, SpecPipeline>> = {}
  private static _customAdvancedPipe: Partial<Record<ChartType, AdvancedPipe>> = {}
  private static _customSpecPipe: Partial<Record<ChartType, SpecPipe>> = {}
  private static _themeMap: Record<string, CustomThemeConfig> = {}
}
