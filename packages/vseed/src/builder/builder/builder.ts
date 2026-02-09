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
import { buildSpec, buildSpecAsync } from './buildSpec'
import { build } from './build'
import { buildAsync } from './buildAsync'
import { intl } from 'src/i18n'
import { getColorIdMap, getColorItems } from './advanced'

export class Builder implements VSeedBuilder {
  private _vseed: VSeed
  private _advancedVSeed: AdvancedVSeed | null = null
  private _spec: Spec | null = null
  private _performance: Record<string, string | number> = {}

  private _locale: Locale

  /**
   * @description 初始化 Builder 实例。
   * @param vseed VSeed 数据对象，包含图表类型、数据和映射配置。
   */
  constructor(vseed: VSeed) {
    this._vseed = vseed
    this._locale = vseed.locale || intl.getLocale()
  }

  /**
   * @description 获取当前 Builder 使用的语言环境。
   * @returns 语言环境代码 (如 'zh-CN', 'en-US')。
   */
  get locale() {
    return this._locale
  }

  /**
   * @description 生成最终的图表配置 (Spec)。
   * 这是最常用的核心方法。拿到 Spec 后，直接传给 VChart 或 VTable 即可渲染图表。
   * @returns VChart 或 VTable 的标准 Spec 对象。
   * @example
   * const spec = builder.build();
   * // const vchart = new VChart(spec, { dom: 'chart-container' });
   * // vchart.render();
   */
  build = <T extends Spec>(): T => build(this) as T

  /**
   * @description 生成最终的图表配置 (Spec)，并在构建前异步执行 dynamicFilter。
   * @returns VChart 或 VTable 的标准 Spec 对象。
   * @example
   * const spec = await builder.buildAsync();
   */
  buildAsync = async <T extends Spec>(): Promise<T> => buildAsync(this) as Promise<T>

  /**
   * @description 将中间层配置 (AdvancedVSeed) 转换为最终 Spec。
   * 仅当你需要深度定制中间层配置时使用。通常流程是：buildAdvanced() -> 修改配置 -> buildSpec()。
   * @param advanced 修改后的 AdvancedVSeed 对象。
   * @returns VChart 或 VTable 的标准 Spec 对象。
   */
  buildSpec = (advanced: AdvancedVSeed): Spec => buildSpec(this, advanced)

  /**
   * @description 将中间层配置 (AdvancedVSeed) 异步转换为最终 Spec，并预执行 dynamicFilter。
   * @param advanced 修改后的 AdvancedVSeed 对象。
   * @returns VChart 或 VTable 的标准 Spec 对象。
   */
  buildSpecAsync = async (advanced: AdvancedVSeed): Promise<Spec> => buildSpecAsync(this, advanced)

  /**
   * @description 生成中间层配置 (AdvancedVSeed)。
   * 中间层配置也就是常说的 "图表模版"，它比原始 VSeed 更详细，暴露了更多图表细节（如坐标轴、图例的具体配置）。
   * 如果默认的 build() 结果不满足需求，可以先获取这个中间配置进行修改，再调用 buildSpec 生成最终结果。
   * @returns AdvancedVSeed 对象 (模版配置)。
   */
  buildAdvanced = (): AdvancedVSeed | null => buildAdvanced(this)

  /**
   * @description 获取数据中涉及颜色的字段信息。
   * 常用于生成图表的图例或颜色筛选器 UI。
   * @returns 颜色字段列表 (包含 id 和别名)。
   */
  getColorItems = () => getColorItems(this)

  /**
   * @description 获取颜色字段的详细映射表。
   * @returns Key 为颜色 ID，Value 为详细信息的对象。
   */
  getColorIdMap = () => getColorIdMap(this)

  /**
   * @description 获取当前的 VSeed 输入数据。
   */
  get vseed() {
    return this._vseed
  }

  /**
   * @description 更新 VSeed 输入数据。
   * 更新后，后续调用 build() 将基于新数据生成。
   * @param value 新的 VSeed 对象。
   */
  set vseed(value) {
    this._vseed = value
  }

  /**
   * @description 获取当前的 AdvancedVSeed 中间配置对象。
   * @returns AdvancedVSeed 对象。
   */
  get advancedVSeed() {
    return this._advancedVSeed
  }

