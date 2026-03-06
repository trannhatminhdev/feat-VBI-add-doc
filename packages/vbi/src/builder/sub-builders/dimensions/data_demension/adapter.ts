// adapter.ts
import { MinimalistChartInput } from './types'

export function buildFullChartConfig(input: MinimalistChartInput) {
  const select: any[] = []
  const groupBy: string[] = []

  // 1.翻译demension
  if (input.dimensions) {
    input.dimensions.forEach((dim) => {
      select.push(dim)
      groupBy.push(dim)
    })
  }

  // 2. 翻译 [['sales', 'sum'], ['sales', 'avg']]
  if (input.measures) {
    input.measures.forEach(([field, aggr, customAlias]) => {
      // 别名：有就用，无则自动生成
      const alias = customAlias || `${aggr.charAt(0).toUpperCase() + aggr.slice(1)}(${field})`
      select.push({
        field,
        alias,
        aggr: { func: aggr },
      })
    })
  }

  // 3. 翻译[['date', 'hour'], ['date', 'month']]
  if (input.time) {
    input.time.forEach(([field, timeUnit]) => {
      select.push({
        field,
        alias: timeUnit,
        aggr: { func: `to_${timeUnit}` },
      })
      groupBy.push(timeUnit)
    })
  }

  // 4. 组装vquery
  const vqueryDSL: any = { select }
  if (groupBy.length > 0) vqueryDSL.groupBy = groupBy
  if (input.orderBy) vqueryDSL.orderBy = input.orderBy
  if (input.limit) vqueryDSL.limit = input.limit

  // 5. 打包生成完整的config
  return {
    datasetId: input.datasetId,
    description: input.description || '',
    dataset: input.dataset,
    schema: input.schema,
    vquery: vqueryDSL,
  }
}
