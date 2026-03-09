import { ChartTypeEnum } from '@visactor/vseed'
import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'

export class ChartTypeBuilder {
  private dsl: Y.Map<any>
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.dsl = dsl
  }

  observe(callback: ObserveCallback) {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('chartType')) {
        callback(e, trans)
      }
    }
    this.dsl.observe(wrapper)
  }

  unobserve(callback: ObserveCallback) {
    const wrapper: ObserveCallback = (e, trans) => {
      if (e.keysChanged.has('chartType')) {
        callback(e, trans)
      }
    }
    this.dsl.unobserve(wrapper)
  }

  changeChartType(chartType: string) {
    this.dsl.set('chartType', chartType)
  }

  /**
   * 获取当前图表类型
   * @returns 图表类型字符串
   * @deprecated 请使用 toJson() 方法
   */
  getChartType() {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * 将当前图表类型配置转换为 JSON 对象
   * @returns 图表类型字符串
   */
  toJson(): string {
    return this.dsl.get('chartType') || 'table'
  }

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
