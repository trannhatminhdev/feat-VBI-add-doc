import { z } from 'zod'
import { zDatum, type Datum } from '../properties'

export type ValueSelector = string | number

export type PartialDatumSelector = Datum

/**
 * @description 指标选择器, 用于选择数据项中指标字段的值
 */
export type MeasureSelector = {
  /**
   * @description 指标字段, measures 某一项的 id
   */
  field: string
  /**
   * @description 操作符
   * - =: 选择数据项中指标字段的值等于 value 的数据项
   * - ==: 选择数据项中指标字段的值等于 value 的数据项
   * - !=: 选择数据项中指标字段的值不等于 value 的数据项
   * - >: 选择数据项中指标字段的值大于 value 的数据项
   * - <: 选择数据项中指标字段的值小于 value 的数据项
   * - >=: 选择数据项中指标字段的值大于等于 value 的数据项
   * - <=: 选择数据项中指标字段的值小于等于 value 的数据项
   * - between: 选择数据项中指标字段的值在 value 之间的 data item
   */
  operator?: '=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between'
  /**
   * @description 操作符
   * - =: 选择数据项中指标字段的值等于 value 的数据项, 会将值转换为字符串后进行比较, 因此 1 == "1" 为 true
   * - ==: 选择数据项中指标字段的值精准等于 value 的数据项, 不会做任何特殊处理, 因此 1 == "1" 为 false
   * - !=: 选择数据项中指标字段的值不等于 value 的数据项
   * - >: 选择数据项中指标字段的值大于 value 的数据项
   * - <: 选择数据项中指标字段的值小于 value 的数据项
   * - >=: 选择数据项中指标字段的值大于等于 value 的数据项
   * - <=: 选择数据项中指标字段的值小于等于 value 的数据项
   * - between: 选择数据项中指标字段的值在 value 之间的 data item
   * same as operator
   */
  op?: '=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between'
  /**
   * @description 选择数据项中指标字段的值
   * - 仅 op 为 between 时, value 为长度为2的数组, 数组中的元素为指标字段的最小值和最大值
   * - 其他情况, value 为指标字段的单个值
   */
  value: string | number | Array<string | number>
  // /**
  //  * @description 是否使用原始数据进行数据匹配, 开启后会有更多的数据被匹配到
  //  * 若下述数据, measures 仅设置了 value, field 为 isHigh 或 isLow, op 为 =, value 为 1,
  //  * 关闭useOrigin时, 数据项并不会考虑measures之外的字段, 因此field为isHigh或isLow的字段会被忽略
  //  * 开启useOrigin时, 会直接使用整个数据项进行匹配
  //  * [
  //  *  {value: 100, isHigh: 1, isLow: 0},
  //  *  {value: 200, isHigh: 0, isLow: 1},
  //  *  {value: 300, isHigh: 1, isLow: 0},
  //  * ]
  //  * @default false
  //  */
  // useOrigin?: boolean
}

/**
 * @description 维度选择器, 用于选择数据项中维度字段的值
 */
export type DimensionSelector = {
  /**
   * @description 维度字段, dimensions 某一项的 id
   */
  field: string
  /**
   * @description 操作符
   * - in: 选择数据项中维度字段的值在 value 中的数据项
   * - not in: 选择数据项中维度字段的值不在 value 中的数据项
   */
  operator?: 'in' | 'not in'
  /**
   * @description 操作符
   * - in: 选择数据项中维度字段的值在 value 中的数据项
   * - not in: 选择数据项中维度字段的值不在 value 中的数据项
   * same as operator
   */
  op?: 'in' | 'not in'
  /**
   * @description 选择数据项中维度字段的值, 支持数组
   */
  value: string | number | Array<string | number>
  // /**
  //  * @description 是否使用原始数据进行数据匹配, 开启后会有更多的数据被匹配到
  //  * 若下述数据, dimensions 仅设置了 name, field 为 name, op 为 =, value 为 "high",
  //  * 关闭useOrigin时, 数据项并不会考虑dimensions之外的字段, 因此field为name的字段会被忽略
  //  * 开启useOrigin时, 会直接使用整个数据项进行匹配
  //  * [
  //  *  {name: "low", isHigh: "false", isLow: "true"},
  //  *  {name: "low", isHigh: "false", isLow: "true"},
  //  *  {name: "high", isHigh: "true", isLow: "false"},
  //  * ]
  //  * @default false
  //  */
  // useOrigin?: boolean
}

export type Selector = ValueSelector | PartialDatumSelector | MeasureSelector | DimensionSelector

export type AreaSelector = MeasureSelector | DimensionSelector

export type AreaSelectors = Array<AreaSelector>

export type Selectors = Array<Selector>

export type TableDynamicFilterRes = {
  __row_index: number
  field: string | '*'
}

export type ChartDynamicFilterRes = Datum

export type DynamicFilterExecutionResult<T> = {
  success: boolean
  data?: T[]
}

/**
 * 表格动态筛选器配置
 * @description 通过 AI 生成的 JavaScript 代码实现表格单元格级别的精确筛选
 * @environment 仅支持浏览器环境（需要 Web Worker），Node.js 环境将使用 fallback
 */
export interface TableDynamicFilter {
  type: 'table-dynamic'
  /**
   * 用户的筛选需求描述（自然语言）
   * @example "高亮销售额大于1000的单元格"
   * @example "高亮每行中最大值所在的单元格"
   */
  description?: string

