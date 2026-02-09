import type { Datum } from 'src/types'
import type {
  ChartDynamicFilter,
  ChartDynamicFilterRes,
  DimensionSelector,
  MeasureSelector,
  PartialDatumSelector,
  Selector,
  Selectors,
  TableDynamicFilterRes,
  TableDynamicFilter,
  ValueSelector,
} from '../types/dataSelector'
import { omit } from 'remeda'
import { executeFilterCode } from 'src/pipeline/utils/sandbox'
import { InnerRowIndex } from 'src/dataReshape'

export type DynamicFilter = TableDynamicFilter | ChartDynamicFilter
export type DynamicFilterResult = TableDynamicFilterRes[] | ChartDynamicFilterRes[]

/**
 * 判断两个数字是否“近似相等”
 */
function nearlyEqual(a: number, b: number, epsilon = 1e-8) {
  // NaN 直接不相等
  if (Number.isNaN(a) || Number.isNaN(b)) return false
  // 引用同一个数 或 完全相等
  if (a === b) return true
  const diff = Math.abs(a - b)
  return diff <= epsilon
}

export const selector = (
  vchartDatum: Datum,
  selector: Selector | Selectors | undefined | null,
  selectorMode: 'And' | 'Or' = 'And',
) => {
  // 无有效选择器, 则认为全部匹配成功
  if (!selector) {
    return true
  }

  // 过滤掉 vchart 相关字段
  const vchartKeys = Object.keys(vchartDatum).filter((k) => k.toLocaleLowerCase().startsWith('__vchart'))
  const datum = omit(vchartDatum, vchartKeys) as Datum

  // 统一处理选择器为数组
  const selectors = (Array.isArray(selector) ? selector : [selector]) as Selectors

  return selectors[selectorMode === 'And' ? 'every' : 'some']((selector) => {
    // 1. 字符串或数字
    if (isValueSelector(selector)) {
      return selectByValue(selector, datum)
    }

    // 2. 指标选择器
    else if (isMeasureSelector(selector)) {
      return selectByMeasure(selector, datum)
    }
    // 3. 维度选择器
    else if (isDimensionSelector(selector)) {
      return selectByDmension(selector, datum)
    }
    // 4. 部分数据对象选择器
    else if (isPartialDatumSelector(selector)) {
      return selectByPartial(selector, datum)
    }

    return false
  })
}

export const isValueSelector = (selector: Selector): selector is ValueSelector => {
  return typeof selector === 'string' || typeof selector === 'number'
}

export const isPartialDatumSelector = (selector: Selector): selector is PartialDatumSelector => {
  return typeof selector === 'object' && selector !== null
}

export const isMeasureSelector = (selector: Selector): selector is MeasureSelector => {
  return (
    typeof selector === 'object' &&
    selector !== null &&
    'field' in selector &&
    ('operator' in selector || 'op' in selector) &&
    'value' in selector &&
    (['=', '==', '!=', '>', '<', '>=', '<=', 'between'].includes(selector.operator as string) ||
      ['=', '==', '!=', '>', '<', '>=', '<=', 'between'].includes(selector.op as string))
  )
}

export const isDimensionSelector = (selector: Selector): selector is DimensionSelector => {
  return (
    typeof selector === 'object' &&
    selector !== null &&
    'field' in selector &&
    ('operator' in selector || 'op' in selector) &&
    'value' in selector &&
    (['in', 'not in'].includes(selector.operator as string) || ['in', 'not in'].includes(selector.op as string))
  )
}

export const selectByMeasure = (selector: MeasureSelector, datum: Datum) => {
  const op = selector.operator || selector.op
  const selectorValueArr = Array.isArray(selector.value) ? selector.value : [selector.value]

  switch (op) {
    case '=':
      if (
        String(datum[selector.field]) === String(selectorValueArr[0]) ||
        nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))
      ) {
        return true
      }
      break
    case '==':
      if (datum[selector.field] === selectorValueArr[0]) {
        return true
      }
      break
    case '!=':
      if (datum[selector.field] !== selectorValueArr[0]) {
        return true
      }
      break
    case '>':
      if (
        datum[selector.field] > selectorValueArr[0] &&
        !nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))
      ) {
        return true
      }
      break
    case '<':
      if (
        datum[selector.field] < selectorValueArr[0] &&
        !nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))
      ) {
        return true
      }
      break
    case '>=':
      if (
        datum[selector.field] >= selectorValueArr[0] ||
        nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))
      ) {
        return true
      }
      break
    case '<=':
      if (
        datum[selector.field] <= selectorValueArr[0] ||
        nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))
      ) {
        return true
      }
      break
    case 'between':
      if (
        Array.isArray(selector.value) &&
        (datum[selector.field] >= selectorValueArr[0] ||
          nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[0]))) &&
        (datum[selector.field] <= selectorValueArr[1] ||
          nearlyEqual(Number(datum[selector.field]), Number(selectorValueArr[1])))
      ) {
        return true
      }
      break
  }
  return false
}

export const selectByDmension = (selector: DimensionSelector, datum: Datum) => {
  const op = selector.operator || selector.op
  const selectorValueArr = Array.isArray(selector.value) ? selector.value : [selector.value]
  switch (op) {
    case 'in':
      if (selectorValueArr.includes(datum[selector.field] as string | number)) {
        return true
      }
      break
    case 'not in':
      if (!selectorValueArr.includes(datum[selector.field] as string | number)) {
        return true
      }
      break
  }

  return false
}

export const selectByPartial = (selector: PartialDatumSelector, datum: Datum) => {
  return Object.keys(selector).every((key) => datum[key] === selector[key])
}

