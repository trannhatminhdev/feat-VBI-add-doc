/**
 * @description 播放器配置, 用于指定播放的字段名, 必须是维度
 * @warning 该功能不支持 table, pivotTable, dualAxis, histogram, boxPlot 等图表类型, 不支持在开启指标组合、行列透视下使用
 */
export type Player = {
  /**
   * @description 播放器绑定的字段, 必须是维度
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
