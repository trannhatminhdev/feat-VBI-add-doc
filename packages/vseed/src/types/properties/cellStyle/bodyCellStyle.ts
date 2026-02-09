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
   * - 使用 lodash 进行数据操作
   * - 在浏览器环境中安全执行（Web Worker 沙箱）
   * - 返回单元格选择数组: [{ __row_index: number, field: string }]
   * - field 为 "*" 时表示整行
   *
   * 环境要求: 仅支持浏览器环境，Node.js 环境将使用 fallback
   *
   * 注意: selector 和 dynamicFilter 不能同时使用，dynamicFilter 优先级更高
   *
   * @type {TableDynamicFilter}
   * @example Top N 筛选
   * dynamicFilter = {
   *   type: 'table-dynamic',
   *   description: '高亮销售额最高的前3个产品',
   *   code: `
   *     const sorted = _.sortBy(data, 'sales');
   *     const reversed = [...sorted].reverse();
   *     const result = _.take(reversed, 3);
   *     return _.flatten(
   *       _.map(result, item => [
   *         { __row_index: item._index, field: 'product' },
   *         { __row_index: item._index, field: 'sales' }
   *       ])
   *     );
   *   `,
   *   enabled: true
   * }
   *
   * @example 多条件筛选
   * dynamicFilter = {
   *   type: 'table-dynamic',
   *   description: '高亮利润率大于20%且销售额超过5000的产品',
   *   code: `
   *     const matched = _.filter(data, item => {
   *       const profitRate = (item.profit / item.sales) * 100;
   *       return profitRate > 20 && item.sales > 5000;
   *     });
   *     return _.flatten(
   *       _.map(matched, item => [
   *         { __row_index: item._index, field: 'product' },
   *         { __row_index: item._index, field: 'sales' }
   *       ])
   *     );
   *   `,
   *   enabled: true
   * }
   *
   * @example 相对值筛选
   * dynamicFilter = {   *   type: 'table-dynamic',   *   description: '高亮销售额高于平均值的产品',
   *   code: `
   *     const avgSales = _.meanBy(data, 'sales');
   *     const matched = _.filter(data, item => item.sales > avgSales);
   *     return _.flatten(
   *       _.map(matched, item => [
   *         { __row_index: item._index, field: 'product' },
   *         { __row_index: item._index, field: 'sales' }
   *       ])
   *     );
   *   `,
   *   enabled: true
   * }
   *
   * @example 分组筛选
   * dynamicFilter = {   *   type: 'table-dynamic',   *   description: '每个区域中销售额最高的产品',
   *   code: `
   *     const grouped = _.groupBy(data, 'region');
   *     const topByRegion = _.map(_.values(grouped), group => _.maxBy(group, 'sales'));
   *     return _.flatten(
   *       _.map(topByRegion, item => [
   *         { __row_index: item._index, field: 'product' },
   *         { __row_index: item._index, field: 'sales' }
   *       ])
   *     );
   *   `,
   *   enabled: true
   * }
   *
   * @example 整行高亮
   * dynamicFilter = {
   *   description: '高亮销售额大于利润的整行',
   *   code: `
   *     const matched = _.filter(data, item => item.sales > item.profit);
   *     return matched.map(item => ({
   *       __row_index: item._index,
   *       field: '*'
   *     }));
   *   `,
   *   enabled: true
   * }
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