export const selectByValue = (selector: ValueSelector, datum: Datum) => {
  return Object.values(datum).some((v) => v === selector)
}

const matchesCellSelector = (cell: Datum, filterRes: TableDynamicFilterRes) => {
  if (filterRes[InnerRowIndex] !== cell[InnerRowIndex]) return false
  return filterRes.field === '*' || Object.keys(cell).includes(filterRes.field)
}

const matchesDatum = (target: Datum, candidate: Datum) => {
  return Object.keys(candidate).every((key) => target[key] === candidate[key])
}

/**
 * 识别是否为表格动态过滤器
 */
export const isTableDynamicFilter = (selector: any): selector is TableDynamicFilter => {
  return (
    typeof selector === 'object' &&
    selector !== null &&
    'type' in selector &&
    selector.type === 'table-dynamic' &&
    'code' in selector &&
    typeof selector.code === 'string'
  )
}

/**
 * 识别是否为图表动态过滤器
 */
export const isChartDynamicFilter = (selector: any): selector is ChartDynamicFilter => {
  return (
    typeof selector === 'object' &&
    selector !== null &&
    'type' in selector &&
    selector.type === 'chart-dynamic' &&
    'code' in selector &&
    typeof selector.code === 'string'
  )
}

/**
 * 识别是否为动态过滤器
 */
export const isDynamicFilter = (selector: any): selector is DynamicFilter => {
  return isTableDynamicFilter(selector) || isChartDynamicFilter(selector)
}

/**
 * 执行动态过滤器代码，获取匹配结果
 * @description
 * 阶段1：执行阶段 - 一次性执行 dynamicFilter.code，获取所有匹配结果
 * - TableDynamicFilter → CellSelector[]
 * - ChartDynamicFilter → PartialDatumSelector[]
 *
 * @param filter 动态过滤器配置
 * @param allData 完整数据集
 * @returns 执行结果数组
 */
export const executeDynamicFilter = async (
  filter: DynamicFilter,
  allData: Datum[],
): Promise<{ success: boolean; data: DynamicFilterResult }> => {
  const { success, data, error } = await executeFilterCode({
    code: filter.code,
    data: allData,
  })
  if (!success) {
    // eslint-disable-next-line no-console
    console.warn('[vseed] Dynamic filter execution failed:', error)
  }
  return {
    success,
    data: data as DynamicFilterResult,
  }
}

/**
 * 匹配动态过滤器结果
 * @description
 * 阶段2：匹配阶段 - 判断当前 datum/cell 是否在执行结果中
 * - 使用 OR 策略：结果数组中任一项匹配即返回 true
 * - 表格场景：检查 { row, field } 是否在 CellSelector[] 中
 * - 图表场景：检查 datum 的维度值是否匹配 PartialDatumSelector[] 中任一项
 *
 * @param result 动态过滤器执行结果（CellSelector[] 或 PartialDatumSelector[]）
 * @param datum 当前数据项
 * @param selectorType 选择器类型（用于区分表格和图表动态过滤器）
 * @returns 是否匹配（OR 策略）
 */
export const matchDynamicFilterResult = (
  result: DynamicFilterResult,
  datum: Datum,
  selectorType: 'table' | 'chart' = 'table',
): boolean => {
  if (selectorType === 'table') {
    return result.some((item) => {
      return matchesCellSelector(datum, item as TableDynamicFilterRes)
    })
  }
  return result.some((item) => {
    return matchesDatum(datum, item as PartialDatumSelector)
  })
}

/**
 * 带有动态过滤器支持的选择器
 * @description
 * 处理流程（两阶段设计）：
 *
 * 阶段1 - 执行（Execute）：
 *   - 在 buildAsync 阶段执行，结果写入 dynamicFilter.result
 *   - TableDynamicFilter → CellSelector[]
 *   - ChartDynamicFilter → PartialDatumSelector[]
 *
 * 阶段2 - 匹配（Match）：
 *   - 读取 dynamicFilter.result
 *   - 使用 OR 策略：结果数组中任一项匹配即返回 true
 *   - 表格：判断 { row, field } 是否在 CellSelector[] 中
 *   - 图表：判断 datum 是否匹配 PartialDatumSelector[] 中任一项
 *
 * @param vchartDatum 单个数据项
 * @param selector 选择器配置（可包含 DynamicFilter）
 * @returns 该数据项是否符合选择条件
 */
export const selectorWithDynamicFilter = (vchartDatum: Datum, selectorConfig: DynamicFilter): boolean => {
  // 无有效选择器, 则认为全部匹配成功
  if (!selectorConfig) {
    return true
  }
  const selectorType = isTableDynamicFilter(selectorConfig) ? 'table' : 'chart'

  // 优先使用预先执行的结果
  if (selectorConfig.result?.success && selectorConfig.result.data) {
    return matchDynamicFilterResult(selectorConfig.result.data, vchartDatum, selectorType)
  }

  // 降级到 fallback（执行阶段应在外部完成）
  if (selectorConfig.fallback) {
    if (isTableDynamicFilter(selectorConfig)) {
      const fallbackResult = Array.isArray(selectorConfig.fallback)
        ? selectorConfig.fallback
        : [selectorConfig.fallback]
      return matchDynamicFilterResult(fallbackResult, vchartDatum, selectorType)
    }

    const fallbackSelector = Array.isArray(selectorConfig.fallback)
      ? selectorConfig.fallback
      : [selectorConfig.fallback]
    return selector(vchartDatum, fallbackSelector)
  }

  // 没有结果也没有 fallback，返回 false
  return false
}
