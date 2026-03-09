import type { Select, VQueryDSL } from '@visactor/vquery'
import { VBIDSL } from '../../types'
import { DimensionsBuilder, MeasuresBuilder, VBIBuilder } from 'src'
import { pipe } from 'remeda'

type buildPipe = (queryDSL: VQueryDSL, context: { vbiDSL: VBIDSL; builder: VBIBuilder }) => VQueryDSL

export const buildVQuery = (vbiDSL: VBIDSL, builder: VBIBuilder) => {
  const wrapper = (processor: (queryDSL: VQueryDSL, context: { vbiDSL: VBIDSL; builder: VBIBuilder }) => VQueryDSL) => {
    return (queryDSL: VQueryDSL): VQueryDSL => processor(queryDSL, { vbiDSL, builder })
  }

  return pipe(
    {} as VQueryDSL,
    wrapper(buildSelect),
    wrapper(buildGroupBy),
    wrapper(buildWhere),
    wrapper(buildHaving),
    wrapper(buildOrderBy),
    wrapper(buildLimit),
  )
}

const buildWhere: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const whereFilters = vbiDSL.whereFilters || []

  if (whereFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.where = {
    op: 'and',
    conditions: whereFilters.flatMap((filter) => {
      if (
        filter.operator === 'between' &&
        filter.value &&
        typeof filter.value === 'object' &&
        !Array.isArray(filter.value)
      ) {
        const conditions = []
        if (filter.value.min !== undefined && filter.value.min !== null && filter.value.min !== '') {
          conditions.push({
            field: filter.field,
            op: filter.value.leftOp === '<' ? '>' : '>=',
            value: filter.value.min,
          })
        }
        if (filter.value.max !== undefined && filter.value.max !== null && filter.value.max !== '') {
          conditions.push({
            field: filter.field,
            op: filter.value.rightOp === '<' ? '<' : '<=',
            value: filter.value.max,
          })
        }
        return conditions as any
      }

      let mappedOp = filter.operator ?? '='
      if (Array.isArray(filter.value)) {
        if (mappedOp === '=') mappedOp = 'in'
        if (mappedOp === '!=') mappedOp = 'not in'
      }

      return [
        {
          field: filter.field,
          op: mappedOp,
          value: filter.value,
        },
      ] as any
    }),
  }

  return result as VQueryDSL
}

const buildOrderBy: buildPipe = (queryDSL, context) => {
  // Order by is now handled separately via having or other mechanisms
  // This function is kept for potential future use
  void context
  return queryDSL
}

const buildSelect: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const measures = vbiDSL.measures
  const dimensions = vbiDSL.dimensions

  const result = { ...queryDSL }
  const measureNodes = measures.filter((measure) => MeasuresBuilder.isMeasureNode(measure))
  const measureSelects: Select<Record<string, unknown>> = measureNodes.map((measure) => {
    return {
      field: measure.field,
      alias: measure.alias,
      aggr: measure.aggregate,
    }
  })

  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))
  const dimensionSelects: Select<Record<string, unknown>> = dimensionNodes.map((dimension) => {
    return {
      field: dimension.field,
      alias: dimension.alias,
    }
  })

  result.select = measureSelects.concat(dimensionSelects)

  return result as VQueryDSL
}

const buildGroupBy: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const { vbiDSL } = context

  const dimensions = vbiDSL.dimensions
  const dimensionNodes = dimensions.filter((dimension) => DimensionsBuilder.isDimensionNode(dimension))

  result.groupBy = dimensionNodes.map((dimension) => dimension.field)
  return result as VQueryDSL
}

const buildLimit: buildPipe = (queryDSL, context) => {
  const result = { ...queryDSL }
  const limit = context.vbiDSL.limit ?? 1000
  result.limit = limit

  return result as VQueryDSL
}

const buildHaving: buildPipe = (queryDSL, context) => {
  const { vbiDSL } = context
  const havingFilters = vbiDSL.havingFilters || []

  if (havingFilters.length === 0) {
    return queryDSL
  }

  const result = { ...queryDSL }
  result.having = {
    op: 'and',
    conditions: havingFilters.map((filter) => {
      const mappedOp = filter.operator ?? '='

      return {
        field: filter.field,
        op: mappedOp,
        value: filter.value,
      } as any
    }),
  }

  return result as VQueryDSL
}
