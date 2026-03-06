import type { SelectQueryBuilder } from 'kysely'

type OrderByItem = {
  field: string
  order?: 'asc' | 'desc'
}

export const applyOrder = <DB, TB extends keyof DB & string, O>(
  qb: SelectQueryBuilder<DB, TB, O>,
  orderBy?: Array<OrderByItem>,
) => {
  if (orderBy && orderBy.length > 0) {
    orderBy.forEach((o) => {
      // @ts-expect-error - Kysely orderBy type complexity
      qb = qb.orderBy(o.field, o.order ?? 'asc')
    })
  }
  return qb
}
