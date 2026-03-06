import type { QueryDSL, VQueryDSL } from 'src/types'
import { Kysely } from 'kysely'
import { PostgresDialect } from './dialect'
import { inlineParameters } from './compile'
import { applyWhere, applyGroupBy, applyHaving, applyLimit, applyOrder, applySelect } from './builders'

export const convertDSLToSQL = <T, TableName extends string>(
  dsl: QueryDSL<T> | VQueryDSL<T>,
  tableName: TableName,
): string => {
  const db = new Kysely<Record<TableName, T>>({
    dialect: new PostgresDialect(),
  })

  let qb = db.selectFrom(tableName)

  qb = applySelect(qb, dsl.select)
  qb = applyWhere(qb, dsl.where)
  qb = applyGroupBy(qb, dsl.groupBy as string[] | undefined)
  qb = applyHaving(qb, dsl.having)
  qb = applyOrder(qb, dsl.orderBy as Array<{ field: string; order?: 'asc' | 'desc' }> | undefined)
  qb = applyLimit(qb, dsl.limit)

  const { sql, parameters } = qb.compile()
  return inlineParameters(sql, parameters)
}
