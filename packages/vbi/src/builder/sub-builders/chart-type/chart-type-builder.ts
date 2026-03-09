import { ChartTypeEnum } from '@visactor/vseed'
import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'

/**
 * @description 图表类型构建器 - 用于切换图表显示形式, 支持：表格、柱状图、折线图、饼图、散点图等
 */
export class ChartTypeBuilder {
  private dsl: Y.Map<any>
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 监听图表类型变化
   * @param callback - 回调函数
   */
  observe(callback: ObserveCallback) {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('chartType')) {
        callback(e, trans)
      }
    }
    this.dsl.observe(wrapper)
  }

  /**
   * @description 取消监听图表类型变化
   * @param callback - 回调函数
   */
  unobserve(callback: ObserveCallback) {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('chartType')) {
        callback(e, trans)
      }
    }
    this.dsl.unobserve(wrapper)
  }

  /**
   * @description 设置图表类型
   * @param chartType - 图表类型
   */
  changeChartType(chartType: string) {
    this.dsl.set('chartType', chartType)
  }

  /**
   * @description 获取当前图表类型
   * @returns 图表类型
   */
  getChartType(): string {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * @description 获取当前图表类型
   * @returns 图表类型
   */
  toJson(): string {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * @description 获取所有支持的图表类型
   * @returns 图表类型数组
   */
  getAvailableChartTypes(): string[] {
    return [
      // Table
      ChartTypeEnum.Table,
      ChartTypeEnum.PivotTable,
      // cartesian
      ChartTypeEnum.Line,
      ChartTypeEnum.Column,
      ChartTypeEnum.ColumnPercent,
      ChartTypeEnum.ColumnParallel,
      ChartTypeEnum.BarPercent,
      ChartTypeEnum.BarParallel,
      ChartTypeEnum.Area,
      ChartTypeEnum.AreaPercent,
      ChartTypeEnum.DualAxis,
      ChartTypeEnum.Scatter,
      // Polar
      ChartTypeEnum.Rose,
      ChartTypeEnum.RoseParallel,
      ChartTypeEnum.Pie,
      ChartTypeEnum.Donut,
      ChartTypeEnum.Radar,
      // Other
      ChartTypeEnum.Funnel,
      ChartTypeEnum.Heatmap,
      ChartTypeEnum.Boxplot,
      ChartTypeEnum.Histogram,
    ]
  }
}
