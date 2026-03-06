### CrosshairLine
鼠标移动到图表上时, 显示的垂直提示线
```typescript
export type CrosshairLine = {
  /**
   * @description 是否显示十字准星线
   */
  visible?: boolean
  /**
   * @description 十字准星线颜色
   */
  lineColor?: string
  /**
   * @description 十字准星线标签颜色
   */
  labelColor?: string
  /**
   * @description 是否显示十字准星线标签
   */
  labelVisible?: boolean
  /**
   * @description 十字准星线标签背景颜色
   */
  labelBackgroundColor?: string
}
```