### Measure
指标
```typescript
export interface NumFormat {
  /**
   * @description 数字格式化类型, 支持数值(十进制)、百分比(%)、千分比(‰)、科学计数法
   * @default 'number'
   */
  type?: 'number' | 'percent' | 'permille' | 'scientific'

  /**
   * @description 数值格式化比例, 不能为0
   * @default 1
   * @example
   * - 100000 转换为 10万, ratio:10000, symbol:"万"
   * - 100000 转换为 10K, ratio:1000, symbol:"K"
   */
  ratio?: number

  /**
   * @description 数值格式化符号, 例如%、‰
   * @default ''
   * @example
   * - 100000 转换为 10万, ratio:10000, symbol:"万"
   * - 100000 转换为 10K, ratio:1000, symbol:"K"
   */
  symbol?: string

  /**
   * @description 数值格式化千分位分隔符
   * @default true
   */
  thousandSeparator?: boolean

  /**
   * @description 数值格式化后缀
   * @default ''
   */
  suffix?: string
  /**
   * @description 数值格式化前缀
   * @default ''
   */
  prefix?: string

  /**
   * @description 数值格式化小数位, 使用浏览器提供的 Intl.NumberFormat 中的 minimumFractionDigits 和 maximumFractionDigits 进行格式化, 优先级低于 significantDigits
   * @default 2
   * @example
   * - 1234.5678 转换为 1235, fractionDigits:0 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.6, fractionDigits:1 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.57, fractionDigits:2 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1230.568, fractionDigits:3 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.5678, fractionDigits:4 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.56780, fractionDigits:5 (roundingMode:halfCeil)
   */
  fractionDigits?: number

  /**
   * @description 数值格式化有效位, 使用浏览器提供的 Intl.NumberFormat 中的 minimumSignificantDigits 和 maximumSignificantDigits 进行格式化, 优先级高于 fractionDigits
   * @default undefined
   * @example
   * - 1234.5678 转换为 1000, significantDigits:1
   * - 1234.5678 转换为 1200, significantDigits:2
   * - 1234.5678 转换为 1230, significantDigits:3
   * - 1234.5678 转换为 1234, significantDigits:4
   * - 1234.5678 转换为 1234.6, significantDigits:5 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.57, significantDigits:6 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.568, significantDigits:7 (roundingMode:halfCeil)
   * - 1234.5678 转换为 1234.5678, significantDigits:8 (roundingMode:halfCeil)
   */
  significantDigits?: number

  /**
   * @description 数值格式化舍入优先级, 处理同时设置了 significantDigits 和 fractionDigits 时的舍入优先级, 使用浏览器提供的 Intl.NumberFormat 进行格式化, 规则同 Intl.NumberFormat 中的 roundingPriority
   * @default 'morePrecision'
   * @example
   * - 1234.5678 转换为 1230, significantDigits:3 (roundingPriority:lessPrecision)
   * - 1234.5678 转换为 1234.5678, significantDigits:3 (roundingPriority:morePrecision)
   */
  roundingPriority?: 'morePrecision' | 'lessPrecision'

  /**
   * @description 数值格式化舍入模式, 使用浏览器提供的 Intl.NumberFormat 进行格式化, 规则同 Intl.NumberFormat 中的 roundingMode
   * @default 'halfExpand'
   * @example
   */
  roundingMode?:
    | 'floor'
    | 'ceil'
    | 'expand'
    | 'trunc'
    | 'halfCeil'
    | 'halfFloor'
    | 'halfExpand'
    | 'halfTrunc'
    | 'halfEven'
}
export type MeasureEncoding =
  | 'primaryYAxis'
  | 'secondaryYAxis'
  | 'xAxis'
  | 'yAxis'
  | 'angle'
  | 'radius'
  | 'size'
  | 'color'
  | 'detail'
  | 'column'
  | 'label'
  | 'tooltip'
  | 'value'
  | 'q1'
  | 'median'
  | 'q3'
  | 'min'
  | 'max'
  | 'outliers'
  | 'x0'
  | 'x1'

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

/**
 * @description 指标
 */
export type Measure = BaseMeasure & {
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
   * @description 设置该指标在双轴图中的图表类型, 仅适用于双轴图
   * - line: 折线图
   * - column: 柱状图
   * - columnParallel: 平行柱状图
   * - columnPercent: 百分比柱状图
   * - area: 面积图
   * - areaPercent: 百分比面积图
   * - scatter: 散点图
   */
  chartType?: 'line' | 'column' | 'columnParallel' | 'columnPercent' | 'area' | 'areaPercent' | 'scatter'
}

export type Measures = Measure[]


export type TableMeasure = BaseMeasure & {
  /**
   * @description 指标映射的通道
   * - column: 指标列
   */
  encoding?: 'column'
}

export type MeasureGroup = {
  /**
   * @description 指标组id, 不能重复
   */
  id: string
  /**
   * @description 指标组别名, 允许重复, 未填写时, alias 为 id
   * @default id
   */
  alias?: string
  /**
   * @description 指标组的子指标或指标组
   */
  children?: (TableMeasure | MeasureGroup)[]
}

export type MeasureTree = (TableMeasure | MeasureGroup)[]

```