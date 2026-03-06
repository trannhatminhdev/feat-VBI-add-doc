### DimensionLinkage
当图表开启透视功能或者指标组合的是否，是否开启维度联动功能
当hover 到某个维度值时，联动高亮其他图表中相同维度值的数据
```typescript
export type DimensionLinkage = {
  /**
   * 是否开启透视图表维度联动
   */
  enable: boolean
  /**
   * 是否显示所有维度对应子图表的Tooltip提示信息
   */
  showTooltip?: boolean
  /**
   * 是否显示crosshair 对应的标签
   */
  showLabel?: boolean
}
```