import { QueryDSL, VQueryDSL } from 'src/types'
import { Kysely, sql } from 'kysely'
import { PostgresDialect } from './dialect'
import { inlineParameters } from './compile'
import { applyWhere, applyGroupBy, applyLimit } from './builders'
import { isSelectItem } from './utils'

type TableDB<TableName extends string, Row> = {
  [K in TableName]: Row
}

const DATE_FORMAT_MAP: Record<string, string> = {
  year: '%Y',
  month: '%Y-%m',
  day: '%Y-%m-%d',
  week: '%Y-W%W',
  hour: '%Y-%m-%d %H',
  minute: '%Y-%m-%d %H:%M',
  second: '%Y-%m-%d %H:%M:%S',
}

export const convertDSLToSQL = <T, TableName extends string>(
  dsl: QueryDSL<T> | VQueryDSL<T>,
  tableName: TableName,
): string => {
  const db = new Kysely<TableDB<TableName, T>>({ dialect: new PostgresDialect() })

  let qb = db.selectFrom(tableName)

  if (dsl.select && dsl.select.length > 0) {
    qb = qb.select((eb) =>
      dsl.select.map((item) => {
        if (isSelectItem(item)) {
          const field = item.field as Extract<keyof T, string>
          const expression = eb.ref(field)

          if (item.aggr) {
            const { func } = item.aggr
            const alias = item.alias ?? (field as string)
            if (['avg', 'sum', 'min', 'max', 'variance', 'variancePop', 'stddev', 'median'].includes(func)) {
              if (func === 'variance') {
                return sql`var_samp(${expression})`.as(alias)
              }
              if (func === 'variancePop') {
                return sql`var_pop(${expression})`.as(alias)
              }
              return sql`${sql.raw(func)}(${expression})`.as(alias)
            } else if (func === 'count') {
              return sql`CAST(count(${expression}) AS INTEGER)`.as(alias)
            } else if (func === 'quantile') {
              const q = item.aggr.quantile ?? 0.5
              return sql`quantile(${expression}, ${q})`.as(alias)
            } else if (func === 'count_distinct') {
              return sql`CAST(count(distinct ${expression}) AS INTEGER)`.as(alias)
            } else if (func.startsWith('to_')) {
              const dateTrunc = func.replace('to_', '')
              const format = DATE_FORMAT_MAP[dateTrunc]
              if (format) {
                return sql`strftime(${expression}, ${format})`.as(alias)
              }
              if (dateTrunc === 'quarter') {
                return sql`strftime(${expression}, '%Y') || '-Q' || date_part('quarter', ${expression})`.as(alias)
              }
              return sql`date_trunc(${dateTrunc}, ${expression})`.as(alias)
            }
          }
          const alias = item.alias ?? (field as string)
          return expression.as(alias)
        }
        return item as Extract<keyof T, string>
      }),
    )
  } else {
    qb = qb.selectAll()
  }

  if (dsl.where) {
    qb = qb.where(applyWhere<T>(dsl.where))
  }

  qb = applyGroupBy(qb, dsl.groupBy as Array<Extract<keyof T, string>> | undefined)

  if (dsl.orderBy && dsl.orderBy.length > 0) {
    for (const o of dsl.orderBy) {
      qb = qb.orderBy(o.field as Extract<keyof T, string>, (o.order ?? 'asc') as 'asc' | 'desc')
    }
  }

  qb = applyLimit(qb, dsl.limit)

  const compiled = qb.compile()
  return inlineParameters(compiled.sql, compiled.parameters)
}
