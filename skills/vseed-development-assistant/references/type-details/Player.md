### Player
播放器配置，用于指定时间维度，是动态散点图的核心配置
通过播放器控制时间维度的播放进度，实现数据的动态更新
```typescript
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
```