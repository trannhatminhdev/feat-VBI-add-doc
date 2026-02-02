export type Player = {
  /**
   * @description 播放器绑定的字段, 必须是维度
   * @warning 播放器功能仅支持在VChart内使用, 无法在透视图表(PivotChart)、表格(Table、PivotTable)中使用
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
