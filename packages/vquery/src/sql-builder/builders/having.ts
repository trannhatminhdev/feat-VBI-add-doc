import type { RawBuilder, SelectQueryBuilder } from 'kysely'
import type { Having, HavingAggregation, HavingClause } from 'src/types'
import { sql } from 'kysely'
import { toSqlOperator } from '../utils'

const AGGREGATE_FUNCTIONS = [
  'sum',
  'avg',
  'count',
  'count_distinct',
  'min',
  'max',
  'variance',
  'variance_pop',
  'stddev',
  'median',
  'quantile',
] as const

const isAggregateFunction = (func: string): boolean => {
  return AGGREGATE_FUNCTIONS.includes(func as (typeof AGGREGATE_FUNCTIONS)[number])
}

const toAggregateExpression = (func: string, field: string, aggr?: HavingAggregation): RawBuilder<unknown> => {
  switch (func) {
    case 'count':
      return sql`count(${sql.ref(field)})`
    case 'count_distinct':
      return sql`count(distinct ${sql.ref(field)})`
    case 'variance':
      return sql`var_samp(${sql.ref(field)})`
    case 'variance_pop':
      return sql`var_pop(${sql.ref(field)})`
    case 'quantile':
      return sql`quantile(${sql.ref(field)}, ${aggr?.quantile ?? 0.5})`
    default:
      return sql`${sql.raw(func)}(${sql.ref(field)})`
  }
}

export const applyHaving = <DB, TB extends keyof DB & string, O, T>(
  qb: SelectQueryBuilder<DB, TB, O>,
  having?: Having<T> | HavingClause<T>,
): SelectQueryBuilder<DB, TB, O> => {
  if (!having) {
    return qb
  }

  const toRaw = (h: Having<T> | HavingClause<T>): RawBuilder<boolean> => {
    if ('op' in h && 'conditions' in h) {
      const parts: RawBuilder<boolean>[] = (h.conditions as Array<HavingClause<T>>).map((c) => toRaw(c))
      const sep: RawBuilder<unknown> = sql` ${sql.raw(h.op)} `
      return sql<boolean>`(${sql.join(parts, sep)})`
    }
    const leaf = h as unknown as {
      field: Extract<keyof T, string>
      op: string
      value?: unknown
      aggr: HavingAggregation
    }
    const field = leaf.field
    const value = leaf.value
    if (!leaf.aggr?.func || !isAggregateFunction(leaf.aggr.func)) {
      throw new Error(`Invalid having clause for field "${String(field)}": aggr.func is required`)
    }
    const compareOp = toSqlOperator(leaf.op.trim().toLowerCase())
    const leftExpr: RawBuilder<unknown> = toAggregateExpression(leaf.aggr.func, field, leaf.aggr)

    switch (compareOp) {
      case 'is null':
        return sql<boolean>`${leftExpr} is null`
      case 'is not null':
        return sql<boolean>`${leftExpr} is not null`
      case 'in': {
        const items = Array.isArray(value) ? (value as unknown[]) : [value]
        return sql<boolean>`${leftExpr} in (${sql.join(items.map((v) => sql.val(v)))})`
      }
      case 'not in': {
        const items = Array.isArray(value) ? (value as unknown[]) : [value]
        return sql<boolean>`not ${leftExpr} in (${sql.join(items.map((v) => sql.val(v)))})`
      }
      case 'between': {
        const [a, b] = value as [unknown, unknown]
        return sql<boolean>`${leftExpr} between ${sql.val(a)} and ${sql.val(b)}`
      }
      case 'not between': {
        const [a, b] = value as [unknown, unknown]
        return sql<boolean>`${leftExpr} not between ${sql.val(a)} and ${sql.val(b)}`
      }
      default:
        return sql<boolean>`${leftExpr} ${sql.raw(compareOp)} ${sql.val(value)}`
    }
  }
  return qb.having(toRaw(having))
}
