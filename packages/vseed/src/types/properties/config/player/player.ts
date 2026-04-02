/**
 * @description 播放器配置, 用于指定播放的字段名, 必须是维度
 * @warning 该功能不支持 table, pivotTable, dualAxis, histogram, boxPlot 等图表类型, 不支持在开启指标组合、行列透视下使用
 */
export type Player = {
  /**
   * @description 最大播放数量, 超过该数量的数据将被截断, 设为 false 表示不限制
   */
  maxCount?: number | false
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
  /**
   * @description 播放器位置
   */
  position?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * @description 播放器进度条轨道颜色
   */
  railColor?: string
  /**
   * @description 播放器文本字体
   */
  fontFamily?: string
  /**
   * @description 播放器进度条进度颜色
   */
  trackColor?: string
  /**
   * @description 播放器进度条滑块颜色
   */
  sliderHandleColor?: string
  /**
   * @description 播放器进度条滑块边框颜色
   */
  sliderHandleBorderColor?: string

  /**
   * @description 播放器开始按钮颜色
   */
  startButtonColor?: string
  /**
   * @description 播放器暂停按钮颜色
   */
  pauseButtonColor?: string
  /**
   * @description 播放器后退按钮颜色
   */
  backwardButtonColor?: string
  /**
   * @description 播放器前进按钮颜色
   */
  forwardButtonColor?: string
}