  /**
   * @description 设置 AdvancedVSeed 中间配置对象。
   * 通常用于缓存或复用已有的中间配置。
   * @param value 新的 AdvancedVSeed 对象。
   */
  set advancedVSeed(value) {
    this._advancedVSeed = value
  }

  /**
   * @description 获取当前生成的最终 Spec 对象。
   * @returns Spec 对象。
   */
  get spec() {
    return this._spec
  }

  /**
   * @description 设置 Spec 对象。
   * 通常用于缓存。
   * @param value 新的 Spec 对象。
   */
  set spec(value) {
    this._spec = value
  }

  /**
   * @description 获取构建过程中的性能统计信息。
   * @returns 包含各阶段耗时的对象 (单位: ms)。
   */
  get performance() {
    return this._performance
  }

  /**
   * @description 设置性能统计信息。
   * @param value 新的性能统计对象。
   */
  set performance(value) {
    this._performance = value
  }

  /**
   * @description [内部方法] 获取指定图表类型的模版构建管线。
   * 用于查看或调试该图表类型是如何从 VSeed 转换为 AdvancedVSeed 的。
   * @param chartType 图表类型 (如 'bar', 'line')。
   * @returns AdvancedPipeline 数组。
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
   * @description [内部方法] 获取指定图表类型的 Spec 构建管线。
   * 用于查看或调试该图表类型是如何从 AdvancedVSeed 转换为 Spec 的。
   * @param chartType 图表类型。
   * @returns SpecPipeline 数组。
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
   * @description 获取指定主题的配置。
   * @param themeKey 主题名称 (例如 'light', 'dark')。如果不传，默认为 'light'。
   * @returns 主题配置对象。
   */
  static getTheme = (themeKey?: string) => Builder._themeMap[themeKey || 'light']

  /**
   * @description 获取所有已注册的主题配置。
   * @returns 主题配置映射表。
   */
  static getThemeMap = () => Builder._themeMap

  /**
   * @description 静态工厂方法，用于便捷地创建 Builder 实例。
   * @param vseed VSeed 数据对象。
   * @returns 新的 Builder 实例。
   * @example
   * const builder = Builder.from(vseedJson);
   */
  static from = (vseed: VSeed) => new Builder(vseed)

  /**
   * @description [扩展方法] 注册一个新的图表类型（模版构建阶段）。
   * 如果你要让 Builder 支持一种全新的图表，需要在这里注册它的模版构建逻辑。
   * @param chartType 新图表类型的名称。
   * @param pipeline 处理管道数组。
   */
  static registerAdvancedPipeline = (chartType: ChartType, pipeline: AdvancedPipeline) => {
    Builder._advancedPipelineMap[chartType] = pipeline
  }

  /**
   * @description [扩展方法] 注册一个新的图表类型（Spec 构建阶段）。
   * 如果你要让 Builder 支持一种全新的图表，需要在这里注册它的 Spec 构建逻辑。
   * @param chartType 图表类型。
   * @param pipeline 处理管道数组。
   */
  static registerSpecPipeline = (chartType: ChartType, pipeline: SpecPipeline) => {
    Builder._specPipelineMap[chartType] = pipeline
  }

  /**
   * @description [扩展方法] 修改现有的图表模版构建逻辑。
   * 可以在现有图表的构建流程中插入自定义逻辑（Pipe），从而影响生成的 AdvancedVSeed。
   * @param chartType 目标图表类型。
   * @param pipe 自定义处理函数。
   */
  static updateAdvanced = (chartType: ChartType, pipe: AdvancedPipe) => {
    Builder._customAdvancedPipe[chartType] = pipe
  }

  /**
   * @description [扩展方法] 修改现有的图表 Spec 构建逻辑。
   * 可以在现有图表的构建流程中插入自定义逻辑（Pipe），从而影响生成的最终 Spec。
   * @param chartType 目标图表类型。
   * @param pipe 自定义处理函数。
   */
  static updateSpec = (chartType: ChartType, pipe: SpecPipe) => {
    Builder._customSpecPipe[chartType] = pipe
  }

  /**
   * @description [扩展方法] 注册自定义主题。
   * @param key 主题名称。
   * @param theme 主题配置对象。
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
