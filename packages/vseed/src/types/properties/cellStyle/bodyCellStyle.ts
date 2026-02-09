import { z } from 'zod'
import type { TableDynamicFilter } from '../../dataSelector'
import { zSelector, zSelectors, zTableDynamicFilter, type Selector, type Selectors } from '../../dataSelector'

export type BodyCellStyle = {
  /**
   * 数据选择器
   * @description
   * 若配置selector, 提供数值 selector, 局部数据 selector, 条件维度 selector, 条件指标 selector 共四类数据匹配能力
   * 若未配置selector, 则样式全局生效.
   *
   * 注意: selector 和 dynamicFilter 不能同时使用，dynamicFilter 优先级更高
   *
   * @type {Selector | Selectors}
   * @example 数值选择器
   * selector = "tool"
   * selector = ["tool", "book"]
   * selector = 100
   * selector = [100, 200]
   * @example 局部数据选择器
   * selector = { profit: 100 }
   * selector = [{ profit: 100 }, { profit: 200 }]
   * @example 条件维度选择器
   * selector = {
   *  field: 'category',
   *  operator: 'in',
   *  value: 'tool'
   * }
   * selector = {
   *  field: 'category',
   *  operator: 'not in',
   *  value: 'book'
   * }
   * @example 条件指标选择器
   * selector = {
   *  field: 'profit',
   *  operator: '>=',
   *  value: 100
   * }
   * selector = {
   *  field: 'profit',
   *  operator: 'between'
   *  value: [100, 300]
   * }
   */
  selector?: Selector | Selectors
  /**
   * 动态筛选器（代码驱动）
   * @description
   * 通过 AI 生成的 JavaScript 代码实现复杂数据筛选逻辑
   * 适用于 Top N、统计分析、复杂条件等静态 selector 难以表达的场景
   *
   * 核心能力:
   * - 支持任意复杂的数据筛选条件
   * - 使用 内置工具函数 进行数据操作
   * - 在浏览器环境中安全执行（Web Worker 沙箱）
   *
   * 环境要求: 仅支持浏览器环境，Node.js 环境将使用 fallback
   *
   * 注意: selector 和 dynamicFilter 不能同时使用，dynamicFilter 优先级更高
   *
   * @type {TableDynamicFilter}
   */
  dynamicFilter?: TableDynamicFilter
  /**
   * 单元格背景色
   */
  backgroundColor?: string
  /**
   * 单元格文字颜色
   */
  textColor?: string
  /**
   * 单元格文字大小
   */
  textFontSize?: number
  /**
   * 单元格边框颜色
   */
  borderColor?: string
  /**
   * 单元格边框线宽
   */
  borderLineWidth?: number
}

export const zBodyCellStyle = z.object({
  selector: z.union([zSelector, zSelectors]).nullish(),
  dynamicFilter: zTableDynamicFilter.nullish(),
  backgroundColor: z.string().nullish(),
  textColor: z.string().nullish(),
  textFontSize: z.number().nullish(),
  borderColor: z.string().nullish(),
  borderLineWidth: z.number().nullish(),
})
