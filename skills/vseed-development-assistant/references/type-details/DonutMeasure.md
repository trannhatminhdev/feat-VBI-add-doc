### DonutMeasure

```typescript
export type BaseMeasure = {
  /**
   * @description 指标id, 不能重复
   */
  id: string
  /**
   * @description 指标别名, 允许重复, 未填写时, alias 为 id
   * @default id
   */
  alias?: string
  /**
   * @description 自动数值格式化，默认开启，优先级最高
   * 当 autoFormat=true 时，会覆盖 numFormat 的所有配置
   * 开启后，图表的数据标签、提示信息会根据指标数值和语言环境自动选择合适的格式化方式
   * 格式化规则：十进制数值，开启 compact notation，最小0位小数，最大2位小数，自动四舍五入，使用浏览器提供的 Intl.NumberFormat 实现
   * 例如:
   * - locale为zh-CN: 749740.264 → 74.45万
   * - locale为en-US: 749740.264 → 744.5K
   * @default true
   */
  autoFormat?: boolean

  /**
   * @description 自定义指标的数值格式化，会自动应用于 label、tooltip
   * 注意：若要使用自定义格式化，必须显式设置 autoFormat=false，否则 autoFormat 会覆盖此配置
   */
  numFormat?: NumFormat

  /**
   * @deprecated use numFormat instead
   */
  format?: NumFormat

  /**
   * @description 指标映射的通道
   * - primaryYAxis: 指标映射的主y轴, 仅用于双轴图
   * - secondaryYAxis: 指标映射的次y轴, 仅用于双轴图
   * - xAxis: 指标映射的x轴, 适用于条形图、散点图
   * - yAxis: 指标映射的y轴, 适用于柱状图、折线图、面积图、散点图
   * - angle: 指标映射的角度, 适用于饼图、环形图、雷达图
   * - radius: 指标映射的半径, 适用于玫瑰图
   * - size: 指标映射的大小, 适用于漏斗图、散点图
   * - detail: 指标映射的详情, 适用于透视表、热力图
   * - column: 指标映射的列, 仅适用于表格
   * - color: 指标映射的颜色, 适用于所有图表
   * - label: 指标映射的标签, 适用于所有图表
   * - tooltip: 指标映射的提示, 适用于所有图表
   */
  encoding?: MeasureEncoding

  /**
   * @description 以扁平的指标配置形式, 构建树形指标组, parentId指向父级指标组的id, 用于构建指标树
   * @tip 指标树的配置存在两种形式, 方式一是直接配置带children的指标树, 方式二是配置parentId的扁平指标列表, 两种方式不能同时配置
   */
  parentId?: string
}

export type DonutMeasure = PieMeasure

export type PieMeasure = BaseMeasure & {
  /**
   * @description 指标映射的通道
   * - angle: 指标映射的角度
   * - color: 指标映射的颜色
   * - label: 指标映射的标签
   * - tooltip: 指标映射的提示
   */
  encoding?: 'angle' | 'color' | 'label' | 'tooltip'
}
```
