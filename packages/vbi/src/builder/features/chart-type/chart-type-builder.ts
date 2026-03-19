import { ChartTypeEnum } from '@visactor/vseed'
import { ObserveCallback } from 'src/types'
import * as Y from 'yjs'
import {
  getRecommendedDimensionEncodingsForChartType,
  getSupportedDimensionEncodingsForChartType,
} from './dimension-encoding'
import {
  getRecommendedMeasureEncodingsForChartType,
  getSupportedMeasureEncodingsForChartType,
} from './measure-encoding'
import { reapplyDimensionEncodings } from './reapply-dimension-encodings'
import { reapplyMeasureEncodings } from './reapply-measure-encodings'

/**
 * @description 图表类型构建器，用于切换和获取图表类型。支持表格、柱状图、折线图、饼图、散点图等多种图表类型
 */
export class ChartTypeBuilder {
  private doc: Y.Doc
  private dsl: Y.Map<any>

  /**
   * @description 构造函数
   */
  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
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
    this.doc.transact(() => {
      this.dsl.set('chartType', chartType)
      reapplyDimensionEncodings(this.dsl, chartType)
      reapplyMeasureEncodings(this.dsl, chartType)
    })
  }

  /**
   * @description 获取当前图表类型
   */
  getChartType(): string {
    return this.dsl.get('chartType') || 'table'
  }

  /**
   * @description 获取当前图表类型支持的维度编码
   */
  getSupportedDimensionEncodings() {
    return getSupportedDimensionEncodingsForChartType(this.getChartType())
  }

  /**
   * @description 根据当前图表类型，按维度顺序返回推荐的维度编码
   * @param dimensionCount - 维度数量，默认使用当前 DSL 中的维度数量
   */
  getRecommendedDimensionEncodings(dimensionCount?: number) {
    const resolvedCount = dimensionCount ?? this.dsl.get('dimensions')?.length ?? 0
    return getRecommendedDimensionEncodingsForChartType(this.getChartType(), resolvedCount)
  }

  /**
   * @description 获取当前图表类型支持的指标编码
   */
  getSupportedMeasureEncodings() {
    return getSupportedMeasureEncodingsForChartType(this.getChartType())
  }

  /**
   * @description 根据当前图表类型，按指标顺序返回推荐的指标编码
   * @param measureCount - 指标数量，默认使用当前 DSL 中的指标数量
   */
  getRecommendedMeasureEncodings(measureCount?: number) {
    const resolvedCount = measureCount ?? this.dsl.get('measures')?.length ?? 0
    return getRecommendedMeasureEncodingsForChartType(this.getChartType(), resolvedCount)
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
      ChartTypeEnum.Column,
      ChartTypeEnum.ColumnParallel,
      ChartTypeEnum.ColumnPercent,
      ChartTypeEnum.Bar,
      ChartTypeEnum.BarParallel,
      ChartTypeEnum.BarPercent,
      ChartTypeEnum.Line,
      ChartTypeEnum.Area,
      ChartTypeEnum.AreaPercent,
      ChartTypeEnum.DualAxis,
      ChartTypeEnum.Scatter,
      ChartTypeEnum.Pie,
      ChartTypeEnum.Donut,
      ChartTypeEnum.Rose,
      ChartTypeEnum.RoseParallel,
      ChartTypeEnum.Radar,
      ChartTypeEnum.Funnel,
      ChartTypeEnum.Heatmap,
      ChartTypeEnum.Boxplot,
      ChartTypeEnum.Histogram,
      ChartTypeEnum.TreeMap,
      ChartTypeEnum.Sunburst,
      ChartTypeEnum.CirclePacking,
      ChartTypeEnum.RaceBar,
      ChartTypeEnum.RaceColumn,
      ChartTypeEnum.RaceLine,
      ChartTypeEnum.RaceScatter,
      ChartTypeEnum.RacePie,
      ChartTypeEnum.RaceDonut,
    ]
  }
}