  /**
   * AI 生成的 JavaScript 筛选代码
   * @description
   * - 只能使用内置工具函数（通过 _ 或 R 访问）
   * - 输入参数: data (数组)，每个 item 包含 _index 字段表示行号
   * - 必须返回单元格选择器数组: Array<{ row: number, field: string }>
   * - field 为 "*" 时表示整行高亮
   * - 禁止使用: eval, Function, 异步操作, DOM API, 网络请求
   *
   * @example 高亮销售额大于1000的单元格
   * ```javascript
   * const filtered = _.filter(data, item => item.sales > 1000);
   * return _.map(filtered, item => ({
   *   row: item._index,
   *   field: 'sales'
   * }));
   * ```
   *
   * @example 高亮前3名产品的产品名和销售额
   * ```javascript
   * const sorted = _.sortBy(data, item => -item.sales);
   * const top3 = _.take(sorted, 3);
   * return _.flatten(
   *   _.map(top3, item => [
   *     { row: item._index, field: 'product' },
   *     { row: item._index, field: 'sales' }
   *   ])
   * );
   * ```
   *
   * @example 整行高亮
   * ```javascript
   * const matched = _.filter(data, item => item.sales > item.profit);
   * return _.map(matched, item => ({
   *   row: item._index,
   *   field: '*'
   * }));
   * ```
   */
  code: string

  /**
   * 代码执行失败或环境不支持时的降级方案
   */
  fallback?: Selector | Selectors

  /**
   * 动态筛选执行结果（运行期字段）
   * @description buildAsync 阶段写入，运行时只读
   */
  result?: DynamicFilterExecutionResult<TableDynamicFilterRes>
}

/**
 * 图表动态筛选器配置
 * @description 通过 AI 生成的 JavaScript 代码实现图表标记（柱子、点等）的筛选
 * @environment 仅支持浏览器环境（需要 Web Worker），Node.js 环境将使用 fallback
 */
export interface ChartDynamicFilter {
  type: 'chart-dynamic'
  /**
   * 用户的筛选需求描述（自然语言）
   * @example "高亮销售额大于1000的柱子"
   * @example "高亮每个区域中利润率最高的柱子"
   */
  description?: string

  /**
   * AI 生成的 JavaScript 筛选代码
   * @description
   * - 只能使用内置工具函数（通过 _ 或 R 访问）
   * - 输入参数: data (数组)
   * - 必须返回部分数据项数组: Array<{ [dimField]: value }>
   * - 返回的对象包含能唯一标识图表标记的维度字段组合
   * - 禁止使用: eval, Function, 异步操作, DOM API, 网络请求
   *
   * @example 高亮销售额大于1000的柱子
   * ```javascript
   * const filtered = _.filter(data, item => item.sales > 1000);
   * // 假设柱子由 product 和 area 两个维度唯一标识
   * return _.map(filtered, item => ({
   *   product: item.product,
   *   area: item.area
   * }));
   * ```
   *
   * @example 高亮每个区域中利润率最高的柱子
   * ```javascript
   * const grouped = _.groupBy(data, 'area');
   * const result = _.map(grouped, group => {
   *   const maxProfitRateItem = _.maxBy(group, item =>
   *     item.profit / item.sales
   *   );
   *   return {
   *     product: maxProfitRateItem.product,
   *     area: maxProfitRateItem.area
   *   };
   * });
   * return result;
   * ```
   *
   * @example 高亮多条件筛选
   * ```javascript
   * const filtered = _.filter(data, item => {
   *   const profitRate = item.profit / item.sales;
   *   return profitRate > 0.2 && item.sales > 5000;
   * });
   * return _.map(filtered, item => ({
   *   product: item.product,
   *   region: item.region
   * }));
   * ```
   */
  code: string

  /**
   * 代码执行失败或环境不支持时的降级方案
   */
  fallback?: Selector | Selectors

  /**
   * 动态筛选执行结果（运行期字段）
   * @description buildAsync 阶段写入，运行时只读
   */
  result?: DynamicFilterExecutionResult<ChartDynamicFilterRes>
}

export const zPartialSelector = zDatum
export const zMeasureSelector = z.object({
  field: z.string(),
  operator: z.enum(['=', '==', '!=', '>', '<', '>=', '<=', 'between']).nullish(),
  op: z.enum(['=', '==', '!=', '>', '<', '>=', '<=', 'between']).nullish(),
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
})

export const zDimensionSelector = z.object({
  field: z.string(),
  operator: z.enum(['in', 'not in']).nullish(),
  op: z.enum(['in', 'not in']).nullish(),
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
})

export const zSelector = z.union([z.string(), z.number(), zMeasureSelector, zDimensionSelector, zPartialSelector])

export const zSelectors = z.array(zSelector)

export const zAreaSelector = z.union([zMeasureSelector, zDimensionSelector])

export const zAreaSelectors = z.array(zAreaSelector)

export const zCellSelector = z.object({
  row: z.number(),
  field: z.string(),
})

export const zTableDynamicFilter = z.object({
  type: z.literal('table-dynamic'),
  description: z.string().optional(),
  code: z.string(),
  fallback: z.union([zCellSelector, z.array(zCellSelector)]).optional(),
  result: z
    .object({
      success: z.boolean(),
      data: z.array(zCellSelector).optional(),
    })
    .optional(),
})

export const zChartDynamicFilter = z.object({
  type: z.literal('chart-dynamic'),
  description: z.string().optional(),
  code: z.string(),
  fallback: z.union([zSelector, zSelectors]).optional(),
  result: z
    .object({
      success: z.boolean(),
      data: z.array(z.record(z.string(), z.any())).optional(),
    })
    .optional(),
})

/**
 * @deprecated 请使用 zTableDynamicFilter 或 zChartDynamicFilter
 */
export const zDynamicFilter = z.union([zTableDynamicFilter, zChartDynamicFilter])
