export type Player = {
  /**
   * @description 播放器绑定的字段, 必须是维度
   * @tip 播放器功能仅支持在VChart内使用, 无法在透视图表(PivotChart)、
   * @warning 该功能不支持 table, pivotTable, dualAxis, histogram, boxPlot 图表类型
   */
  field: string
  /**
   * @description 播放间隔, 单位ms
   */
  interval?: number
  /**
   * @description 是否自动播放
   */
  autoPlay?: boolean
  /**
   * @description 是否循环播放
   */
  loop?: boolean
}
