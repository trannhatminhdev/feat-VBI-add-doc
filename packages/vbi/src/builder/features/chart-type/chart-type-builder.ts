import { ChartTypeEnum } from '@visactor/vseed'
import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'

/**
 * @description 图表类型构建器，用于切换和获取图表类型。支持表格、柱状图、折线图、饼图、散点图等多种图表类型
 */
export class ChartTypeBuilder {
  private dsl: Y.Map<any>

  /**
   * @description 构造函数
   */
  constructor(_doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  /**
   * @description 监听图表类型变化
   * @param callback - 回调函数
   */
  /**
   * @description 监听图表类型变化，返回取消监听的函数
   * @param callback - 回调函数
   * @returns 取消监听的函数
   */
  observe(callback: ObserveCallback): () => void {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('chartType')) {
        callback(e, trans)
      }
    }
    this.dsl.observe(wrapper)
    return () => {
      this.dsl.unobserve(wrapper)
    }
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
   */
  getChartType(): string {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * @description 导出为 JSON
   */
  toJSON(): string {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * @description 获取所有支持的图表类型
   */
  getAvailableChartTypes(): string[] {
    return [
      ChartTypeEnum.Table,
      ChartTypeEnum.PivotTable,
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
      ChartTypeEnum.Rose,
      ChartTypeEnum.RoseParallel,
      ChartTypeEnum.Pie,
      ChartTypeEnum.Donut,
      ChartTypeEnum.Radar,
      ChartTypeEnum.Funnel,
      ChartTypeEnum.Heatmap,
      ChartTypeEnum.Boxplot,
      ChartTypeEnum.Histogram,
    ]
  }
}
