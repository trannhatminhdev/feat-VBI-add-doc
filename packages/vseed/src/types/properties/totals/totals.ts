/**
 * @description 行或列的总计小计配置
 */
export type RowOrColumnTotalConfig = {
  /**
   * @description 是否显示总计（总计行/列）
   * @default false
   */
  showGrandTotals?: boolean
  /**
   * @description 是否显示小计
   * @default false
   */
  showSubTotals?: boolean
  /**
   * @description 小计的维度，按哪些维度进行小计分组
   * @default 首个维度
   * @example ['category', 'region']
   */
  subTotalsDimensions?: string[]
}

/**
 * @description 透视表的总计小计配置
 */
export type PivotTableTotals = {
  /**
   * @description 行的总计小计配置
   */
  row?: RowOrColumnTotalConfig
  /**
   * @description 列的总计小计配置
   */
  column?: RowOrColumnTotalConfig
}
