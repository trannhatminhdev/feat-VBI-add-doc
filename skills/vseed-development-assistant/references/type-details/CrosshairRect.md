### CrosshairRect
十字线配置，用于展示数据的精确值
```typescript
export type CrosshairRect = {
  /**
   * @description 是否显示十字准星线矩形区域
   */
  visible?: boolean
  /**
   * @description 十字准星线矩形区域颜色
   */
  rectColor?: string
  /**
   * @description 十字准星线矩形区域标签颜色
   */
  labelColor?: string
  /**
   * @description 是否显示十字准星线矩形区域标签
   */
  labelVisible?: boolean
  /**
   * @description 十字准星线矩形区域标签背景颜色
   */
  labelBackgroundColor?: string
}
```