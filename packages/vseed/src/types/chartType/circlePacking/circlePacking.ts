import type { Locale } from '../../i18n'
import type {
  BackgroundColor,
  Color,
  Dataset,
  HierarchyDimension,
  HierarchyMeasure,
  Label,
  Page,
  Theme,
  Tooltip,
} from '../../properties'

/**
 * @description 圆形打包图，用于展示层级数据，通过圆的大小表示数值大小
 * 适用场景:
 * - 展示层级数据的占比分布
 * - 强调数据的包含关系
 * @encoding
 * 圆形打包图支持以下视觉通道:
 * `color`: 颜色通道, 支持`多个维度`或 `一个指标`
 * `label`: 标签通道, 支持`多个维度`与 `多个指标`
 * `tooltip`: 提示通道, 支持`多个维度`与 `多个指标`
 * @warning
 * 数据要求:
 * - 至少1个数值字段（度量）用于映射圆的大小
 * - 至少1个维度字段用于层级划分
 */
export interface CirclePacking {
  /**
   * 圆形打包图
   * @description 圆形打包图，展示层级数据的占比关系
   * @type {'circlePacking'}
   * @example 'circlePacking'
   */
  chartType: 'circlePacking'
  /**
   * 数据集
   * @description 符合TidyData规范的且已经聚合的数据集，用于定义图表的数据来源和结构
   * @type {Array<Record<string|number, any>>}
   * @example [{category:'A', value:30}, {category:'B', value:70}]
   */
  dataset: Dataset

  /**
   * 维度
   * @description 维度配置，用于定义数据的层级结构
   * @example [{id: 'category', alias: '类别'}]
   */
  dimensions?: HierarchyDimension[]

  /**
   * 指标
   * @description 指标配置，用于定义圆的大小
   * @example [{id: 'value', alias: '数值'}]
   */
  measures?: HierarchyMeasure[]

  /**
   * 分页配置
   * @description 用于指定分页的字段名, 必须是维度
   */
  page?: Page

  /**
   * 图表的背景颜色
   * @default transparent 默认为透明背景
   * @description 背景颜色可以是颜色字符串, 例如'red', 'blue', 也可以是hex, rgb或rgba'#ff0000', 'rgba(255,0,0,0.5)'
   */
  backgroundColor?: BackgroundColor

  /**
   * 颜色
   * @description 颜色配置, 用于定义图表的颜色方案, 包括颜色列表, 颜色映射, 颜色渐变等.
   */
  color?: Color

  /**
   * 标签
   * @description 标签配置, 用于定义图表的数据标签, 包括数据标签的位置, 格式, 样式等.
   */
  label?: Label

  /**
   * 提示信息
   * @description 提示信息配置, 用于定义图表的提示信息, 包括提示信息的位置, 格式, 样式等.
   */
  tooltip?: Tooltip

  /**
   * 图表的主题
   * @default light 默认为亮色主题
   * @description 内置light与dark两种主题, 用户可以通过Builder自定义主题
   * @example 'dark'
   * @example 'light'
   */
  theme?: Theme

  /**
   * 语言
   * @description 图表语言配置, 支持'zh-CN'与'en-US'两种语言
   * @default 'zh-CN'
   */
  locale?: Locale
}
